import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_PROXY_TARGET || "http://localhost:3000",
          changeOrigin: true,
        },
      },
    },
    build: {
      cssCodeSplit: true,
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("react-router-dom") || id.includes("react-dom") || id.includes("/react/")) {
                return "vendor-react";
              }
              if (id.includes("@tanstack/react-query")) {
                return "vendor-query";
              }
              if (id.includes("@reduxjs/toolkit") || id.includes("react-redux")) {
                return "vendor-redux";
              }
              if (id.includes("lucide-react")) {
                return "vendor-icons";
              }
              if (id.includes("axios")) {
                return "vendor-network";
              }
            }
          },
        },
      },
    },
  };
});
