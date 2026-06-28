import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// ✅ FUNZIONE PER CARICARE IL PLUGIN GEOLOCATION
const loadGeolocation = async () => {
  try {
    const module = await import('@capacitor/geolocation');
    return module.Geolocation;
  } catch (e) {
    console.warn('⚠️ Plugin geolocation non disponibile:', e);
    return null;
  }
};

const PermissionsRequester = () => {
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    const checkAndRequestPermissions = async () => {
      try {
        // Controlla se siamo in ambiente nativo
        const native = Capacitor.isNativePlatform?.() || false;
        setIsNative(native);
        console.log('📱 Ambiente nativo:', native);

        if (!native) {
          console.log('🌐 Ambiente web - nessuna richiesta permessi');
          setPermissionsGranted(true);
          return;
        }

        // Carica il plugin geolocation
        const Geolocation = await loadGeolocation();
        if (!Geolocation) {
          console.warn('⚠️ Plugin geolocation non disponibile');
          setShowDialog(true);
          return;
        }

        // Controlla i permessi di geolocalizzazione
        console.log('📱 Controllo permessi geolocalizzazione...');
        const perm = await Geolocation.checkPermissions();
        console.log('📱 Stato permessi:', perm);

        if (perm.location === 'granted') {
          console.log('✅ Permessi già concessi');
          setPermissionsGranted(true);
          setShowDialog(false);
          return;
        }

        // Se i permessi non sono stati concessi, mostra il dialog
        if (perm.location === 'prompt') {
          console.log('📱 Richiedo permessi...');
          // Richiedi permessi
          const result = await Geolocation.requestPermissions({
            permissions: ['location']
          });
          console.log('📱 Risultato richiesta permessi:', result);
          
          if (result.location === 'granted') {
            console.log('✅ Permessi concessi');
            setPermissionsGranted(true);
            setShowDialog(false);
          } else {
            console.log('❌ Permessi negati');
            setShowDialog(true);
          }
        } else if (perm.location === 'denied') {
          console.log('❌ Permessi permanentemente negati');
          setShowDialog(true);
        }
      } catch (err) {
        console.error('❌ Errore permessi:', err);
        setShowDialog(true);
        setError(err instanceof Error ? err.message : 'Errore sconosciuto');
      }
    };

    checkAndRequestPermissions();
  }, []);

  // Se i permessi sono concessi, non mostra nulla
  if (permissionsGranted || !isNative) {
    return null;
  }

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>📍 Permessi necessari</DialogTitle>
          <DialogDescription>
            L'app ha bisogno di alcuni permessi per funzionare correttamente.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {error ? (
                <span className="text-destructive">Errore: {error}</span>
              ) : (
                <>
                  <strong>Posizione:</strong> Per mostrare la tua posizione sulla mappa e trovare alberi vicini.
                  <br />
                  <span className="text-xs text-muted-foreground">
                    I permessi possono essere concessi dalle impostazioni del telefono.
                  </span>
                </>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              className="flex-1"
              onClick={async () => {
                try {
                  const Geolocation = await loadGeolocation();
                  if (Geolocation) {
                    const result = await Geolocation.requestPermissions({
                      permissions: ['location']
                    });
                    if (result.location === 'granted') {
                      setPermissionsGranted(true);
                      setShowDialog(false);
                      window.location.reload();
                    } else {
                      setShowDialog(true);
                    }
                  }
                } catch (err) {
                  console.error('Errore richiesta permessi:', err);
                }
              }}
            >
              🔄 Richiedi permessi
            </Button>
          </div>
          <p className="text-xs text-center text-muted-foreground">
            Per modificare i permessi, vai su Impostazioni → Applicazioni → Anima Tree Guide → Autorizzazioni
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PermissionsRequester;
