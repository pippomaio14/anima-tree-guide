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

// ✅ POSIZIONE DI FALLBACK (Camisano Vicentino)
const FALLBACK_POSITION = { lat: 45.529768, lng: 11.717633 };

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

// ✅ GEOLOCATION DA WINDOW.CAPACITOR
const getGeolocation = () => {
  try {
    if (typeof window === 'undefined') return null;
    if (!window.Capacitor) return null;
    if (!window.Capacitor.Plugins) return null;
    return window.Capacitor.Plugins.Geolocation;
  } catch (e) {
    console.warn('⚠️ Geolocation non disponibile:', e);
    return null;
  }
};

// ✅ VERIFICA AMBIENTE NATIVO
const isNativePlatform = (): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    if (!window.Capacitor) return false;
    if (typeof window.Capacitor.isNativePlatform !== 'function') return false;
    return window.Capacitor.isNativePlatform();
  } catch (e) {
    console.warn('Errore isNativePlatform:', e);
    return false;
  }
};

// ✅ APRE GOOGLE MAPS CON LINK CORRETTO
const openGoogleMapsDirections = (lat: number, lng: number) => {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  
  // Su Android, usa window.open che funziona con Capacitor
  window.open(url, '_system');
  
  // Fallback per web
  if (!isNativePlatform()) {
    window.open(url, '_blank');
  }
};

