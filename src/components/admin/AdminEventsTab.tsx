import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, X, Check, ImagePlus } from "lucide-react";
import RichTextEditor from "@/components/RichTextEditor";

interface AdminEventsTabProps {
  events: any[];
  onReload: () => void;
}

const AdminEventsTab = ({ events, onReload }: AdminEventsTabProps) => {
  const [newEvent, setNewEvent] = useState({ title: "", description: "", event_date: "", location: "", booking_enabled: false, image_url: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});

  const uploadHeaderImage = async (file: File, callback: (url: string) => void) => {
    const ext = file.name.split(".").pop();
    const path = `headers/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("content-images").upload(path, file);
    if (error) { toast.error("Errore upload: " + error.message); return; }
    const { data } = supabase.storage.from("content-images").getPublicUrl(path);
    callback(data.publicUrl);
  };

  const addEvent = async () => {
    if (!newEvent.title || !newEvent.event_date) { toast.error("Titolo e data obbligatori"); return; }
    const payload = { ...newEvent, image_url: newEvent.image_url || null };
    const { error } = await supabase.from("events").insert([payload]);
    if (error) toast.error(error.message);
    else { toast.success("Evento creato!"); setNewEvent({ title: "", description: "", event_date: "", location: "", booking_enabled: false, image_url: "" }); onReload(); }
  };

  const deleteEvent = async (id: string) => {
    await supabase.from("events").delete().eq("id", id);
    toast.success("Evento eliminato");
    onReload();
  };

  const startEdit = (event: any) => {
    setEditingId(event.id);
    setEditData({ title: event.title, description: event.description || "", event_date: event.event_date?.slice(0, 16) || "", location: event.location || "", booking_enabled: event.booking_enabled || false, image_url: event.image_url || "" });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const payload = { ...editData, image_url: editData.image_url || null };
    const { error } = await supabase.from("events").update(payload).eq("id", editingId);
    if (error) toast.error(error.message);
    else { toast.success("Evento aggiornato!"); setEditingId(null); onReload(); }
  };

  const togglePublished = async (id: string, current: boolean) => {
    const { error } = await supabase.from("events").update({ published: !current }).eq("id", id);
    if (error) toast.error(error.message);
    else onReload();
  };

  const HeaderImageUpload = ({ value, onChange }: { value: string; onChange: (url: string) => void }) => (
    <div className="space-y-2">
      <Label className="text-xs">Immagine testata</Label>
      {value && <img src={value} alt="Header" className="w-full h-32 object-cover rounded-lg" />}
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" className="flex-1" onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "image/*";
          input.onchange = (e: any) => {
            const file = e.target.files?.[0];
            if (file) uploadHeaderImage(file, onChange);
          };
          input.click();
        }}>
          <ImagePlus className="w-3 h-3 mr-1" /> {value ? "Cambia" : "Carica"} immagine
        </Button>
        {value && <Button type="button" variant="outline" size="sm" onClick={() => onChange("")}>Rimuovi</Button>}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <h3 className="font-semibold flex items-center gap-2"><Plus className="w-4 h-4" /> Nuovo Evento</h3>
        <Input placeholder="Titolo" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
        <Label className="text-xs">Descrizione</Label>
        <RichTextEditor content={newEvent.description} onChange={(html) => setNewEvent({ ...newEvent, description: html })} />
        <Input type="datetime-local" value={newEvent.event_date} onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })} />
        <Input placeholder="Luogo" value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} />
        <HeaderImageUpload value={newEvent.image_url} onChange={(url) => setNewEvent({ ...newEvent, image_url: url })} />
        <div className="flex items-center gap-2">
          <Switch checked={newEvent.booking_enabled} onCheckedChange={(c) => setNewEvent({ ...newEvent, booking_enabled: c })} />
          <Label className="text-sm">Abilita prenotazioni</Label>
        </div>
        <Button onClick={addEvent} className="gradient-forest text-primary-foreground w-full">Crea Evento</Button>
      </div>

      <div className="space-y-2">
        {events.map((event) => (
          <div key={event.id} className="rounded-lg border border-border bg-card overflow-hidden">
            {editingId === event.id ? (
              <div className="p-3 space-y-2">
                <Input placeholder="Titolo" value={editData.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })} />
                <Label className="text-xs">Descrizione</Label>
                <RichTextEditor content={editData.description} onChange={(html) => setEditData({ ...editData, description: html })} />
                <Input type="datetime-local" value={editData.event_date} onChange={(e) => setEditData({ ...editData, event_date: e.target.value })} />
                <Input placeholder="Luogo" value={editData.location} onChange={(e) => setEditData({ ...editData, location: e.target.value })} />
                <HeaderImageUpload value={editData.image_url} onChange={(url) => setEditData({ ...editData, image_url: url })} />
                <div className="flex items-center gap-2">
                  <Switch checked={editData.booking_enabled} onCheckedChange={(c) => setEditData({ ...editData, booking_enabled: c })} />
                  <Label className="text-sm">Prenotazioni</Label>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={saveEdit} className="flex-1"><Check className="w-3 h-3 mr-1" />Salva</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingId(null)} className="flex-1"><X className="w-3 h-3 mr-1" />Annulla</Button>
                </div>
              </div>
            ) : (
              <>
                {event.image_url && <img src={event.image_url} alt={event.title} className="w-full h-24 object-cover" />}
                <div className="flex items-center justify-between p-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{event.location} — {new Date(event.event_date).toLocaleDateString("it-IT")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={event.published !== false} onCheckedChange={() => togglePublished(event.id, event.published !== false)} />
                    <button onClick={() => startEdit(event)} className="text-muted-foreground p-1 hover:text-foreground"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => deleteEvent(event.id)} className="text-destructive p-1"><Trash2 className="w-4 h-4" /></button>
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

export default AdminEventsTab;
