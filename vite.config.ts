import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { imagetools } from "vite-imagetools";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api": {
        target: process.env.VITE_BACKEND_URL || "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  plugins: [
    react(),
    imagetools(), // Image optimization
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 500, // Ensures chunks are below 500KB
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react")) return "react-vendor"; // Split React
            if (id.includes("leaflet")) return "leaflet-vendor"; // Split Leaflet
            if (id.includes("recharts")) return "recharts-vendor"; // Split Recharts
            if (id.includes("radix-ui")) return "radix-vendor"; // Split Radix UI
            if (id.includes("@tanstack/react-query")) return "react-query"; // Split React Query
          }
        },
      },
    },
  },
}));
