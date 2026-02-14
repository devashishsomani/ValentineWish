#!/usr/bin/env node
/**
 * Simple static server with live reload (no BrowserSync).
 * Run: node server.js  or  npm run dev:static
 */
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT) || 7777;
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

function notifyReload() {
  reloadClients.forEach((res) => {
    try {
      res.write("data: reload\n\n");
    } catch (_) {}
  });
  reloadClients.length = 0;
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
