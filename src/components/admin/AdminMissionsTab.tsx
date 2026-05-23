import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, X, Check } from "lucide-react";

const sb = supabase as any;

interface Mission {
  id: string;
  title: string;
  description: string | null;
  objective: string | null;
  points: number;
  difficulty: string;
  icon: string;
  tips: string[];
  sort_order: number;
  published: boolean;
}

const empty = { title: "", description: "", objective: "", points: 30, difficulty: "facile", icon: "TreePine", tips: [""], sort_order: 0 };

const AdminMissionsTab = () => {
  const [items, setItems] = useState<Mission[]>([]);
  const [newM, setNewM] = useState<any>({ ...empty });
  const [editId, setEditId] = useState<string | null>(null);
  const [editM, setEditM] = useState<any>({});

  const load = async () => {
    const { data } = await sb.from("missions").select("*").order("sort_order");
    setItems(data || []);
  };
  useEffect(() => { load(); }, []);

  const addM = async () => {
    if (!newM.title) return toast.error("Titolo richiesto");
    const payload = { ...newM, tips: newM.tips.filter((t: string) => t.trim()) };
    const { error } = await sb.from("missions").insert([payload]);
    if (error) return toast.error(error.message);
    setNewM({ ...empty }); load(); toast.success("Missione creata");
  };
  const save = async () => {
    const payload = { ...editM, tips: editM.tips.filter((t: string) => t.trim()) };
    const { error } = await sb.from("missions").update(payload).eq("id", editId);
    if (error) return toast.error(error.message);
    setEditId(null); load();
  };
  const del = async (id: string) => {
    if (!confirm("Eliminare la missione?")) return;
    await sb.from("missions").delete().eq("id", id); load();
  };
  const togglePub = async (m: Mission) => {
    await sb.from("missions").update({ published: !m.published }).eq("id", m.id); load();
  };

  const Form = ({ data, setData }: any) => (
    <div className="space-y-2">
      <Input placeholder="Titolo" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
      <Textarea placeholder="Descrizione" value={data.description || ""} onChange={(e) => setData({ ...data, description: e.target.value })} />
      <Textarea placeholder="Obiettivo" value={data.objective || ""} onChange={(e) => setData({ ...data, objective: e.target.value })} />
      <div className="grid grid-cols-3 gap-2">
        <Input type="number" placeholder="Punti" value={data.points} onChange={(e) => setData({ ...data, points: parseInt(e.target.value) || 0 })} />
        <select className="rounded-md border border-input bg-background px-3 py-2 text-sm" value={data.difficulty} onChange={(e) => setData({ ...data, difficulty: e.target.value })}>
          <option value="facile">facile</option>
          <option value="media">media</option>
          <option value="difficile">difficile</option>
        </select>
        <Input placeholder="Icona Lucide" value={data.icon} onChange={(e) => setData({ ...data, icon: e.target.value })} />
      </div>
      <Input type="number" placeholder="Ordine" value={data.sort_order} onChange={(e) => setData({ ...data, sort_order: parseInt(e.target.value) || 0 })} />
      <Label className="text-xs">Consigli</Label>
      {data.tips.map((t: string, i: number) => (
        <div key={i} className="flex gap-2">
          <Input placeholder={`Consiglio ${i + 1}`} value={t} onChange={(e) => {
            const tips = [...data.tips]; tips[i] = e.target.value; setData({ ...data, tips });
          }} />
          <Button type="button" variant="outline" size="sm" onClick={() => setData({ ...data, tips: data.tips.filter((_: any, j: number) => j !== i) })}>×</Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => setData({ ...data, tips: [...data.tips, ""] })}>+ Consiglio</Button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-4 space-y-2">
        <h3 className="font-semibold flex items-center gap-2"><Plus className="w-4 h-4" /> Nuova missione</h3>
        <Form data={newM} setData={setNewM} />
        <Button onClick={addM} className="w-full gradient-forest text-primary-foreground">Crea missione</Button>
      </div>

      <div className="space-y-2">
        {items.map((m) => (
          <div key={m.id} className="rounded-lg border border-border bg-card">
            {editId === m.id ? (
              <div className="p-3 space-y-2">
                <Form data={editM} setData={setEditM} />
                <div className="flex gap-2">
                  <Button size="sm" onClick={save} className="flex-1"><Check className="w-3 h-3 mr-1" />Salva</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditId(null)} className="flex-1"><X className="w-3 h-3 mr-1" />Annulla</Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3">
                <div className="flex-1">
                  <p className="text-sm font-medium">{m.title}</p>
                  <p className="text-xs text-muted-foreground">{m.difficulty} · {m.points} punti</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={m.published} onCheckedChange={() => togglePub(m)} />
                  <button onClick={() => { setEditId(m.id); setEditM({ ...m, tips: m.tips?.length ? [...m.tips] : [""] }); }} className="p-1"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => del(m.id)} className="p-1 text-destructive"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMissionsTab;
