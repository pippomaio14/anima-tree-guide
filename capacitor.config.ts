import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.anima.treeguide",
  appName: "Anima Tree Guide",
  webDir: "dist",
  
  // ✅ CONFIGURAZIONE SERVER (dal tuo file - manteniamo)
  server: {
    androidScheme: "https",
    cleartext: true,
    allowNavigation: ["*"],
  },
  
  // ✅ CONFIGURAZIONE ANDROID (dal tuo file - manteniamo)
  android: {
    allowMixedContent: true,
    webContentsDebuggingEnabled: true,
    captureInput: true,
  },
  
  // ✅ PLUGINS (uniamo entrambi)
  plugins: {
    // Google Maps - dal tuo file
    GoogleMaps: {
      apiKey: 'AIzaSyCLUtn_ue87Sn3D_VdpDQO6RaeH4tgzLIc',
    },
    // Geolocation - dal tuo file (già corretto)
    Geolocation: {
      permissions: {
        location: "always",
      },
    },
    // PushNotifications - dal mio suggerimento (per le notifiche)
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;