const TreeMapDialog = ({ open, onClose, tree }: TreeMapDialogProps) => {
  const mapRef = useRef<HTMLElement | null>(null);
  const mapInstance = useRef<any>(null);
  const userMarker = useRef<any>(null);
  const watchId = useRef<string | number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [fallbackEmbed, setFallbackEmbed] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  // ✅ FUNZIONE PER OTTENERE LA POSIZIONE (definita fuori da useEffect)
  const getPosition = useCallback(async (): Promise<{lat: number, lng: number} | null> => {
    try {
      if (isNativePlatform()) {
        console.log('📱 Usando Capacitor Geolocation plugin');
        const Geolocation = getGeolocation();
        
        if (!Geolocation) {
          console.warn('⚠️ Plugin geolocalizzazione non disponibile, uso fallback');
          return FALLBACK_POSITION;
        }

        const perm = await Geolocation.checkPermissions();
        if (perm.location !== "granted") {
          const req = await Geolocation.requestPermissions({ permissions: ["location"] });
          if (req.location !== "granted") {
            console.warn('⚠️ Permesso negato, uso fallback');
            return FALLBACK_POSITION;
          }
        }

        try {
          const pos = await Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 10000,
          });
          return {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
        } catch (gpsErr) {
          console.warn('⚠️ Errore GPS nativo, uso fallback:', gpsErr);
          return FALLBACK_POSITION;
        }
      } else {
        console.log('🌐 Usando navigator.geolocation');
        return new Promise((resolve) => {
          if (!navigator.geolocation) {
            console.warn('⚠️ Geolocalizzazione non supportata, uso fallback');
            resolve(FALLBACK_POSITION);
            return;
          }
          
          let resolved = false;
          const timeoutId = setTimeout(() => {
            if (!resolved) {
              resolved = true;
              console.warn('⚠️ Timeout geolocalizzazione, uso fallback');
              resolve(FALLBACK_POSITION);
            }
          }, 8000);
          
          navigator.geolocation.getCurrentPosition(
            (position) => {
              if (!resolved) {
                resolved = true;
                clearTimeout(timeoutId);
                resolve({
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                });
              }
            },
            (err) => {
              if (!resolved) {
                resolved = true;
                clearTimeout(timeoutId);
                console.warn('⚠️ Errore geolocalizzazione web:', err.message);
                resolve(FALLBACK_POSITION);
              }
            },
            { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
          );
        });
      }
    } catch (err: any) {
      console.error('❌ Errore geolocalizzazione:', err);
      return FALLBACK_POSITION;
    }
  }, []);

  useEffect(() => {
    if (!open || !tree) return;
    
    setError(null);
    setFallbackEmbed(false);
    setGpsLoading(true);
    setMapReady(false);

    let cancelled = false;
    let isMounted = true;
    const treePos = { lat: tree.latitude, lng: tree.longitude };

    // ✅ START WATCH CON TIMEOUT RIDOTTO
    const startWatch = async (onPosition: (pos: { lat: number; lng: number }) => void) => {
      try {
        if (isNativePlatform()) {
          const Geolocation = getGeolocation();
          if (!Geolocation) return;

          const watchIdNative = await Geolocation.watchPosition(
            { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 },
            (pos: any, err: any) => {
              if (err) {
                console.error('Errore watch nativo:', err);
                return;
              }
              if (pos && isMounted) {
                onPosition({
                  lat: pos.coords.latitude,
                  lng: pos.coords.longitude
                });
              }
            }
          );
          watchId.current = watchIdNative;
        } else {
          if (!navigator.geolocation) return;
          
          const watchIdWeb = navigator.geolocation.watchPosition(
            (position) => {
              if (isMounted) {
                onPosition({
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                });
              }
            },
            (err) => {
              console.error('Errore watch web:', err);
            },
            { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
          );
          watchId.current = watchIdWeb;
        }
      } catch (err) {
        console.error('❌ Errore startWatch:', err);
      }
    };

    // ✅ INIZIALIZZA MAPPA
    const initMap = async () => {
      try {
        await loadGoogleMaps();
        if (cancelled || !isMounted || !mapRef.current) return;

        // Crea la mappa
        mapInstance.current = new window.google.maps.Map(mapRef.current, {
          center: treePos,
          zoom: 18,
          mapTypeId: "satellite",
          tilt: 0,
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeControl: false,
          zoomControl: true,
        });

        // Marker albero
        new window.google.maps.Marker({
          position: treePos,
          map: mapInstance.current,
          title: `Albero #${tree.tree_number}`,
          label: { text: "🌳", fontSize: "24px" },
        });

        // Marker utente (inizialmente invisibile)
        userMarker.current = new window.google.maps.Marker({
          position: treePos,
          map: mapInstance.current,
          title: "La tua posizione",
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 3,
          },
          visible: false,
        });

        setMapReady(true);

        // Ottieni posizione iniziale
        try {
          setGpsLoading(true);
          const position = await getPosition();
          setGpsLoading(false);
          
          if (position && isMounted) {
            setUserPos(position);
            if (userMarker.current) {
              userMarker.current.setPosition(position);
              userMarker.current.setVisible(true);
            }
            // Centra mappa su albero + utente
            try {
              const bounds = new window.google.maps.LatLngBounds();
              bounds.extend(treePos);
              bounds.extend(position);
              mapInstance.current.fitBounds(bounds, 80);
            } catch (boundsErr) {
              console.warn('Errore fitBounds:', boundsErr);
              mapInstance.current.setCenter(treePos);
            }
          }
        } catch (err: any) {
          setGpsLoading(false);
          setError(`Posizione non disponibile. Verifica il GPS.`);
          mapInstance.current.setCenter(treePos);
        }

        // Avvia watch
        await startWatch((pos) => {
          if (isMounted) {
            setUserPos(pos);
            if (userMarker.current) {
              userMarker.current.setPosition(pos);
              userMarker.current.setVisible(true);
            }
          }
        });

        console.log('✅ Mappa inizializzata correttamente');
        
      } catch (error: any) {
        console.error("❌ Errore initMap:", error);
        if (isMounted) {
          setFallbackEmbed(true);
          if (error.message?.includes('API key')) {
            setError('Errore: chiave API Google Maps non valida');
          }
        }
      }
    };

    // ✅ AVVIA
    initMap();

    // ✅ CLEANUP
    return () => {
      cancelled = true;
      isMounted = false;
      if (watchId.current !== null) {
        if (isNativePlatform()) {
          const Geolocation = getGeolocation();
          if (Geolocation) {
            Geolocation.clearWatch({ id: watchId.current as string }).catch(() => {});
          }
        } else {
          navigator.geolocation.clearWatch(watchId.current as number);
        }
        watchId.current = null;
      }
      if (userMarker.current) {
        userMarker.current.setMap(null);
        userMarker.current = null;
      }
      if (mapInstance.current) {
        mapInstance.current = null;
      }
    };
  }, [open, tree, getPosition]);

  // ✅ CALCOLO DISTANZA
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

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden h-[85vh] flex flex-col">
        <DialogHeader className="p-4 pb-2 shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-primary" />
            Albero #{tree?.tree_number}
            {gpsLoading && (
              <span className="ml-auto text-sm text-muted-foreground">⏳ GPS...</span>
            )}
            {distance !== null && !gpsLoading && (
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
        <div className="p-3 border-t shrink-0 flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              if (tree) {
                openGoogleMapsDirections(tree.latitude, tree.longitude);
              }
            }}
          >
            📍 Indicazioni
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={async () => {
              setGpsLoading(true);
              setError(null);
              try {
                const pos = await getPosition();
                if (pos && mapInstance.current) {
                  setUserPos(pos);
                  mapInstance.current.panTo(pos);
                  if (userMarker.current) {
                    userMarker.current.setPosition(pos);
                    userMarker.current.setVisible(true);
                  }
                  console.log('✅ Posizione aggiornata!');
                }
              } catch (err: any) {
                setError(err.message || 'Errore aggiornamento posizione');
              } finally {
                setGpsLoading(false);
              }
            }}
            disabled={gpsLoading}
          >
            {gpsLoading ? "⏳ Caricamento..." : "🔄 Aggiorna posizione"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TreeMapDialog;
