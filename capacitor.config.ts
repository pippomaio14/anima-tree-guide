import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.anima.treeguide",
  appName: "Anima Tree Guide",
  webDir: "dist",
  
  // RIMUOVI COMPLETAMENTE LA SEZIONE "server" - NON DEVE ESSERCI!
  // Non usare url remoto, altrimenti l'app va su Lovable
  
  plugins: {
    GoogleMaps: {
      apiKey: 'AIzaSyCLUtn_ue87Sn3D_VdpDQO6RaeH4tgzLIc',
    },
    Geolocation: {
      permissions: {
        location: "always",
      },
    },
  },
  
  android: {
    allowMixedContent: true,
    webContentsDebuggingEnabled: true, // Metti true per debug
  },
};

export default config;
