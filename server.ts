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
import { Readable } from "stream";
import {
  AEO_UPSTREAM,
  AEO_BRAND_SLUG,
  AEO_LEGACY_BLOG_PREFIX,
  BLOG_PATH,
} from "./src/aeoBlog";

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

/**
 * A token short enough to guess is the same as no token.
 *
 * Emptiness was the only thing checked, so ADMIN_TOKEN=1234 started the server
 * and looked exactly as secure as a real one. Nothing throttles a wrong guess
 * either, so a short token is not a smaller door — it is an open one that takes
 * a few seconds to walk through.
 *
 * 32 is a floor, not a recommendation: .env.example generates 64 hex characters
 * from 32 random bytes, which is what to use. Refusing to start is the point —
 * a warning in a log nobody reads would leave the weak token in service.
 */
const MIN_TOKEN_LENGTH = 32;

if (ADMIN_TOKEN.length < MIN_TOKEN_LENGTH) {
  console.error(
    `ADMIN_TOKEN chỉ dài ${ADMIN_TOKEN.length} ký tự, cần ít nhất ${MIN_TOKEN_LENGTH}.\n` +
      "Server từ chối khởi động: một token ngắn thì đoán ra được, mà không có gì\n" +
      "chặn việc đoán nhiều lần.\n\n" +
      "Sinh token mới bằng:\n" +
      `  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
  );
  process.exit(1);
}

/**
 * /blog is another server's pages, answering as if they were this site's.
 *
 * The articles live in AEO and are served from app.aeo.how. Proxying them under
 * this domain rather than linking out is the whole point: a link hands the
 * ranking to app.aeo.how, while a rewrite keeps it on gift.luclam.vn, where the
 * rest of the site already earns it.
 *
 * The addresses themselves live in src/aeoBlog.ts, because smoke.ts asserts
 * against the same ones.
 */

/** Long enough for a cold render upstream, short enough to fail rather than hang. */
const BLOG_TIMEOUT_MS = 15_000;

/**
 * Sent upstream. An allowlist, because the two headers that must not travel are
 * dangerous in ways a denylist tends to miss on the next edit.
 *
 * Host is the first: Cloudflare answers 403 to a Host it does not have a custom
 * hostname for, so forwarding the visitor's Host — which is what every proxy
 * tutorial tells you to do — breaks this outright. fetch sets Host from the URL,
 * so the fix is simply never to copy it.
 *
 * Cookie is the second. Blog pages are public and need no identity, and this
 * site's cookies belong to this site.
 *
 * accept-encoding is absent on purpose; see BLOG_STRIP_HEADERS.
 */
const BLOG_FORWARD_HEADERS = [
  "accept",
  "accept-language",
  "user-agent",
  "referer",
  "if-none-match",
  "if-modified-since",
] as const;

/**
 * Dropped from the upstream response.
 *
 * The hop-by-hop names are the usual list — they describe one connection and
 * mean nothing on the next.
 *
 * content-encoding and content-length are the subtle pair. fetch decompresses
 * the body before handing it over, so by the time it is piped out it is plain
 * bytes while the upstream headers still say gzip and give the compressed
 * length. Copying either sends the browser to decode something already decoded.
 * Dropping both leaves the response uncompressed and unmeasured, which is
 * exactly the state compression() above knows how to handle — it compresses
 * anything without a Content-Encoding, so the visitor still gets gzip, just
 * this server's rather than AEO's.
 */
const BLOG_STRIP_HEADERS = new Set([
  "connection",
  "keep-alive",
  "transfer-encoding",
  "upgrade",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "content-encoding",
  "content-length",
]);

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

  /**
   * The blog, proxied. See AEO_UPSTREAM above for why it is proxied at all.
   *
   * Position in the middleware stack is load-bearing in both directions, which
   * is why this sits wedged between two things rather than anywhere tidy.
   *
   * It must come after compression(), so the decompressed upstream body gets
   * gzipped on the way out — a blog index is 95KB of HTML, and serving that
   * uncompressed to a crawler undoes the reason for hosting it here.
   *
   * It must come before express.json(), which would otherwise read and buffer
   * the body of every request through here against a 20MB limit, and before the
   * static handler and the catch-all far below, which answer 404 for anything
   * without a file on disk. /blog has no file on disk. Move this line down and
   * the blog stops existing.
   *
   * Mounted with app.use, so it takes /blog and everything under it — and only
   * those: Express matches mount paths on segment boundaries, so /blogging is
   * left alone.
   */
  app.use(BLOG_PATH, async (req, res) => {
    // Read-only, and stated rather than assumed. Anything else would reach
    // upstream with no body, since express.json() has not run yet, and fail
    // there in a way that reads as AEO being broken.
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.setHeader("Allow", "GET, HEAD");
      return res.status(405).json({ error: "Blog chỉ phục vụ đọc" });
    }

    // From originalUrl rather than req.url: inside a mount, Express rewrites
    // req.url to the remainder and turns "/blog?page=2" into "/?page=2", which
    // would reach upstream as "/blog/?page=2" — a different URL, and one that
    // redirects. Slicing the prefix off originalUrl keeps the query attached to
    // the path the visitor actually asked for.
    const rest = req.originalUrl.slice(BLOG_PATH.length);
    const target = `${AEO_UPSTREAM}${AEO_LEGACY_BLOG_PREFIX}${rest}`;

    const headers: Record<string, string> = {};
    for (const name of BLOG_FORWARD_HEADERS) {
      const value = req.get(name);
      if (value) headers[name] = value;
    }

    let upstream: Awaited<ReturnType<typeof fetch>>;
    try {
      upstream = await fetch(target, {
        method: req.method,
        headers,
        // Followed here, a redirect would be fetched server-side and returned
        // as though it were the original URL, so the visitor's address bar
        // never learns anything moved. Handed back instead, the browser follows
        // it and the URL stays honest.
        redirect: "manual",
        signal: AbortSignal.timeout(BLOG_TIMEOUT_MS),
      });
    } catch (e: any) {
      const why =
        e?.name === "TimeoutError"
          ? `không trả lời trong ${BLOG_TIMEOUT_MS / 1000}s`
          : e?.message ?? "lỗi không rõ";
      console.error(`Blog upstream ${target} — ${why}`);
      return res
        .status(502)
        .type("text/plain; charset=utf-8")
        .send("Blog tạm thời không truy cập được. Phần còn lại của trang vẫn hoạt động.");
    }

    res.status(upstream.status);
    upstream.headers.forEach((value, name) => {
      if (!BLOG_STRIP_HEADERS.has(name.toLowerCase())) res.setHeader(name, value);
    });

    // What ProxyPassReverse does in Apache. A redirect upstream writes names
    // app.aeo.how, and a visitor who follows one leaves this domain mid-visit
    // and lands on a URL whose canonical points back here — so the trip is both
    // visible and pointless. Set after the copy loop, so it overwrites.
    const location = upstream.headers.get("location");
    if (location) {
      res.setHeader(
        "location",
        location.replace(`${AEO_UPSTREAM}${AEO_LEGACY_BLOG_PREFIX}`, BLOG_PATH)
      );
    }

    // HEAD, 304 and friends carry no body.
    if (!upstream.body) return res.end();

    Readable.fromWeb(upstream.body as any)
      .on("error", (e: Error) => {
        // Headers are already sent, so there is no status left to change —
        // dropping the connection is the only honest signal available.
        console.error(`Blog upstream ${target} đứt giữa chừng — ${e.message}`);
        res.destroy();
      })
      .pipe(res);
  });

  /**
   * The blog's own links, caught and sent to the path this site actually serves.
   *
   * AEO writes internal links from the custom domain declared against the brand.
   * With none declared it falls back to its own layout and every link on the
   * blog index reads /<brand-slug>/blog/<article>. That path is not proxied
   * here, matches no generated file, and so answers 404 — measured at seventeen
   * out of seventeen. The blog index itself was a perfectly healthy 200 the
   * whole time, which is what made it easy to miss: a crawler arrives, indexes
   * one page, follows every link out of it into a wall, and the articles this
   * integration exists to promote are never read.
   *
   * Declaring the domain in AEO is the actual fix and makes this dead code. It
   * stays because dead is the point — the day AEO's config is lost, restored
   * from an older backup, or edited by someone who does not know what depends on
   * it, the difference between this line existing and not is whether the blog
   * degrades or disappears.
   *
   * 301 rather than a second proxy mount, because two paths serving identical
   * articles is a duplicate-content problem, and a permanent redirect is the one
   * signal that tells a crawler to keep the destination and forget the source.
   * It cannot loop: it only ever points into BLOG_PATH, which proxies.
   */
  app.use(AEO_LEGACY_BLOG_PREFIX, (req, res) => {
    const rest = req.originalUrl.slice(AEO_LEGACY_BLOG_PREFIX.length);
    res.redirect(301, `${BLOG_PATH}${rest}`);
  });

  // Setup JSON parser with large limit to allow rich custom configurations and media arrays
  app.use(express.json({ limit: "20mb" }));

  /**
   * A wrong token answers slower every time. A right one never waits.
   *
   * timingSafeEqual keeps the comparison from leaking the token, but nothing
   * stopped a caller simply trying again as fast as the network allowed. The
   * comparison was safe; the door was not.
   *
   * The order matters, and the first version of this got it backwards. Refusing
   * a request outright while a penalty was running turned the defence into the
   * attack: anyone could spam wrong tokens and lock the real operator out, and
   * behind one office NAT they share an address, so it took no privilege at all.
   * It also never escalated, because a blocked request returned before reaching
   * the counter.
   *
   * So the token is checked first, always. A correct one clears the record and
   * passes immediately. Only a wrong one pays — the response is held for a
   * delay that doubles from 250ms to a 10s ceiling, which costs a guesser
   * everything and an operator who mistyped once about a quarter of a second.
   *
   * `trust proxy` makes req.ip the visitor rather than nginx. It is safe only
   * because the server binds 127.0.0.1: X-Forwarded-For is trivially forged, so
   * trusting it would let a guesser rotate keys and dodge this — but nothing
   * outside the host can open a connection to forge it with.
   */
  app.set("trust proxy", 1);

  const failures = new Map<string, { count: number; last: number }>();
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  // Bounded, so a spray of addresses cannot grow this without limit.
  function forget(now: number) {
    if (failures.size < 1000) return;
    for (const [key, entry] of failures) {
      if (now - entry.last > 60 * 60_000) failures.delete(key);
    }
  }

  // Guards the endpoints that write to disk. Read endpoints stay public.
  async function requireAdmin(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const who = req.ip ?? "unknown";
    const header = req.get("authorization") ?? "";
    const prefix = "Bearer ";

    let ok = false;
    if (header.startsWith(prefix)) {
      const supplied = Buffer.from(header.slice(prefix.length));
      const expected = Buffer.from(ADMIN_TOKEN as string);
      // Length is compared first because timingSafeEqual throws on a length
      // mismatch. Leaking the token's length is acceptable; leaking its bytes
      // through response timing is not.
      ok =
        supplied.length === expected.length &&
        crypto.timingSafeEqual(supplied, expected);
    }

    if (ok) {
      failures.delete(who);
      return next();
    }

    const now = Date.now();
    const count = (failures.get(who)?.count ?? 0) + 1;
    forget(now);
    failures.set(who, { count, last: now });

    const wait = Math.min(250 * 2 ** (count - 1), 10_000);
    res.setHeader("Retry-After", String(Math.ceil(wait / 1000)));
    await sleep(wait);

    return res.status(401).json({
      error: header.startsWith(prefix)
        ? "Token không hợp lệ"
        : "Thiếu token xác thực",
    });
  }

  const CONFIG_PATH = path.join(process.cwd(), "public", "config.json");
  const uploadsDir = path.join(process.cwd(), "public", "uploads");

  // Ensure public/uploads directory exists
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  /**
   * Serve uploads, and never let the browser second-guess their type.
   *
   * nosniff stops content sniffing from promoting a file to something
   * executable on the strength of its bytes. The extension allowlist on upload
   * is the real control — this is the belt to its braces.
   */
  app.use(
    "/uploads",
    express.static(uploadsDir, {
      setHeaders: (res) => res.setHeader("X-Content-Type-Options", "nosniff"),
    })
  );

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

  // GIFs pass through untouched — re-encoding one loses the animation, and they
  // are rare enough here not to be worth the animated-WebP path — so they sit in
  // the VERBATIM list beside the video containers, at the point of use.

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

      const ext = fileExt.toLowerCase();
      const claimsMedia =
        String(fileType ?? "").startsWith("image/") ||
        String(fileType ?? "").startsWith("video/");

      // sharp re-encodes these to WebP, so whatever arrives, a picture leaves.
      const RASTERISED = /^\.(jpe?g|png|webp|avif|tiff?|svg)$/;
      // Written byte for byte, so the list is short and every entry is a
      // container the browser will never execute.
      const VERBATIM = /^\.(gif|mp4|webm|mov|m4v|ogv)$/;

      if (!RASTERISED.test(ext) && !VERBATIM.test(ext)) {
        return res.status(400).json({
          error:
            `Không nhận định dạng "${ext || "không rõ"}". Chỉ nhận ảnh ` +
            "(jpg, png, webp, avif, tiff, svg, gif) và video (mp4, webm, mov, m4v, ogv).",
        });
      }
      if (!claimsMedia && fileType) {
        return res.status(400).json({
          error: `Kiểu tệp "${fileType}" không phải ảnh hoặc video.`,
        });
      }

      // svg is in the rasterised set on purpose. It is an image by every test
      // this used to apply, and it is also a document that can carry script —
      // served from public/uploads that is script on this site's own origin,
      // with the admin token sitting in localStorage a few lines away. Passing
      // it through sharp means what lands on disk is a WebP and the markup
      // never survives the trip.
      const optimise = RASTERISED.test(ext);

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
  /** A plain object, not an array and not a string that happens to be truthy. */
  const isPlainObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null && !Array.isArray(value);

  /**
   * Saving is atomic, and the version it replaces is kept.
   *
   * This wrote straight over config.json. A process killed mid-write — an OOM
   * during a build on a small VPS is the likely one — leaves the file truncated,
   * and the prerenderer refuses to build on invalid JSON by design. So a half
   * written save did not cost one edit, it blocked every deploy until somebody
   * repaired the file by hand, with no earlier copy to repair it from.
   *
   * Writing to a temp file in the same directory and renaming makes the swap
   * atomic: rename(2) on one filesystem either happens or does not, so a reader
   * sees the old file or the new one and never half of either. The previous good
   * version is kept beside it, which is the difference between an accident and a
   * loss — Creator Studio's export button is the only other copy that exists.
   */
  app.post("/api/config", requireAdmin, async (req, res) => {
    try {
      const { overrides, customMedia } = req.body;

      // `overrides || {}` accepted a string, which would be written out and then
      // read back by the prerenderer as content it cannot use.
      if (overrides !== undefined && !isPlainObject(overrides)) {
        return res.status(400).json({ error: "overrides phải là một object" });
      }
      if (customMedia !== undefined && !isPlainObject(customMedia)) {
        return res.status(400).json({ error: "customMedia phải là một object" });
      }

      const dataToSave = {
        overrides: overrides ?? {},
        customMedia: customMedia ?? {},
      };
      const serialised = JSON.stringify(dataToSave, null, 2);

      // Parsed back before it is allowed near the real file: a value that cannot
      // survive the round trip is one the prerenderer would choke on later.
      JSON.parse(serialised);

      if (fs.existsSync(CONFIG_PATH)) {
        await fs.promises.copyFile(CONFIG_PATH, `${CONFIG_PATH}.bak`);
      }

      const tmp = `${CONFIG_PATH}.${process.pid}.tmp`;
      const handle = await fs.promises.open(tmp, "w");
      try {
        await handle.writeFile(serialised, "utf-8");
        // Flush before the rename, or the rename can land while the bytes are
        // still in the page cache and a crash leaves an empty file behind it.
        await handle.sync();
      } finally {
        await handle.close();
      }
      await fs.promises.rename(tmp, CONFIG_PATH);

      res.json({ status: "success" });
    } catch (e: any) {
      console.error("Error saving config:", e);
      res.status(500).json({ error: "Failed to save configuration" });
    }
  });

  // Health check API
  /**
   * What is actually on the server, and a way to remove it.
   *
   * Creator Studio's media library lists IndexedDB — what this browser has
   * uploaded — so a second machine, or the same one after clearing storage,
   * showed nothing while the disk kept every file ever sent. Nothing could
   * delete one either: `app.delete` did not exist, so the only way to reclaim
   * space was ssh. On a small VPS that is a disk that fills and never empties.
   *
   * Both are guarded. The files themselves are public — they are served from
   * /uploads — but a list of everything an operator has ever uploaded is not the
   * same as the files being individually reachable, and deletion obviously is
   * not public.
   */
  app.get("/api/uploads", requireAdmin, async (req, res) => {
    try {
      const names = await fs.promises.readdir(uploadsDir);
      const files = await Promise.all(
        names.map(async (name) => {
          const stat = await fs.promises.stat(path.join(uploadsDir, name));
          return { name, url: `/uploads/${name}`, bytes: stat.size, modified: stat.mtimeMs };
        })
      );
      // Newest first: the file someone wants to remove is usually one just sent.
      files.sort((a, b) => b.modified - a.modified);
      res.json({ files });
    } catch (e: any) {
      console.error("Error listing uploads:", e);
      res.status(500).json({ error: "Không đọc được thư mục uploads" });
    }
  });

  app.delete("/api/uploads/:name", requireAdmin, async (req, res) => {
    const { name } = req.params;

    /**
     * The name is matched against what upload() generates, not merely cleaned.
     *
     * A blocklist of "../" is the wrong shape for this: the parameter arrives
     * URL-decoded, so %2e%2e%2f has already become ../ by the time it is read,
     * and there are more encodings than anyone enumerates correctly. Accepting
     * only `<digits>-<word>.<ext>` makes traversal unrepresentable rather than
     * filtered.
     */
    if (!/^\d+-[A-Za-z0-9_]+\.[A-Za-z0-9]{2,5}$/.test(name)) {
      return res.status(400).json({ error: "Tên tệp không hợp lệ" });
    }

    const target = path.join(uploadsDir, name);
    // Belt to the pattern's braces: whatever the name did, the file being
    // removed has to sit directly inside the uploads directory.
    if (path.dirname(path.resolve(target)) !== path.resolve(uploadsDir)) {
      return res.status(400).json({ error: "Tên tệp không hợp lệ" });
    }

    try {
      await fs.promises.unlink(target);
      console.log(`Đã xoá ${target}`);
      res.json({ status: "success" });
    } catch (e: any) {
      if (e.code === "ENOENT") {
        return res.status(404).json({ error: "Không có tệp này" });
      }
      console.error("Error deleting upload:", e);
      res.status(500).json({ error: "Không xoá được tệp" });
    }
  });

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

    /**
     * The two directories whose filenames change whenever their bytes do.
     *
     * serve-static sends `max-age=0` unless told otherwise, so every return
     * visit re-requested 575KB of JavaScript and 93KB of CSS and got 304s for
     * its trouble — a round trip per file before the page could paint, on a
     * site whose visitors are on Saigon mobile data.
     *
     * A year is only safe because the URL changes with the content. Vite writes
     * a content hash into every name it emits (index-BMl1HaUo.js), so a rebuild
     * that changes a byte publishes a different path and the HTML — which is
     * NOT cached this way — points at it on the next load. The font files are
     * the same bargain from Google's side: their names are derived from the
     * subset they contain, and scripts/fetch-fonts.ts vendors them under those
     * names rather than renaming them.
     *
     * `immutable` is the part that matters for a reload. Without it a browser
     * revalidates on refresh even inside max-age, which is exactly when someone
     * checking whether a fix went live pays for every file again.
     *
     * Deliberately not applied to the rest of dist. The sixty HTML pages are
     * rewritten in place by `npm run build` whenever Creator Studio changes the
     * content, at the same URLs — caching those for a year would mean an editor
     * publishes a correction and returning readers keep the old page until 2027.
     * Same for sitemap.xml, robots.txt and llms.txt. And uploads keep whatever
     * name they were given (cover-benthanh-1200.avif), so their bytes can change
     * under a stable URL; they are served by their own handler far above, which
     * this does not touch.
     */
    const HASHED = { immutable: true, maxAge: "365d" };
    app.use("/assets", express.static(path.join(distPath, "assets"), HASHED));
    app.use("/fonts", express.static(path.join(distPath, "fonts"), HASHED));

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

  const server = app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
  });

  /**
   * A busy port should say so, not throw a stack trace.
   *
   * listen() reports failure as an 'error' event, and with nothing listening for
   * it Node rethrows as an unhandled exception. Under systemd with
   * Restart=always that is a crash loop, restarting every few seconds against a
   * port that is not going to free itself, with the reason buried in a trace.
   */
  server.on("error", (e: NodeJS.ErrnoException) => {
    if (e.code === "EADDRINUSE") {
      console.error(
        `Cổng ${PORT} đang bị tiến trình khác chiếm trên ${HOST}.\n` +
          "Dừng tiến trình đó, hoặc đặt PORT sang cổng khác trong .env."
      );
    } else if (e.code === "EACCES") {
      console.error(
        `Không có quyền mở cổng ${PORT}. Cổng dưới 1024 cần quyền root — ` +
          "hãy để nginx nhận 80/443 và chạy server này ở cổng cao."
      );
    } else {
      console.error(`Không mở được cổng ${PORT}: ${e.message}`);
    }
    process.exit(1);
  });
}

startServer();
