import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import newsHandler from "./api/news.js";

function localNewsApi() {
  return {
    name: "local-news-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const requestUrl = new URL(req.url, "http://localhost");
        if (requestUrl.pathname !== "/api/news") return next();

        req.query = Object.fromEntries(requestUrl.searchParams);
        res.status = (statusCode) => {
          res.statusCode = statusCode;
          return res;
        };
        res.json = (body) => {
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(body));
          return res;
        };

        await newsHandler(req, res);
      });
    },
  };
}

export default defineConfig({
  plugins: [localNewsApi(), react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: ["framer-motion", "react-icons"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  define: {
    "process.env": {},
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "axios", "zustand"],
  },
});