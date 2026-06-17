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
  define: {
    // Disabilita le funzionalità di Lovable in produzione
    __LOVABLE_DISABLED__: mode === 'production' ? 'true' : 'false',
    'process.env.VITE_USE_LOVABLE_AUTH': JSON.stringify('false'),
  },
  build: {
    rollupOptions: {
      external: [
        '@capacitor/core',
        '@capacitor/geolocation',
        '@capacitor/google-maps',
        // Escludi Lovable
        'lovable-tagger',
        'lovable-auth',
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
      'lovable-tagger',
      'lovable-auth',
    ],
  },
}));
