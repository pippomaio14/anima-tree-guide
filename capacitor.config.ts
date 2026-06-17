import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.anima.treeguide",
  appName: "anima-tree-guide",
  webDir: "dist",
  //server: {
  // url: "https://6a98369d-645a-45a8-9d64-5f6f4467b581.lovableproject.com?forceHideBadge=true",
  // cleartext: true,
  //},
  plugins: {
    GoogleMaps: {
      apiKey: 'AIzaSyCLUtn_ue87Sn3D_VdpDQO6RaeH4tgzLIc', // <-- DEVE ESSERE LA STESSA
    },
  },
};

export default config;
