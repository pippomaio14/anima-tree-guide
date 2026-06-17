import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // -- TUTTA LA TUA CONFIGURAZIONE ESISTENTE RIMANE INVARIATA --
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // -- AGGIUNTE PER RISOLVERE IL PROBLEMA CON CAPACITOR --
  build: {
    rollupOptions: {
      // Dice a Rollup di non provare a risolvere questi moduli durante la build
      external: [
        '@capacitor/core',
        '@capacitor/geolocation',
        '@capacitor/google-maps',
      ],
      output: {
        // Mantiene il formato ESM per gli import dinamici
        format: 'esm',
        inlineDynamicImports: false,
      },
    },
  },
  // Ottimizzazione: esclude questi moduli dalla fase di ottimizzazione delle dipendenze
  optimizeDeps: {
    exclude: [
      '@capacitor/core',
      '@capacitor/geolocation',
      '@capacitor/google-maps',
    ],
  },
}));
