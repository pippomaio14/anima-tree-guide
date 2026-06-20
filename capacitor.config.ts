import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.anima.treeguide",
  appName: "Anima Tree Guide",
  webDir: "dist",
  
  // ✅ AGGIUNGI QUESTE CONFIGURAZIONI
  server: {
    androidScheme: "https",
    cleartext: true,
    allowNavigation: ["*"],
  },
  
  android: {
    allowMixedContent: true,
    webContentsDebuggingEnabled: true,
    captureInput: true,
  },
  
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
};

export default config;
