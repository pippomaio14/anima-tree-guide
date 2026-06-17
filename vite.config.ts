import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      external: [
        '@capacitor/core',
        '@capacitor/geolocation',
        '@capacitor/google-maps',
      ],
      output: {
        format: 'esm',
        inlineDynamicImports: false,
      },
    },
  },
  optimizeDeps: {
    exclude: [
      '@capacitor/core',
      '@capacitor/geolocation',
      '@capacitor/google-maps',
    ],
  },
}));
