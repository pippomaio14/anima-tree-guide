import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Navigation, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Capacitor } from "@capacitor/core";

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

// Funzioni helper per import dinamici con fallback
const loadGeolocation = async () => {
  try {
    const module = await import('@capacitor/geolocation');
    return module.Geolocation;
  } catch (e) {
    console.warn('Geolocation plugin non disponibile:', e);
    return null;
  }
};

const loadGoogleMapsNative = async () => {
  try {
    const module = await import('@capacitor/google-maps');
    return {
      GoogleMap: module.GoogleMap,
      LatLngBounds: module.LatLngBounds,
      MapType: module.MapType,
    };
  } catch (e) {
    console.warn('Google Maps native plugin non disponibile:', e);
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
  const [error, setError] = useState<string | null>(null);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [fallbackEmbed, setFallbackEmbed] = useState(false);

  useEffect(() => {
    if (!open || !tree) return;
    setError(null);
    setFallbackEmbed(false);
    nativeBoundsFit.current = false;

    let cancelled = false;
    const treePos = { lat: tree.latitude, lng: tree.longitude };

    const startWatch = async (onPosition?: (pos: { lat: number; lng: number }) => void | Promise<void>) => {
      try {
        const Geolocation = await loadGeolocation();
        if (!Geolocation) {
          setError("Plugin geolocalizzazione non disponibile");
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
        setError(`Geolocalizzazione non disponibile: ${e?.message || ""}`);
      }
    };

    const fitNativeBounds = async (userLatLng: { lat: number; lng: number }) => {
      if (!nativeMap.current || nativeBoundsFit.current) return;
      nativeBoundsFit.current = true;

      try {
        const mapsNative = await loadGoogleMapsNative();
        if (!mapsNative) {
          console.warn('Google Maps native non disponibile per fitBounds');
          return;
        }
        const { LatLngBounds } = mapsNative;
        const bounds = new LatLngBounds({
          southwest: {
            lat: Math.min(treePos.lat, userLatLng.lat),
            lng: Math.min(treePos.lng, userLatLng.lng),
          },
          northeast: {
            lat: Math.max(treePos.lat, userLatLng.lat),
            lng: Math.max(treePos.lng, userLatLng.lng),
          },
          center: {
            lat: (treePos.lat + userLatLng.lat) / 2,
            lng: (treePos.lng + userLatLng.lng) / 2,
          },
        });
        await nativeMap.current.fitBounds(bounds, 80);
      } catch (e) {
        console.warn('Errore fitNativeBounds:', e);
      }
    };

    const initNativeMap = async () => {
      if (!mapRef.current) return;

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
          await fitNativeBounds(userLatLng).catch(() => {});
        });
      } catch (error) {
        console.error("Errore initNativeMap:", error);
        throw error;
      }
    };

    const initWebMap = async () => {
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

      // Web: usiamo la geolocalizzazione standard del browser
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (position) => {
            const userLatLng = { lat: position.coords.latitude, lng: position.coords.longitude };
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
          },
          (error) => {
            console.error("Errore geolocalizzazione web:", error);
          },
          { enableHighAccuracy: true }
        );
      }
    };

    const init = async () => {
      try {
        if (Capacitor.isNativePlatform()) {
          await initNativeMap();
        } else {
          await initWebMap();
        }
      } catch (e: any) {
        if (!cancelled) {
          console.warn("Map loading failed, using embed fallback", e);
          setFallbackEmbed(true);
          // Tentiamo la posizione per il fallback
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                setUserPos({
                  lat: pos.coords.latitude,
                  lng: pos.coords.longitude
                });
              },
              () => {}
            );
          }
        }
      }
    };

    init();

    return () => {
      cancelled = true;
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

  const showNativeMap = Capacitor.isNativePlatform() && !fallbackEmbed;

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
