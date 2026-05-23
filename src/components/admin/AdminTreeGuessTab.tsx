import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, X, Check, ImagePlus } from "lucide-react";

const sb = supabase as any;

interface Item {
  id: string;
  species_name: string;
  scientific_name: string | null;
  image_url: string;
  hint: string | null;
  sort_order: number;
  published: boolean;
}

const empty = { species_name: "", scientific_name: "", image_url: "", hint: "", sort_order: 0 };

const AdminTreeGuessTab = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [newI, setNewI] = useState<any>({ ...empty });
  const [editId, setEditId] = useState<string | null>(null);
  const [editI, setEditI] = useState<any>({});

  const load = async () => {
    const { data } = await sb.from("tree_guess_items").select("*").order("sort_order");
    setItems(data || []);
  };
  useEffect(() => { load(); }, []);

  const uploadImage = async (file: File, cb: (url: string) => void) => {
    const ext = file.name.split(".").pop();
    const path = `tree-guess/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("content-images").upload(path, file);
    if (error) return toast.error("Errore upload: " + error.message);
    const { data } = supabase.storage.from("content-images").getPublicUrl(path);
    cb(data.publicUrl);
  };

  const add = async () => {
    if (!newI.species_name || !newI.image_url) return toast.error("Nome e immagine obbligatori");
    const { error } = await sb.from("tree_guess_items").insert([newI]);
    if (error) return toast.error(error.message);
    setNewI({ ...empty }); load(); toast.success("Pianta aggiunta");
  };
  const save = async () => {
    const { error } = await sb.from("tree_guess_items").update(editI).eq("id", editId);
    if (error) return toast.error(error.message);
    setEditId(null); load();
  };
  const del = async (id: string) => {
    if (!confirm("Eliminare?")) return;
    await sb.from("tree_guess_items").delete().eq("id", id); load();
  };
  const togglePub = async (it: Item) => {
    await sb.from("tree_guess_items").update({ published: !it.published }).eq("id", it.id); load();
  };

  const ImgUp = ({ value, onChange }: { value: string; onChange: (u: string) => void }) => (
    <div className="space-y-2">
      <Label className="text-xs">Immagine pianta</Label>
      {value && <img src={value} alt="" className="w-full h-40 object-cover rounded-lg" />}
      <Button type="button" variant="outline" size="sm" className="w-full" onClick={() => {
        const inp = document.createElement("input");
        inp.type = "file"; inp.accept = "image/*";
        inp.onchange = (e: any) => { const f = e.target.files?.[0]; if (f) uploadImage(f, onChange); };
        inp.click();
      }}>
        <ImagePlus className="w-3 h-3 mr-1" /> {value ? "Cambia" : "Carica"} immagine
      </Button>
    </div>
  );

  const Form = ({ data, setData }: any) => (
    <div className="space-y-2">
      <Input placeholder="Nome comune (es: Quercia)" value={data.species_name} onChange={(e) => setData({ ...data, species_name: e.target.value })} />
      <Input placeholder="Nome scientifico" value={data.scientific_name || ""} onChange={(e) => setData({ ...data, scientific_name: e.target.value })} />
      <Textarea placeholder="Suggerimento (opzionale)" value={data.hint || ""} onChange={(e) => setData({ ...data, hint: e.target.value })} />
      <Input type="number" placeholder="Ordine" value={data.sort_order} onChange={(e) => setData({ ...data, sort_order: parseInt(e.target.value) || 0 })} />
      <ImgUp value={data.image_url} onChange={(u) => setData({ ...data, image_url: u })} />
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-4 space-y-2">
        <h3 className="font-semibold flex items-center gap-2"><Plus className="w-4 h-4" /> Nuova pianta da indovinare</h3>
        <Form data={newI} setData={setNewI} />
        <Button onClick={add} className="w-full gradient-forest text-primary-foreground">Aggiungi</Button>
      </div>

      <div className="space-y-2">
        {items.map((it) => (
          <div key={it.id} className="rounded-lg border border-border bg-card overflow-hidden">
            {editId === it.id ? (
              <div className="p-3 space-y-2">
                <Form data={editI} setData={setEditI} />
                <div className="flex gap-2">
                  <Button size="sm" onClick={save} className="flex-1"><Check className="w-3 h-3 mr-1" />Salva</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditId(null)} className="flex-1"><X className="w-3 h-3 mr-1" />Annulla</Button>
                </div>
              </div>
            ) : (
              <>
                {it.image_url && <img src={it.image_url} alt={it.species_name} className="w-full h-32 object-cover" />}
                <div className="flex items-center justify-between p-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{it.species_name}</p>
                    <p className="text-xs text-muted-foreground italic">{it.scientific_name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={it.published} onCheckedChange={() => togglePub(it)} />
                    <button onClick={() => { setEditId(it.id); setEditI({ ...it }); }} className="p-1"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => del(it.id)} className="p-1 text-destructive"><Trash2 className="w-4 h-4" /></button>
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

export default AdminTreeGuessTab;
