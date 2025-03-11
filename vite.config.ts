import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { imagetools } from "vite-imagetools";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
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
