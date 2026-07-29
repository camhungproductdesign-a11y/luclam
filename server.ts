import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Setup JSON parser with large limit to allow rich custom configurations and media arrays
  app.use(express.json({ limit: "20mb" }));

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

  // API to upload media directly to the server
  app.post("/api/upload", async (req, res) => {
    try {
      const { file, fileName, fileType } = req.body;
      if (!file || !fileName) {
        return res.status(400).json({ error: "Missing file or fileName" });
      }
      
      const base64Data = file.replace(/^data:[^;]+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      
      const fileExt = path.extname(fileName) || (fileType ? `.${fileType.split('/')[1]}` : '.png');
      const baseName = path.basename(fileName, fileExt).replace(/[^a-zA-Z0-9]/g, "_");
      const uniqueName = `${Date.now()}-${baseName}${fileExt}`;
      const filePath = path.join(uploadsDir, uniqueName);
      
      await fs.promises.writeFile(filePath, buffer);
      
      const fileUrl = `/uploads/${uniqueName}`;
      console.log(`Successfully saved uploaded file to ${filePath}`);
      res.json({ status: "success", url: fileUrl });
    } catch (e: any) {
      console.error("Error in upload api:", e);
      res.status(500).json({ error: e.message || "Upload failed" });
    }
  });

  // API to save/sync custom guides
  app.post("/api/config", async (req, res) => {
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
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
