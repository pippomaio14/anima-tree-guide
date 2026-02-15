import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, X, Check, ImagePlus } from "lucide-react";
import RichTextEditor from "@/components/RichTextEditor";

interface AdminParkSectionsTabProps {
  sections: any[];
  onReload: () => void;
}

const ICON_OPTIONS = [
  { value: "TreePine", label: "Albero" },
  { value: "Target", label: "Obiettivo" },
  { value: "Heart", label: "Cuore" },
  { value: "Globe", label: "Globo" },
  { value: "Leaf", label: "Foglia" },
  { value: "Sun", label: "Sole" },
  { value: "Mountain", label: "Montagna" },
  { value: "Flower2", label: "Fiore" },
];

const AdminParkSectionsTab = ({ sections, onReload }: AdminParkSectionsTabProps) => {
  const [newItem, setNewItem] = useState({ title: "", content: "", image_url: "", icon: "TreePine", sort_order: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});

  const uploadImage = async (file: File, callback: (url: string) => void) => {
    const ext = file.name.split(".").pop();
    const path = `park-sections/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("content-images").upload(path, file);
    if (error) { toast.error("Errore upload: " + error.message); return; }
    const { data } = supabase.storage.from("content-images").getPublicUrl(path);
    callback(data.publicUrl);
  };

  const addItem = async () => {
    if (!newItem.title) { toast.error("Il titolo è obbligatorio"); return; }
    const payload = { ...newItem, image_url: newItem.image_url || null };
    const { error } = await supabase.from("park_sections").insert([payload]);
    if (error) toast.error(error.message);
    else { toast.success("Sezione aggiunta!"); setNewItem({ title: "", content: "", image_url: "", icon: "TreePine", sort_order: 0 }); onReload(); }
  };

  const deleteItem = async (id: string) => {
    await supabase.from("park_sections").delete().eq("id", id);
    toast.success("Sezione eliminata");
    onReload();
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setEditData({ title: item.title, content: item.content || "", image_url: item.image_url || "", icon: item.icon || "TreePine", sort_order: item.sort_order || 0 });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const payload = { ...editData, image_url: editData.image_url || null };
    const { error } = await supabase.from("park_sections").update(payload).eq("id", editingId);
    if (error) toast.error(error.message);
    else { toast.success("Sezione aggiornata!"); setEditingId(null); onReload(); }
  };

  const togglePublished = async (id: string, current: boolean) => {
    const { error } = await supabase.from("park_sections").update({ published: !current }).eq("id", id);
    if (error) toast.error(error.message);
    else onReload();
  };

  const ImageUpload = ({ value, onChange }: { value: string; onChange: (url: string) => void }) => (
    <div className="space-y-2">
      <Label className="text-xs">Immagine</Label>
      {value && <img src={value} alt="Cover" className="w-full h-32 object-cover rounded-lg" />}
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" className="flex-1" onClick={() => {
          const input = document.createElement("input");
          input.type = "file"; input.accept = "image/*";
          input.onchange = (e: any) => { const file = e.target.files?.[0]; if (file) uploadImage(file, onChange); };
          input.click();
        }}>
          <ImagePlus className="w-3 h-3 mr-1" /> {value ? "Cambia" : "Carica"} immagine
        </Button>
        {value && <Button type="button" variant="outline" size="sm" onClick={() => onChange("")}>Rimuovi</Button>}
      </div>
    </div>
  );

  const sorted = [...sections].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <h3 className="font-semibold flex items-center gap-2"><Plus className="w-4 h-4" /> Nuova Sezione Parco</h3>
        <Input placeholder="Titolo" value={newItem.title} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} />
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-xs">Icona</Label>
            <Select value={newItem.icon} onValueChange={(v) => setNewItem({ ...newItem, icon: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ICON_OPTIONS.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Ordine</Label>
            <Input type="number" value={newItem.sort_order} onChange={(e) => setNewItem({ ...newItem, sort_order: parseInt(e.target.value) || 0 })} />
          </div>
        </div>
        <Label className="text-xs">Contenuto</Label>
        <RichTextEditor content={newItem.content} onChange={(html) => setNewItem({ ...newItem, content: html })} />
        <ImageUpload value={newItem.image_url} onChange={(url) => setNewItem({ ...newItem, image_url: url })} />
        <Button onClick={addItem} className="gradient-forest text-primary-foreground w-full">Aggiungi Sezione</Button>
      </div>

      <div className="space-y-2">
        {sorted.map((item) => (
          <div key={item.id} className="rounded-lg border border-border bg-card overflow-hidden">
            {editingId === item.id ? (
              <div className="p-3 space-y-2">
                <Input placeholder="Titolo" value={editData.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })} />
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Icona</Label>
                    <Select value={editData.icon} onValueChange={(v) => setEditData({ ...editData, icon: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {ICON_OPTIONS.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Ordine</Label>
                    <Input type="number" value={editData.sort_order} onChange={(e) => setEditData({ ...editData, sort_order: parseInt(e.target.value) || 0 })} />
                  </div>
                </div>
                <Label className="text-xs">Contenuto</Label>
                <RichTextEditor content={editData.content} onChange={(html) => setEditData({ ...editData, content: html })} />
                <ImageUpload value={editData.image_url} onChange={(url) => setEditData({ ...editData, image_url: url })} />
                <div className="flex gap-2">
                  <Button size="sm" onClick={saveEdit} className="flex-1"><Check className="w-3 h-3 mr-1" />Salva</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingId(null)} className="flex-1"><X className="w-3 h-3 mr-1" />Annulla</Button>
                </div>
              </div>
            ) : (
              <>
                {item.image_url && <img src={item.image_url} alt={item.title} className="w-full h-24 object-cover" />}
                <div className="flex items-center justify-between p-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">Ordine: {item.sort_order}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={item.published !== false} onCheckedChange={() => togglePublished(item.id, item.published !== false)} />
                    <button onClick={() => startEdit(item)} className="text-muted-foreground p-1 hover:text-foreground"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => deleteItem(item.id)} className="text-destructive p-1"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminParkSectionsTab;
