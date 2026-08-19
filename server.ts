// dotenv was a dependency that nothing imported, so .env sat there looking
// authoritative while the server read only what the shell had exported. The two
// drifted apart, and pasting the ADMIN_TOKEN from .env into Creator Studio
// produced 401 after 401 against a server holding a different value.
//
// This does not override a variable already in the environment, so an exported
// ADMIN_TOKEN still wins and deployments that set it that way are unaffected.
import "dotenv/config";

import express from "express";
import compression from "compression";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import sharp from "sharp";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

/**
 * The port, from the environment, defaulting to the 3000 this was pinned to.
 *
 * Hardcoded it could only ever be 3000, so a host that hands its port over in
 * $PORT — which is how most of them do it — would have had the app listening
 * somewhere nothing was looking.
 *
 * Validated rather than trusted: Number("") is 0 and Number("abc") is NaN, and
 * either would be passed to listen() as a silent request for a random free
 * port. Refusing to start is easier to diagnose than a server nobody can reach.
 */
/**
 * Loopback by default, because this sits behind a reverse proxy.
 *
 * It bound 0.0.0.0, which listens on every interface — so on a VPS the write
 * API answered directly on http://<ip>:3000, going around nginx and therefore
 * around TLS. The admin token travels in an Authorization header, so that path
 * put it on the wire in clear text, and a firewall rule was the only thing
 * standing between the internet and POST /api/config.
 *
 * A proxy on the same host reaches 127.0.0.1 fine. Set HOST=0.0.0.0 where the
 * server genuinely has to be reachable from elsewhere — a container, or another
 * machine on the LAN — and mean it when you do.
 */
const HOST = process.env.HOST?.trim() || "127.0.0.1";

const PORT = (() => {
  const raw = process.env.PORT;
  if (raw === undefined || raw.trim() === "") return 3000;
  const port = Number(raw);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    console.error(
      `PORT không hợp lệ: "${raw}". Cần một số nguyên từ 1 đến 65535.\n` +
        "Bỏ trống biến này để dùng cổng mặc định 3000."
    );
    process.exit(1);
  }
  return port;
})();

if (!ADMIN_TOKEN) {
  console.error(
    "ADMIN_TOKEN chưa được đặt. Server từ chối khởi động để không chạy ở trạng thái mở.\n" +
      "Đặt biến môi trường ADMIN_TOKEN rồi chạy lại."
  );
  process.exit(1);
}

