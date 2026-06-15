import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Navigation, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Geolocation } from "@capacitor/geolocation";

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
  }
}

const BROWSER_KEY = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY;
const TRACKING_ID = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID;

let mapsLoaderPromise: Promise<void> | null = null;
const loadGoogleMaps = (): Promise<void> => {
  if (mapsLoaderPromise) return mapsLoaderPromise;
  mapsLoaderPromise = new Promise((resolve, reject) => {
    if (window.google?.maps) return resolve();
    window.__initTreeMap = () => resolve();
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${BROWSER_KEY}&loading=async&callback=__initTreeMap&channel=${TRACKING_ID}`;
    script.async = true;
    script.onerror = () => reject(new Error("Impossibile caricare Google Maps"));
    document.head.appendChild(script);
  });
  return mapsLoaderPromise;
};

const TreeMapDialog = ({ open, onClose, tree }: TreeMapDialogProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const userMarker = useRef<any>(null);
  const watchId = useRef<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!open || !tree) return;
    setError(null);

    let cancelled = false;

    loadGoogleMaps()
      .then(() => {
        if (cancelled || !mapRef.current) return;
        const treePos = { lat: tree.latitude, lng: tree.longitude };

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

        const startWatch = async () => {
          try {
            const perm = await Geolocation.checkPermissions();
            if (perm.location !== "granted") {
              const req = await Geolocation.requestPermissions({ permissions: ["location"] });
              if (req.location !== "granted") {
                setError("Permesso posizione negato");
                return;
              }
            }
            watchId.current = await Geolocation.watchPosition(
              { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 },
              (pos, err) => {
                if (err) {
                  setError(`Posizione non disponibile: ${err.message}`);
                  return;
                }
                if (!pos) return;
                const userLatLng = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                setUserPos(userLatLng);
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
              }
            );
          } catch (e: any) {
            setError(`Geolocalizzazione non disponibile: ${e?.message || ""}`);
          }
        };
        startWatch();
      })
      .catch((e) => setError(e.message));

    return () => {
      cancelled = true;
      if (watchId.current !== null) {
        Geolocation.clearWatch({ id: watchId.current }).catch(() => {});
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
          <div ref={mapRef} className="absolute inset-0" />
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
