import { useEffect, useRef, useState } from "react";
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

const TreeMapDialog = ({ open, onClose, tree }: TreeMapDialogProps) => {
  const mapRef = useRef<HTMLElement | null>(null);
  const mapInstance = useRef<any>(null);
  const userMarker = useRef<any>(null);
  const watchId = useRef<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [fallbackEmbed, setFallbackEmbed] = useState(false);

  useEffect(() => {
    if (!open || !tree) return;
    
    setError(null);
    setFallbackEmbed(false);

    let cancelled = false;
    const treePos = { lat: tree.latitude, lng: tree.longitude };

    // ✅ USA SOLO NAVIGATOR.GEOLOCATION - NESSUN PLUGIN CAPACITOR
    const startWatch = () => {
      console.log('🌐 Avvio watch con navigator.geolocation');
      
      if (!navigator.geolocation) {
        setError('Geolocalizzazione non supportata dal browser');
        return;
      }

      // Pulisci vecchio watch se esiste
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }

      watchId.current = navigator.geolocation.watchPosition(
        (position) => {
          const userLatLng = { 
            lat: position.coords.latitude, 
            lng: position.coords.longitude 
          };
          setUserPos(userLatLng);
          
          // Aggiorna il marker sulla mappa
          if (mapInstance.current && userMarker.current) {
            userMarker.current.setPosition(userLatLng);
          }
        },
        (err) => {
          console.error('Errore geolocalizzazione:', err);
          setError('Impossibile ottenere la posizione. Verifica che il GPS sia attivo.');
        },
        { enableHighAccuracy: true, timeout: 15000 }
      );
    };

    // ✅ INIZIALIZZA MAPPA WEB (SOLO WEB)
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

        // Crea il marker utente (inizialmente nascosto)
        userMarker.current = new window.google.maps.Marker({
          position: treePos, // Posizione temporanea
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
          visible: false,
        });

        // Avvia il watch della posizione
        startWatch();

        // Ottieni la posizione una volta per centrare la mappa
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userLatLng = { 
                lat: position.coords.latitude, 
                lng: position.coords.longitude 
              };
              setUserPos(userLatLng);
              if (userMarker.current) {
                userMarker.current.setPosition(userLatLng);
                userMarker.current.setVisible(true);
              }
              // Centra la mappa sulla posizione dell'utente e dell'albero
              const bounds = new window.google.maps.LatLngBounds();
              bounds.extend(treePos);
              bounds.extend(userLatLng);
              mapInstance.current.fitBounds(bounds, 80);
            },
            (err) => {
              console.warn('Impossibile ottenere posizione iniziale:', err);
              // Mostra solo l'albero
              mapInstance.current.setCenter(treePos);
            },
            { enableHighAccuracy: true, timeout: 10000 }
          );
        } else {
          mapInstance.current.setCenter(treePos);
        }

        console.log('✅ Mappa web inizializzata correttamente');
        
      } catch (error) {
        console.error("Errore initWebMap:", error);
        setFallbackEmbed(true);
      }
    };

    const init = async () => {
      try {
        await initWebMap();
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
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
      userMarker.current = null;
      mapInstance.current = null;
    };
  }, [open, tree]);

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