async function startServer() {
  const app = express();

  /**
   * Compress before anything else answers, so it covers static files too.
   *
   * The built site is 1761KB of HTML, JS, CSS, XML and text against 555KB
   * gzipped — measured across the 69 compressible files in dist. Without this
   * every uncached visit paid the difference. GitHub Pages compresses on its
   * own, so this only ever mattered for the self-hosted path, which is exactly
   * the path that had no compression at all.
   *
   * Images are already AVIF/WebP and gzip cannot improve them; the default
   * filter skips them by content type, so there is nothing to configure.
   */
  app.use(compression());

  // Setup JSON parser with large limit to allow rich custom configurations and media arrays
  app.use(express.json({ limit: "20mb" }));

  // Guards the endpoints that write to disk. Read endpoints stay public.
  function requireAdmin(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const header = req.get("authorization") ?? "";
    const prefix = "Bearer ";

    if (!header.startsWith(prefix)) {
      return res.status(401).json({ error: "Thiếu token xác thực" });
    }

    const supplied = Buffer.from(header.slice(prefix.length));
    const expected = Buffer.from(ADMIN_TOKEN as string);

    // Length is compared first because timingSafeEqual throws on a length
    // mismatch. Leaking the token's length is acceptable; leaking its bytes
    // through response timing is not.
    if (
      supplied.length !== expected.length ||
      !crypto.timingSafeEqual(supplied, expected)
    ) {
      return res.status(401).json({ error: "Token không hợp lệ" });
    }

    next();
  }

  const CONFIG_PATH = path.join(process.cwd(), "public", "config.json");
  const uploadsDir = path.join(process.cwd(), "public", "uploads");

  // Ensure public/uploads directory exists
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Serve static uploads
  app.use("/uploads", express.static(uploadsDir));

  // API to fetch synchronized custom guides
  app.get("/api/config", async (req, res) => {
    try {
      if (fs.existsSync(CONFIG_PATH)) {
        const raw = await fs.promises.readFile(CONFIG_PATH, "utf-8");
        res.json(JSON.parse(raw));
      } else {
        res.json({ overrides: {}, customMedia: {} });
      }
    } catch (e: any) {
      console.error("Error loading config:", e);
      res.status(500).json({ error: "Failed to load configuration" });
    }
  });

  // Wide enough for the 430px device frame at 3x, which is the largest this
  // interface ever draws an image. Matches the middle rung of the ladder
  // scripts/optimize-images.ts builds, and its WebP quality, so an uploaded
  // image and a vendored one come out comparable.
  const MAX_UPLOAD_WIDTH = 1280;
  const WEBP_QUALITY = 72;

  // GIFs pass through untouched: re-encoding one loses the animation, and they
  // are rare enough here not to be worth the animated-WebP path.
  const PASSTHROUGH = /\.gif$/i;

  /**
   * Uploads are optimised here rather than at build time.
   *
   * npm run images walks public/uploads and derives AVIF and WebP, but it runs
   * during a build over files already on disk. Anything Creator Studio uploads
   * arrives afterwards and is served straight from public/uploads by the static
   * route above — so it never met that script. The practical effect was that an
   * operator photographing a shop on a phone published a four-megabyte LCP
   * image, and nothing in the interface said so.
   *
   * Decoding also acts as a gate. Three JPEGs in this repo are corrupt beyond
   * recovery — every byte >= 0x80 replaced before they were ever committed —
   * and they are still served today. sharp refuses to decode that kind of
   * damage, so a file it cannot read is rejected at the door instead of being
   * published and discovered months later.
   */
  app.post("/api/upload", requireAdmin, async (req, res) => {
    try {
      const { file, fileName, fileType } = req.body;
      if (!file || !fileName) {
        return res.status(400).json({ error: "Missing file or fileName" });
      }

      const base64Data = file.replace(/^data:[^;]+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      const fileExt = path.extname(fileName) || (fileType ? `.${fileType.split("/")[1]}` : ".png");
      const baseName = path.basename(fileName, fileExt).replace(/[^a-zA-Z0-9]/g, "_");

      const isImage =
        String(fileType ?? "").startsWith("image/") ||
        /\.(jpe?g|png|webp|avif|tiff?)$/i.test(fileName);
      const optimise = isImage && !PASSTHROUGH.test(fileName);

      let output = buffer;
      let outExt = fileExt;

      if (optimise) {
        try {
          output = await sharp(buffer)
            // Phone cameras record orientation in EXIF rather than in the
            // pixels; without this a portrait photo uploads on its side.
            .rotate()
            .resize({ width: MAX_UPLOAD_WIDTH, withoutEnlargement: true })
            .webp({ quality: WEBP_QUALITY })
            .toBuffer();
          outExt = ".webp";
        } catch {
          return res.status(400).json({
            error:
              "Không đọc được ảnh này — file có thể hỏng hoặc không đúng định dạng. " +
              "Hãy mở thử bằng trình xem ảnh rồi tải lại.",
          });
        }
      }

      const uniqueName = `${Date.now()}-${baseName}${outExt}`;
      const filePath = path.join(uploadsDir, uniqueName);
      await fs.promises.writeFile(filePath, output);

      const fileUrl = `/uploads/${uniqueName}`;
      const saved = buffer.length - output.length;
      console.log(
        optimise
          ? `Đã lưu ${filePath} — ${Math.round(buffer.length / 1024)} KB xuống ${Math.round(
              output.length / 1024
            )} KB (giảm ${Math.round((saved / buffer.length) * 100)}%)`
          : `Đã lưu ${filePath} (giữ nguyên, không phải ảnh tĩnh)`
      );

      res.json({
        status: "success",
        url: fileUrl,
        originalBytes: buffer.length,
        storedBytes: output.length,
        optimised: optimise,
      });
    } catch (e: any) {
      console.error("Error in upload api:", e);
      res.status(500).json({ error: e.message || "Upload failed" });
    }
  });

  // API to save/sync custom guides
  app.post("/api/config", requireAdmin, async (req, res) => {
    try {
      const { overrides, customMedia } = req.body;
      const dataToSave = {
        overrides: overrides || {},
        customMedia: customMedia || {},
      };
      await fs.promises.writeFile(
        CONFIG_PATH,
        JSON.stringify(dataToSave, null, 2),
        "utf-8"
      );
      res.json({ status: "success" });
    } catch (e: any) {
      console.error("Error saving config:", e);
      res.status(500).json({ error: "Failed to save configuration" });
    }
  });

  // Health check API
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Integration with Vite
  if (process.env.NODE_ENV !== "production") {
    // Imported here rather than at the top of the file. The build defines
    // NODE_ENV as "production", so esbuild folds this test to `if (false)` —
    // but a top-level import still emits `require("vite")`, which runs on
    // startup and pulls the whole dev toolchain into memory for a branch that
    // can never execute. Inside the branch, the production bundle has no
    // reference to vite at all.
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");

    // extensions: ["html"] so /en/food/ resolves dist/en/food/index.html.
    // Without it the catch-all below would answer every generated URL with
    // the Vietnamese homepage.
    app.use(express.static(distPath, { extensions: ["html"] }));

    app.get("*", (req, res) => {
      // Nothing matched a generated file. Answer 404 honestly — returning
      // index.html with a 200 is the soft-404 the SEO audit flagged.
      res.status(404).sendFile(path.join(distPath, "404.html"));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
  });
}

startServer();
