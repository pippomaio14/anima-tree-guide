import { useEffect } from "react";
import { toast } from "sonner";

const STORAGE_KEY = "permissions_requested_v1";

const PermissionsRequester = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY)) return;

    const run = async () => {
      // Geolocation
      if ("geolocation" in navigator) {
        try {
          let state: PermissionState | "unsupported" = "unsupported";
          if ((navigator as any).permissions?.query) {
            try {
              const status = await (navigator as any).permissions.query({ name: "geolocation" as PermissionName });
              state = status.state;
            } catch {
              // ignored
            }
          }
          if (state !== "granted" && state !== "denied") {
            navigator.geolocation.getCurrentPosition(
              () => toast.success("Permesso posizione concesso"),
              (err) => {
                if (err.code === err.PERMISSION_DENIED) {
                  toast.message("Posizione negata", { description: "Potrai abilitarla dalle impostazioni del browser." });
                }
              },
              { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 }
            );
          }
        } catch {
          // ignored
        }
      }

      // Notifications
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

    // Slight delay so it doesn't fire during splash
    const t = setTimeout(run, 2200);
    return () => clearTimeout(t);
  }, []);

  return null;
};

export default PermissionsRequester;
