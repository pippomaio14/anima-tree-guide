import { useEffect, useRef, useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Navigation, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TreeMapDialogProps {
  open: boolean;
  onClose: () => void;
  tree: {
    tree_number: string;
    adopter_name: string;
    latitude: number;
    longitude: number;
  } | null;
}

declare global {
  interface Window {
    google: any;
    __initTreeMap?: () => void;
    gm_authFailure?: () => void;
    Capacitor?: any;
  }
}

const GOOGLE_MAPS_KEY = "AIzaSyCLUtn_ue87Sn3D_VdpDQO6RaeH4tgzLIc";

const getEmbedUrl = (lat: number, lng: number) =>
  `https://www.google.com/maps?q=${lat},${lng}&t=k&z=19&output=embed`;

let mapsLoaderPromise: Promise<void> | null = null;
const loadGoogleMaps = (): Promise<void> => {
  if (mapsLoaderPromise) return mapsLoaderPromise;
  mapsLoaderPromise = new Promise((resolve, reject) => {
    if (window.google?.maps) return resolve();
    window.gm_authFailure = () => reject(new Error("Chiave Google Maps non autorizzata per questa app"));
    window.__initTreeMap = () => resolve();
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&loading=async&callback=__initTreeMap`;
    script.async = true;
    script.onerror = () => reject(new Error("Impossibile caricare Google Maps"));
    document.head.appendChild(script);
  });
  return mapsLoaderPromise;
};

// ✅ FUNZIONE SICURA PER VERIFICARE AMBIENTE NATIVO
const isNativePlatform = (): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    if (!window.Capacitor) return false;
    if (typeof window.Capacitor.isNativePlatform !== 'function') return false;
    return window.Capacitor.isNativePlatform();
  } catch (e) {
    console.warn('Errore nel controllo Capacitor:', e);
    return false;
  }
};

// ✅ CARICAMENTO DINAMICO SOLO IN AMBIENTE NATIVO
const loadGeolocation = async () => {
  // SE NON SIAMO IN AMBIENTE NATIVO, NON CARICARE IL PLUGIN
  if (!isNativePlatform()) {
    console.log('🌐 Web: uso navigator.geolocation');
    return null;
  }
  
  try {
    console.log('📱 Caricamento plugin geolocation nativo...');
    // Import dinamico con try-catch
    const module = await import('@capacitor/geolocation');
    console.log('✅ Plugin geolocation caricato');
    return module.Geolocation;
  } catch (e) {
    console.warn('⚠️ Geolocation plugin non disponibile:', e);
    return null;
  }
};

const loadGoogleMapsNative = async () => {
  if (!isNativePlatform()) {
    console.log('🌐 Web: uso Google Maps JavaScript API');
    return null;
  }
  
  try {
    const module = await import('@capacitor/google-maps');
    return {
      GoogleMap: module.GoogleMap,
      LatLngBounds: module.LatLngBounds,
      MapType: module.MapType,
    };
  } catch (e) {
    console.warn('⚠️ Google Maps native plugin non disponibile:', e);
    return null;
  }
};

const TreeMapDialog = ({ open, onClose, tree }: TreeMapDialogProps) => {
  const mapRef = useRef<HTMLElement | null>(null);
  const mapInstance = useRef<any>(null);
  const nativeMap = useRef<any>(null);
  const nativeUserMarkerId = useRef<string | null>(null);
  const nativeBoundsFit = useRef(false);
  const userMarker = useRef<any>(null);
  const watchId = useRef<string | null>(null);
  const webWatchId = useRef<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [fallbackEmbed, setFallbackEmbed] = useState(false);
  const [isNative, setIsNative] = useState(false);
  const [pluginsReady, setPluginsReady] = useState(false);

  // ✅ CONTROLLO AMBIENTE ALL'AVVIO
  useEffect(() => {
    const checkEnvironment = async () => {
      try {
        const native = isNativePlatform();
        setIsNative(native);
        setPluginsReady(true);
        console.log(`📱 Ambiente: ${native ? 'Nativo (Android)' : 'Web'}`);
      } catch (e) {
        console.error('Errore check ambiente:', e);
        setIsNative(false);
        setPluginsReady(true);
      }
    };
    checkEnvironment();
  }, []);

  useEffect(() => {
    if (!open || !tree || !pluginsReady) return;
    
    setError(null);
    setFallbackEmbed(false);
    nativeBoundsFit.current = false;

    let cancelled = false;
    const treePos = { lat: tree.latitude, lng: tree.longitude };

    // ✅ STARTWATCH CON GESTIONE SIA WEB CHE NATIVO
    const startWatch = useCallback(async (onPosition?: (pos: { lat: number; lng: number }) => void | Promise<void>) => {
      // Se siamo su web, usa navigator.geolocation
      if (!isNative) {
        console.log('🌐 Web: avvio watch con navigator.geolocation');
        if (navigator.geolocation) {
          if (webWatchId.current !== null) {
            navigator.geolocation.clearWatch(webWatchId.current);
            webWatchId.current = null;
          }
          
          webWatchId.current = navigator.geolocation.watchPosition(
            (position) => {
              const userLatLng = { lat: position.coords.latitude, lng: position.coords.longitude };
              setUserPos(userLatLng);
              if (onPosition) void Promise.resolve(onPosition(userLatLng)).catch(() => {});
            },
            (err) => {
              console.error('Errore geolocalizzazione web:', err);
              setError('Impossibile ottenere la posizione. Verifica che il GPS sia attivo.');
            },
            { enableHighAccuracy: true, timeout: 15000 }
          );
        }
        return;
      }

      // Su Android, usa il plugin Capacitor
      try {
        const Geolocation = await loadGeolocation();
        if (!Geolocation) {
          console.warn('Plugin geolocalizzazione non disponibile, uso fallback web');
          // Fallback a navigator.geolocation se il plugin non è disponibile
          if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
              (position) => {
                const userLatLng = { lat: position.coords.latitude, lng: position.coords.longitude };
                setUserPos(userLatLng);
                if (onPosition) void Promise.resolve(onPosition(userLatLng)).catch(() => {});
              },
              (err) => {
                console.error('Errore geolocalizzazione fallback:', err);
                setError('Impossibile ottenere la posizione. Verifica che il GPS sia attivo.');
              },
              { enableHighAccuracy: true }
            );
          }
          return;
        }

        const perm = await Geolocation.checkPermissions();
        if (perm.location !== "granted") {
          const req = await Geolocation.requestPermissions({ permissions: ["location"] });
          if (req.location !== "granted") {
            setError("Permesso posizione negato");
            return;
          }
        }

        if (watchId.current !== null) {
          await Geolocation.clearWatch({ id: watchId.current }).catch(() => {});
          watchId.current = null;
        }

        watchId.current = await Geolocation.watchPosition(
          { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 },
          (pos: any, err: any) => {
            if (err) {
              setError(`Posizione non disponibile: ${err.message}`);
              return;
            }
            if (!pos) return;
            const userLatLng = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            setUserPos(userLatLng);
            if (onPosition) void Promise.resolve(onPosition(userLatLng)).catch(() => {});
          }
        );
      } catch (e: any) {
        console.error('Errore geolocalizzazione nativa:', e);
        // Fallback a navigator.geolocation
        if (navigator.geolocation) {
          navigator.geolocation.watchPosition(
            (position) => {
              const userLatLng = { lat: position.coords.latitude, lng: position.coords.longitude };
              setUserPos(userLatLng);
              if (onPosition) void Promise.resolve(onPosition(userLatLng)).catch(() => {});
            },
            (err) => {
              console.error('Errore geolocalizzazione fallback:', err);
              setError('Impossibile ottenere la posizione. Verifica che il GPS sia attivo.');
            },
            { enableHighAccuracy: true }
          );
        } else {
          setError(`Geolocalizzazione non disponibile: ${e?.message || ""}`);
        }
      }
    }, [isNative]);

    // ✅ INIT NATIVE MAP
    const initNativeMap = async () => {
      if (!mapRef.current) {
        console.error('mapRef.current è nullo');
        return;
      }

      try {
        const mapsNative = await loadGoogleMapsNative();
        if (!mapsNative) {
          throw new Error('Google Maps native plugin non disponibile');
        }
        const { GoogleMap, MapType } = mapsNative;

        const createdMap = await GoogleMap.create({
          id: "tree-map-dialog",
          element: mapRef.current,
          apiKey: GOOGLE_MAPS_KEY,
          forceCreate: true,
          config: {
            center: treePos,
            zoom: 19,
          },
        });

        nativeMap.current = createdMap;
        await createdMap.setMapType(MapType.Satellite);
        await createdMap.addMarker({
          coordinate: treePos,
          title: `Albero #${tree.tree_number}`,
          snippet: tree.adopter_name,
          tintColor: { r: 22, g: 135, b: 96, a: 255 },
        });
        await createdMap.enableCurrentLocation(true).catch(() => {});

        await startWatch(async (userLatLng) => {
          if (!nativeMap.current) return;
          if (nativeUserMarkerId.current) {
            await nativeMap.current.removeMarker(nativeUserMarkerId.current).catch(() => {});
          }
          nativeUserMarkerId.current = await nativeMap.current.addMarker({
            coordinate: userLatLng,
            title: "La tua posizione",
            tintColor: { r: 66, g: 133, b: 244, a: 255 },
          });
          // Fit bounds solo se necessario
        });
      } catch (error) {
        console.error("Errore initNativeMap:", error);
        throw error;
      }
    };

    // ✅ INIT WEB MAP
    const initWebMap = async () => {
      try {
        await loadGoogleMaps();
        if (cancelled || !mapRef.current) return;

        mapInstance.current = new window.google.maps.Map(mapRef.current, {
          center: treePos,
          zoom: 19,
          mapTypeId: "satellite",
          tilt: 0,
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeControl: false,
        });

        new window.google.maps.Marker({
          position: treePos,
          map: mapInstance.current,
          title: `Albero #${tree.tree_number}`,
          label: { text: "🌳", fontSize: "24px" },
        });

        await startWatch((userLatLng) => {
          if (!userMarker.current) {
            userMarker.current = new window.google.maps.Marker({
              position: userLatLng,
              map: mapInstance.current,
              title: "La tua posizione",
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: "#4285F4",
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 3,
              },
            });
            const bounds = new window.google.maps.LatLngBounds();
            bounds.extend(treePos);
            bounds.extend(userLatLng);
            mapInstance.current.fitBounds(bounds, 80);
          } else {
            userMarker.current.setPosition(userLatLng);
          }
        });
      } catch (error) {
        console.error("Errore initWebMap:", error);
        throw error;
      }
    };

    // ✅ INIT
    const init = async () => {
      try {
        console.log(`🚀 Avvio mappa su: ${isNative ? 'Android (nativo)' : 'Web'}`);
        if (isNative) {
          await initNativeMap();
        } else {
          await initWebMap();
        }
      } catch (e: any) {
        if (!cancelled) {
          console.warn("Map loading failed, using embed fallback", e);
          setFallbackEmbed(true);
        }
      }
    };

    init();

    return () => {
      cancelled = true;
      if (webWatchId.current !== null) {
        navigator.geolocation.clearWatch(webWatchId.current);
        webWatchId.current = null;
      }
      if (watchId.current !== null) {
        loadGeolocation().then(Geolocation => {
          if (Geolocation) {
            Geolocation.clearWatch({ id: watchId.current }).catch(() => {});
          }
        }).catch(() => {});
        watchId.current = null;
      }
      if (nativeMap.current) {
        nativeMap.current.destroy().catch(() => {});
        nativeMap.current = null;
      }
      nativeUserMarkerId.current = null;
      userMarker.current = null;
      mapInstance.current = null;
    };
  }, [open, tree, isNative, pluginsReady, startWatch]);

  const distance = (() => {
    if (!userPos || !tree) return null;
    const R = 6371000;
    const toRad = (d: number) => (d * Math.PI) / 180;
    const dLat = toRad(tree.latitude - userPos.lat);
    const dLng = toRad(tree.longitude - userPos.lng);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(userPos.lat)) * Math.cos(toRad(tree.latitude)) * Math.sin(dLng / 2) ** 2;
    return Math.round(2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  })();

  const showNativeMap = isNative && !fallbackEmbed;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden h-[85vh] flex flex-col">
        <DialogHeader className="p-4 pb-2 shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-primary" />
            Albero #{tree?.tree_number}
            {distance !== null && (
              <span className="ml-auto text-sm font-normal text-muted-foreground">
                {distance < 1000 ? `${distance} m` : `${(distance / 1000).toFixed(2)} km`}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="relative flex-1 bg-muted">
          {fallbackEmbed && tree ? (
            <iframe
              title={`Mappa albero ${tree.tree_number}`}
              src={getEmbedUrl(tree.latitude, tree.longitude)}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : showNativeMap ? (
            <capacitor-google-map ref={mapRef as any} className="absolute inset-0 block h-full w-full" />
          ) : (
            <div ref={mapRef as any} className="absolute inset-0" />
          )}
          {error && (
            <div className="absolute bottom-4 left-4 right-4 bg-destructive/90 text-destructive-foreground p-3 rounded-lg flex items-start gap-2 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>
        <div className="p-3 border-t shrink-0">
          <Button
            variant="outline"
            className="w-full"
            onClick={() =>
              tree &&
              window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${tree.latitude},${tree.longitude}`,
                "_blank"
              )
            }
          >
            Apri indicazioni in Google Maps
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TreeMapDialog;
