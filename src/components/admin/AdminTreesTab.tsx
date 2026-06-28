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

  // ✅ CARICA IL PLUGIN GEOLOCATION DINAMICAMENTE
  const getGeolocation = async () => {
    try {
      const module = await import('@capacitor/geolocation');
      return module.Geolocation;
    } catch (e) {
      console.warn('⚠️ Plugin geolocation non disponibile:', e);
      return null;
    }
  };

  // ✅ OTTIENE LA POSIZIONE GPS DAL TELEFONO
  const getCurrentPosition = async (target: "new" | "edit") => {
    setGpsLoading(target);
    try {
      const Geolocation = await getGeolocation();
      
      if (!Geolocation) {
        toast.error("Geolocalizzazione non disponibile su questa piattaforma");
        setGpsLoading(null);
        return;
      }

      // Controlla i permessi
      const perm = await Geolocation.checkPermissions();
      if (perm.location !== "granted") {
        const req = await Geolocation.requestPermissions({ permissions: ["location"] });
        if (req.location !== "granted") {
          toast.error("Permesso posizione negato");
          setGpsLoading(null);
          return;
        }
      }
      
      // Ottieni la posizione
      const pos = await Geolocation.getCurrentPosition({ 
        enableHighAccuracy: true, 
        timeout: 15000, 
        maximumAge: 0 
      });
      
      // Formatta le coordinate con 7 decimali
      const lat = pos.coords.latitude.toFixed(7);
      const lng = pos.coords.longitude.toFixed(7);
      
      // Aggiorna il campo appropriato
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

  // ✅ PULISCE I VALORI CSV
  const cleanCSVValue = (value: string): string | null => {
    if (!value || value.trim() === "") return null;
    return value.trim();
  };

  // ✅ CONVERTE COORDINATE (virgola → punto)
  const parseCoordinate = (value: string): number | null => {
    if (!value || value.trim() === "") return null;
    const normalized = value.trim().replace(/,/g, '.');
    const num = parseFloat(normalized);
    return isNaN(num) ? null : num;
  };

  // ✅ IMPORTA CSV
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
      
      const headerLine = lines[0];
      const headers = headerLine.split(/[,;]/).map((h) => h.trim().toLowerCase());
      
      console.log('📋 Headers CSV:', headers);
      
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
            row.latitude = parseCoordinate(val);
          }
          else if (h.includes("longitudine") || h.includes("longitude") || h.includes("lng")) {
            row.longitude = parseCoordinate(val);
          }
          else if (h.includes("specie") || h.includes("species")) {
            row.tree_species = cleanCSVValue(val);
          }
        });
        
        return row;
      }).filter((r) => r.tree_number && r.adopter_name);
      
      console.log(`📊 Trovate ${rows.length} righe valide`);
      
      if (rows.length === 0) { 
        toast.error("Nessun dato valido trovato nel file"); 
        return; 
      }
      
      const { error } = await supabase.from("adopted_trees").insert(rows);
      
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

  // ✅ AGGIUNGE UN NUOVO ALBERO
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

  // ✅ ELIMINA UN ALBERO
  const deleteTree = async (id: string) => {
    const { error } = await supabase.from("adopted_trees").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Albero eliminato");
      onReload();
    }
  };

  // ✅ AVVIA LA MODIFICA
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

  // ✅ SALVA LE MODIFICHE
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

  // ✅ TOGGLE PUBBLICATO/NON PUBBLICATO
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
      {/* ✅ SEZIONE IMPORTA CSV */}
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

      {/* ✅ SEZIONE NUOVO ALBERO */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <h3 className="font-semibold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nuovo Albero
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <Input 
            placeholder="Numero" 
            value={newTree.tree_number} 
            onChange={(e) => setNewTree({ ...newTree, tree_number: e.target.value })} 
          />
          <Input 
            placeholder="Adottante" 
            value={newTree.adopter_name} 
            onChange={(e) => setNewTree({ ...newTree, adopter_name: e.target.value })} 
          />
          <Input 
            placeholder="Dedicato a" 
            value={newTree.dedicated_to} 
            onChange={(e) => setNewTree({ ...newTree, dedicated_to: e.target.value })} 
          />
          <Input 
            placeholder="Specie" 
            value={newTree.tree_species} 
            onChange={(e) => setNewTree({ ...newTree, tree_species: e.target.value })} 
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Input 
            placeholder="Email adottante" 
            type="email" 
            value={newTree.adopter_email} 
            onChange={(e) => setNewTree({ ...newTree, adopter_email: e.target.value })} 
          />
          <Input 
            placeholder="Telefono adottante" 
            type="tel" 
            value={newTree.adopter_phone} 
            onChange={(e) => setNewTree({ ...newTree, adopter_phone: e.target.value })} 
          />
        </div>
        <Input 
          placeholder="Dedica" 
          value={newTree.dedication_message} 
          onChange={(e) => setNewTree({ ...newTree, dedication_message: e.target.value })} 
        />
        <Input 
          placeholder="Periodo adozione" 
          value={newTree.adoption_period} 
          onChange={(e) => setNewTree({ ...newTree, adoption_period: e.target.value })} 
        />
        <div className="grid grid-cols-2 gap-2">
          <Input 
            placeholder="Latitudine" 
            type="number" 
            step="any" 
            value={newTree.latitude} 
            onChange={(e) => setNewTree({ ...newTree, latitude: e.target.value })} 
          />
          <Input 
            placeholder="Longitudine" 
            type="number" 
            step="any" 
            value={newTree.longitude} 
            onChange={(e) => setNewTree({ ...newTree, longitude: e.target.value })} 
          />
        </div>
        
        {/* ✅ PULSANTE GPS */}
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={() => getCurrentPosition("new")} 
          disabled={gpsLoading === "new"} 
          className="w-full"
        >
          {gpsLoading === "new" ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <MapPin className="w-3 h-3 mr-1" />}
          Usa la mia posizione GPS
        </Button>
        
        <Button onClick={addTree} className="gradient-forest text-primary-foreground w-full">
          Aggiungi Albero
        </Button>
      </div>

      {/* ✅ LISTA ALBERI */}
      <h3 className="font-semibold">Alberi ({trees.length})</h3>
      <div className="space-y-2">
        {trees.map((tree) => (
          <div key={tree.id} className="rounded-lg border border-border bg-card p-3 space-y-2">
            {editingId === tree.id ? (
              // ✅ MODALITÀ MODIFICA
              <>
                <div className="grid grid-cols-2 gap-2">
                  <Input 
                    placeholder="Numero" 
                    value={editData.tree_number} 
                    onChange={(e) => setEditData({ ...editData, tree_number: e.target.value })} 
                  />
                  <Input 
                    placeholder="Adottante" 
                    value={editData.adopter_name} 
                    onChange={(e) => setEditData({ ...editData, adopter_name: e.target.value })} 
                  />
                  <Input 
                    placeholder="Dedicato a" 
                    value={editData.dedicated_to} 
                    onChange={(e) => setEditData({ ...editData, dedicated_to: e.target.value })} 
                  />
                  <Input 
                    placeholder="Specie" 
                    value={editData.tree_species} 
                    onChange={(e) => setEditData({ ...editData, tree_species: e.target.value })} 
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input 
                    placeholder="Email adottante" 
                    type="email" 
                    value={editData.adopter_email} 
                    onChange={(e) => setEditData({ ...editData, adopter_email: e.target.value })} 
                  />
                  <Input 
                    placeholder="Telefono adottante" 
                    type="tel" 
                    value={editData.adopter_phone} 
                    onChange={(e) => setEditData({ ...editData, adopter_phone: e.target.value })} 
                  />
                </div>
                <Input 
                  placeholder="Dedica" 
                  value={editData.dedication_message} 
                  onChange={(e) => setEditData({ ...editData, dedication_message: e.target.value })} 
                />
                <Input 
                  placeholder="Periodo" 
                  value={editData.adoption_period} 
                  onChange={(e) => setEditData({ ...editData, adoption_period: e.target.value })} 
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input 
                    placeholder="Latitudine" 
                    type="number" 
                    step="any" 
                    value={editData.latitude} 
                    onChange={(e) => setEditData({ ...editData, latitude: e.target.value })} 
                  />
                  <Input 
                    placeholder="Longitudine" 
                    type="number" 
                    step="any" 
                    value={editData.longitude} 
                    onChange={(e) => setEditData({ ...editData, longitude: e.target.value })} 
                  />
                </div>
                
                {/* ✅ PULSANTE GPS IN MODIFICA */}
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => getCurrentPosition("edit")} 
                  disabled={gpsLoading === "edit"} 
                  className="w-full"
                >
                  {gpsLoading === "edit" ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <MapPin className="w-3 h-3 mr-1" />}
                  Usa la mia posizione GPS
                </Button>
                
                <div className="flex gap-2">
                  <Button size="sm" onClick={saveEdit} className="flex-1">
                    <Check className="w-3 h-3 mr-1" />Salva
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingId(null)} className="flex-1">
                    <X className="w-3 h-3 mr-1" />Annulla
                  </Button>
                </div>
              </>
            ) : (
              // ✅ VISUALIZZAZIONE ALBERO
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <span className="font-mono text-xs text-primary">#{tree.tree_number}</span>
                  <span className="ml-2 text-sm text-foreground">{tree.adopter_name}</span>
                  {tree.tree_species && <span className="ml-2 text-xs text-muted-foreground">({tree.tree_species})</span>}
                  {tree.latitude && tree.longitude && (
                    <span className="ml-2 text-xs text-green-600">📍 GPS</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={tree.published !== false} 
                    onCheckedChange={() => togglePublished(tree.id, tree.published !== false)} 
                  />
                  <button onClick={() => startEdit(tree)} className="text-muted-foreground p-1 hover:text-foreground">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteTree(tree.id)} className="text-destructive p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTreesTab;
