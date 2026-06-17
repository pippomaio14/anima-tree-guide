// Questo è uno "shim" (un'imitazione) per i plugin di Capacitor.
// Viene usato solo durante la build per il WEB, per evitare errori.
// Su Android, i veri plugin verranno caricati dinamicamente.

export const Capacitor = {
  isNativePlatform: () => false,
  isPluginAvailable: () => false,
  getPlatform: () => 'web',
};

export const Geolocation = {
  checkPermissions: async () => ({ location: 'prompt' }),
  requestPermissions: async () => ({ location: 'prompt' }),
  getCurrentPosition: async () => { throw new Error('Geolocation not available on web shim'); },
  watchPosition: async () => { throw new Error('Geolocation not available on web shim'); },
  clearWatch: async () => {},
};

// Esporta anche un oggetto vuoto per Google Maps
export const GoogleMap = {
  create: async () => { throw new Error('GoogleMap not available on web shim'); },
};

// Esportazione di default per mantenere la compatibilità
export default {
  Capacitor,
  Geolocation,
  GoogleMap,
};
