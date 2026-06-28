import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Upload, Plus, Trash2, Pencil, X, Check, MapPin, Loader2 } from "lucide-react";

interface AdminTreesTabProps {
  trees: any[];
  onReload: () => void;
}

const AdminTreesTab = ({ trees, onReload }: AdminTreesTabProps) => {
  const [newTree, setNewTree] = useState({ 
    tree_number: "", 
    adopter_name: "", 
    adopter_email: "", 
    adopter_phone: "", 
    dedicated_to: "", 
    dedication_message: "", 
    adoption_period: "", 
    tree_species: "", 
    latitude: "", 
    longitude: "" 
  });
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [gpsLoading, setGpsLoading] = useState<"new" | "edit" | null>(null);

  // ✅ FUNZIONE PER CARICARE IL PLUGIN DINAMICAMENTE
  const getGeolocation = async () => {
    try {
      const module = await import('@capacitor/geolocation');
      return module.Geolocation;
    } catch (e) {
      console.warn('⚠️ Plugin geolocation non disponibile:', e);
      return null;
    }
  };

  const getCurrentPosition = async (target: "new" | "edit") => {
    setGpsLoading(target);
    try {
      const Geolocation = await getGeolocation();
      
      if (!Geolocation) {
        toast.error("Geolocalizzazione non disponibile su questa piattaforma");
        setGpsLoading(null);
        return;
      }

      const perm = await Geolocation.checkPermissions();
      if (perm.location !== "granted") {
        const req = await Geolocation.requestPermissions({ permissions: ["location"] });
        if (req.location !== "granted") {
          toast.error("Permesso posizione negato");
          setGpsLoading(null);
          return;
        }
      }
      
      const pos = await Geolocation.getCurrentPosition({ 
        enableHighAccuracy: true, 
        timeout: 15000, 
        maximumAge: 0 
      });
      
      const lat = pos.coords.latitude.toFixed(7);
      const lng = pos.coords.longitude.toFixed(7);
      
      if (target === "new") {
        setNewTree((p) => ({ ...p, latitude: lat, longitude: lng }));
      } else {
        setEditData((p: any) => ({ ...p, latitude: lat, longitude: lng }));
      }
      
      toast.success(`Posizione acquisita (±${Math.round(pos.coords.accuracy)}m)`);
    } catch (err: any) {
      toast.error(`Errore GPS: ${err?.message || "non disponibile"}`);
    } finally {
      setGpsLoading(null);
    }
  };

  // ✅ FUNZIONE PER PULIRE I DATI CSV
  const cleanCSVValue = (value: string): string | null => {
    if (!value || value.trim() === "") return null;
    return value.trim();
  };

  // ✅ FUNZIONE PER CONVERTIRE COORDINATE (virgola → punto)
  const parseCoordinate = (value: string): number | null => {
    if (!value || value.trim() === "") return null;
    // Sostituisci la virgola con il punto
    const normalized = value.trim().replace(/,/g, '.');
    const num = parseFloat(normalized);
    return isNaN(num) ? null : num;
  };

  const handleCSVImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const text = await file.text();
      const lines = text.split("\n").filter((l) => l.trim());
      
      if (lines.length < 2) { 
        toast.error("File vuoto o formato non valido"); 
        return; 
      }
      
      // Estrai header
      const headerLine = lines[0];
      const headers = headerLine.split(/[,;]/).map((h) => h.trim().toLowerCase());
      
      console.log('📋 Headers trovati:', headers);
      
      // Mappa header corretti
      const rows = lines.slice(1).map((line) => {
        const vals = line.split(/[,;]/).map((v) => v.trim());
        const row: any = {};
        
        headers.forEach((h, i) => {
          const val = vals[i] || "";
          
          if (h.includes("numero") || h === "number") {
            row.tree_number = cleanCSVValue(val);
          }
          else if (h.includes("adottante") || h.includes("adopter")) {
            row.adopter_name = cleanCSVValue(val);
          }
          else if (h.includes("email") || h.includes("mail")) {
            row.adopter_email = cleanCSVValue(val);
          }
          else if (h.includes("telefono") || h.includes("phone") || h.includes("tel")) {
            row.adopter_phone = cleanCSVValue(val);
          }
          else if (h.includes("dedicat") && !h.includes("messag")) {
            row.dedicated_to = cleanCSVValue(val);
          }
          else if (h.includes("dedica") || h.includes("messag")) {
            row.dedication_message = cleanCSVValue(val);
          }
          else if (h.includes("periodo") || h.includes("period")) {
            row.adoption_period = cleanCSVValue(val);
          }
          else if (h.includes("latitudine") || h.includes("latitude") || h.includes("lat")) {
            const coord = parseCoordinate(val);
            row.latitude = coord;
          }
          else if (h.includes("longitudine") || h.includes("longitude") || h.includes("lng")) {
            const coord = parseCoordinate(val);
            row.longitude = coord;
          }
          else if (h.includes("specie") || h.includes("species")) {
            row.tree_species = cleanCSVValue(val);
          }
        });
        
        return row;
      }).filter((r) => r.tree_number && r.adopter_name);
      
      console.log(`📊 Trovate ${rows.length} righe valide:`, rows);
      
      if (rows.length === 0) { 
        toast.error("Nessun dato valido trovato nel file"); 
        return; 
      }
      
      const { data, error } = await supabase.from("adopted_trees").insert(rows);
      
      if (error) {
        console.error('❌ Errore import:', error);
        toast.error("Errore: " + error.message);
      } else {
        toast.success(`${rows.length} alberi importati!`); 
        onReload(); 
      }
    } catch (err: any) {
      console.error('❌ Errore:', err);
      toast.error("Errore durante l'import: " + err.message);
    }
  };

  const addTree = async () => {
    if (!newTree.tree_number || !newTree.adopter_name) { 
      toast.error("Numero e adottante obbligatori"); 
      return; 
    }
    
    const payload = { 
      ...newTree, 
      latitude: newTree.latitude ? parseFloat(newTree.latitude) : null, 
      longitude: newTree.longitude ? parseFloat(newTree.longitude) : null 
    };
    
    const { error } = await supabase.from("adopted_trees").insert([payload]);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Albero aggiunto!"); 
      setNewTree({ 
        tree_number: "", 
        adopter_name: "", 
        adopter_email: "", 
        adopter_phone: "", 
        dedicated_to: "", 
        dedication_message: "", 
        adoption_period: "", 
        tree_species: "", 
        latitude: "", 
        longitude: "" 
      }); 
      onReload(); 
    }
  };

  const deleteTree = async (id: string) => {
    await supabase.from("adopted_trees").delete().eq("id", id);
    toast.success("Albero eliminato");
    onReload();
  };

  const startEdit = (tree: any) => {
    setEditingId(tree.id);
    setEditData({ 
      tree_number: tree.tree_number, 
      adopter_name: tree.adopter_name, 
      adopter_email: tree.adopter_email || "", 
      adopter_phone: tree.adopter_phone || "", 
      dedicated_to: tree.dedicated_to || "", 
      dedication_message: tree.dedication_message || "", 
      adoption_period: tree.adoption_period || "", 
      tree_species: tree.tree_species || "", 
      latitude: tree.latitude?.toString() || "", 
      longitude: tree.longitude?.toString() || "" 
    });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    
    const payload = { 
      ...editData, 
      latitude: editData.latitude ? parseFloat(editData.latitude) : null, 
      longitude: editData.longitude ? parseFloat(editData.longitude) : null 
    };
    
    const { error } = await supabase.from("adopted_trees").update(payload).eq("id", editingId);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Albero aggiornato!"); 
      setEditingId(null); 
      onReload(); 
    }
  };

  const togglePublished = async (id: string, current: boolean) => {
    const { error } = await supabase.from("adopted_trees").update({ published: !current }).eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      onReload();
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <h3 className="font-semibold flex items-center gap-2">
          <Upload className="w-4 h-4" /> Importa CSV
        </h3>
        <p className="text-xs text-muted-foreground">
          Colonne supportate: numero, adottante, email, telefono, dedicato_a, dedica, periodo, latitude, longitude, species
        </p>
        <p className="text-xs text-muted-foreground">
          ℹ️ Le coordinate devono usare il punto (.) come separatore decimale. Es: 11.717633, 45.529768
        </p>
        <Input type="file" accept=".csv,.txt" onChange={handleCSVImport} />
      </div>

      {/* ... resto del componente invariato ... */}
    </div>
  );
};

export default AdminTreesTab;
