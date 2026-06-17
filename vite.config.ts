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
      // 👇 AGGIUNGI QUESTA RIGA: Reindirizza i moduli Capacitor allo shim
      '@capacitor/core': path.resolve(__dirname, 'src/capacitor-shims.ts'),
      '@capacitor/geolocation': path.resolve(__dirname, 'src/capacitor-shims.ts'),
      '@capacitor/google-maps': path.resolve(__dirname, 'src/capacitor-shims.ts'),
    },
  },
  define: {
    __LOVABLE_DISABLED__: mode === 'production' ? 'true' : 'false',
    'process.env.VITE_USE_LOVABLE_AUTH': JSON.stringify('false'),
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      external: [],
      output: {
        format: 'esm',
        inlineDynamicImports: false,
      },
    },
  },
  optimizeDeps: {
    exclude: [],
  },
}));
