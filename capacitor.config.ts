import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.anima.treeguide",
  appName: "Anima Tree Guide",
  webDir: "dist",
  
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
    webContentsDebuggingEnabled: true, // IMPORTANTE: TRUE
  },
  
  // ✅ AGGIUNGI QUESTA SEZIONE PER DEBUG
  server: {
    androidScheme: "https",
    cleartext: true,
  },
};

export default config;
