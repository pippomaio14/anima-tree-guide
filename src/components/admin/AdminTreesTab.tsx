import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Upload, Plus, Trash2, Pencil, X, Check } from "lucide-react";

interface AdminTreesTabProps {
  trees: any[];
  onReload: () => void;
}

const AdminTreesTab = ({ trees, onReload }: AdminTreesTabProps) => {
  const [newTree, setNewTree] = useState({ tree_number: "", adopter_name: "", dedicated_to: "", dedication_message: "", adoption_period: "", tree_species: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});

  const handleCSVImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const lines = text.split("\n").filter((l) => l.trim());
    if (lines.length < 2) { toast.error("File vuoto o formato non valido"); return; }
    const headers = lines[0].split(/[,;]/).map((h) => h.trim().toLowerCase());
    const rows = lines.slice(1).map((line) => {
      const vals = line.split(/[,;]/).map((v) => v.trim());
      const row: any = {};
      headers.forEach((h, i) => {
        if (h.includes("numero") || h === "number") row.tree_number = vals[i] || "";
        else if (h.includes("adottante") || h.includes("adopter")) row.adopter_name = vals[i] || "";
        else if (h.includes("dedicat") && !h.includes("messag")) row.dedicated_to = vals[i] || null;
        else if (h.includes("dedica") || h.includes("messag")) row.dedication_message = vals[i] || null;
        else if (h.includes("periodo") || h.includes("period")) row.adoption_period = vals[i] || null;
      });
      return row;
    }).filter((r) => r.tree_number && r.adopter_name);
    if (rows.length === 0) { toast.error("Nessun dato valido trovato nel file"); return; }
    const { error } = await supabase.from("adopted_trees").insert(rows);
    if (error) toast.error("Errore: " + error.message);
    else { toast.success(`${rows.length} alberi importati!`); onReload(); }
  };

  const addTree = async () => {
    if (!newTree.tree_number || !newTree.adopter_name) { toast.error("Numero e adottante obbligatori"); return; }
    const { error } = await supabase.from("adopted_trees").insert([newTree]);
    if (error) toast.error(error.message);
    else { toast.success("Albero aggiunto!"); setNewTree({ tree_number: "", adopter_name: "", dedicated_to: "", dedication_message: "", adoption_period: "", tree_species: "" }); onReload(); }
  };

  const deleteTree = async (id: string) => {
    await supabase.from("adopted_trees").delete().eq("id", id);
    toast.success("Albero eliminato");
    onReload();
  };

  const startEdit = (tree: any) => {
    setEditingId(tree.id);
    setEditData({ tree_number: tree.tree_number, adopter_name: tree.adopter_name, dedicated_to: tree.dedicated_to || "", dedication_message: tree.dedication_message || "", adoption_period: tree.adoption_period || "", tree_species: tree.tree_species || "" });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const { error } = await supabase.from("adopted_trees").update(editData).eq("id", editingId);
    if (error) toast.error(error.message);
    else { toast.success("Albero aggiornato!"); setEditingId(null); onReload(); }
  };

  const togglePublished = async (id: string, current: boolean) => {
    const { error } = await supabase.from("adopted_trees").update({ published: !current }).eq("id", id);
    if (error) toast.error(error.message);
    else onReload();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <h3 className="font-semibold flex items-center gap-2"><Upload className="w-4 h-4" /> Importa CSV</h3>
        <p className="text-xs text-muted-foreground">Colonne: numero, adottante, dedicato_a, dedica, periodo</p>
        <Input type="file" accept=".csv,.txt" onChange={handleCSVImport} />
      </div>

      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <h3 className="font-semibold flex items-center gap-2"><Plus className="w-4 h-4" /> Nuovo Albero</h3>
        <div className="grid grid-cols-2 gap-2">
          <Input placeholder="Numero" value={newTree.tree_number} onChange={(e) => setNewTree({ ...newTree, tree_number: e.target.value })} />
          <Input placeholder="Adottante" value={newTree.adopter_name} onChange={(e) => setNewTree({ ...newTree, adopter_name: e.target.value })} />
          <Input placeholder="Dedicato a" value={newTree.dedicated_to} onChange={(e) => setNewTree({ ...newTree, dedicated_to: e.target.value })} />
          <Input placeholder="Specie" value={newTree.tree_species} onChange={(e) => setNewTree({ ...newTree, tree_species: e.target.value })} />
        </div>
        <Input placeholder="Dedica" value={newTree.dedication_message} onChange={(e) => setNewTree({ ...newTree, dedication_message: e.target.value })} />
        <Input placeholder="Periodo adozione" value={newTree.adoption_period} onChange={(e) => setNewTree({ ...newTree, adoption_period: e.target.value })} />
        <Button onClick={addTree} className="gradient-forest text-primary-foreground w-full">Aggiungi Albero</Button>
      </div>

      <h3 className="font-semibold">Alberi ({trees.length})</h3>
      <div className="space-y-2">
        {trees.map((tree) => (
          <div key={tree.id} className="rounded-lg border border-border bg-card p-3 space-y-2">
            {editingId === tree.id ? (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Numero" value={editData.tree_number} onChange={(e) => setEditData({ ...editData, tree_number: e.target.value })} />
                  <Input placeholder="Adottante" value={editData.adopter_name} onChange={(e) => setEditData({ ...editData, adopter_name: e.target.value })} />
                  <Input placeholder="Dedicato a" value={editData.dedicated_to} onChange={(e) => setEditData({ ...editData, dedicated_to: e.target.value })} />
                  <Input placeholder="Specie" value={editData.tree_species} onChange={(e) => setEditData({ ...editData, tree_species: e.target.value })} />
                </div>
                <Input placeholder="Dedica" value={editData.dedication_message} onChange={(e) => setEditData({ ...editData, dedication_message: e.target.value })} />
                <Input placeholder="Periodo" value={editData.adoption_period} onChange={(e) => setEditData({ ...editData, adoption_period: e.target.value })} />
                <div className="flex gap-2">
                  <Button size="sm" onClick={saveEdit} className="flex-1"><Check className="w-3 h-3 mr-1" />Salva</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingId(null)} className="flex-1"><X className="w-3 h-3 mr-1" />Annulla</Button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <span className="font-mono text-xs text-primary">#{tree.tree_number}</span>
                  <span className="ml-2 text-sm text-foreground">{tree.adopter_name}</span>
                  {tree.tree_species && <span className="ml-2 text-xs text-muted-foreground">({tree.tree_species})</span>}
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={tree.published !== false} onCheckedChange={() => togglePublished(tree.id, tree.published !== false)} />
                  <button onClick={() => startEdit(tree)} className="text-muted-foreground p-1 hover:text-foreground"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => deleteTree(tree.id)} className="text-destructive p-1"><Trash2 className="w-4 h-4" /></button>
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
