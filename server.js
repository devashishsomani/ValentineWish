#!/usr/bin/env node
/**
 * Simple static server with live reload (no BrowserSync).
 * Now includes API for cross-device custom link storage.
 * Run: node server.js  or  npm run dev:static
 */
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT) || 7777;
const CONFIG_DIR = path.join(__dirname, ".valentine-configs");
const MIMES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

/** SSE clients to notify on file change */
const reloadClients = [];

// Ensure config directory exists
if (!fs.existsSync(CONFIG_DIR)) {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
}

function notifyReload() {
  reloadClients.forEach((res) => {
    try {
      res.write("data: reload\n\n");
    } catch (_) {}
  });
  reloadClients.length = 0;
}

/** Save custom config to file */
function saveConfig(id, data) {
  const filePath = path.join(CONFIG_DIR, `${id}.json`);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data), "utf8");
    return true;
  } catch (err) {
    console.error("Failed to save config:", err);
    return false;
  }
}

/** Load custom config from file */
function loadConfig(id) {
  const filePath = path.join(CONFIG_DIR, `${id}.json`);
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf8");
      return JSON.parse(data);
    }
    return null;
  } catch (err) {
    console.error("Failed to load config:", err);
    return null;
  }
}

function watchDir(dir, baseLen) {
  try {
    fs.readdirSync(dir, { withFileTypes: true }).forEach((ent) => {
      const full = path.join(dir, ent.name);
      if (ent.name === "node_modules" || ent.name.startsWith(".")) return;
      if (ent.isDirectory()) {
        watchDir(full, baseLen);
      } else {
        fs.watch(full, (_, filename) => {
          if (filename && /\.(html|css|js|json)$/i.test(filename)) {
            console.log("Changed:", path.relative(__dirname, full));
            notifyReload();
          }
        });
      }
    });
  } catch (_) {}
}

const server = http.createServer((req, res) => {
  const pathname = req.url.split("?")[0];

  // Live reload SSE endpoint
  if (pathname === "/reload") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    reloadClients.push(res);
    req.on("close", () => {
      const i = reloadClients.indexOf(res);
      if (i !== -1) reloadClients.splice(i, 1);
    });
    return;
  }

  // API: Save custom config (POST /api/config)
  if (pathname === "/api/config" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
      // Prevent huge payloads
      if (body.length > 10 * 1024 * 1024) {
        res.writeHead(413, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Payload too large" }));
        req.connection.destroy();
      }
    });
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        if (!data.id || !data.config) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Missing id or config" }));
          return;
        }
        const saved = saveConfig(data.id, data.config);
        if (saved) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true, id: data.id }));
        } else {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Failed to save config" }));
        }
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });
    return;
  }

  // API: Load custom config (GET /api/config/:id)
  if (pathname.startsWith("/api/config/") && req.method === "GET") {
    const id = pathname.substring("/api/config/".length);
    if (!id || !/^[a-z0-9]+$/.test(id)) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid ID" }));
      return;
    }
    const config = loadConfig(id);
    if (config) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, config }));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Config not found" }));
    }
    return;
  }

  // Serve static files
  let file = pathname === "/" ? "/index.html" : pathname;
  file = path.join(__dirname, file);

  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(err.code === "ENOENT" ? 404 : 500);
      res.end(err.code === "ENOENT" ? "Not Found" : "Server Error");
      return;
    }
    const ext = path.extname(file);
    res.setHeader("Content-Type", MIMES[ext] || "application/octet-stream");
    if (ext === ".html" && data) {
      const inject = `<script>(function(){var e=new EventSource('/reload');e.onmessage=function(){e.close();location.reload();};})();</script></body>`;
      data = Buffer.from(data.toString().replace("</body>", inject));
    }
    res.writeHead(200);
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`ValentineWish: http://localhost:${PORT}/`);
  console.log("Live reload enabled for .html, .css, .js, .json");
  watchDir(__dirname, __dirname.length);
});
