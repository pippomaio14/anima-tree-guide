import { useEffect } from "react";
import { toast } from "sonner";
import { Geolocation } from "@capacitor/geolocation";

const STORAGE_KEY = "permissions_requested_v1";

const PermissionsRequester = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY)) return;

    const run = async () => {
      // Geolocation via Capacitor (works on web + native)
      try {
        const current = await Geolocation.checkPermissions();
        if (current.location !== "granted" && current.location !== "denied") {
          const res = await Geolocation.requestPermissions({ permissions: ["location"] });
          if (res.location === "granted") {
            toast.success("Permesso posizione concesso");
          } else if (res.location === "denied") {
            toast.message("Posizione negata", {
              description: "Potrai abilitarla dalle impostazioni del dispositivo.",
            });
          }
        }
      } catch {
        // ignored
      }

      // Notifications (Web API)
      if ("Notification" in window) {
        try {
          if (Notification.permission === "default") {
            const result = await Notification.requestPermission();
            if (result === "granted") toast.success("Notifiche attivate");
          }
        } catch {
          // ignored
        }
      }

      localStorage.setItem(STORAGE_KEY, "1");
    };

    const t = setTimeout(run, 2200);
    return () => clearTimeout(t);
  }, []);

  return null;
};

export default PermissionsRequester;
