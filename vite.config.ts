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
    // ✅ Include esplicitamente le variabili d'ambiente
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY),
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      external: [
        '@capacitor/core',
        '@capacitor/geolocation',
        '@capacitor/google-maps',
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
