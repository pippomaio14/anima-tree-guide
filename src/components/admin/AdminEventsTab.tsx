import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, X, Check } from "lucide-react";

interface AdminEventsTabProps {
  events: any[];
  onReload: () => void;
}

const AdminEventsTab = ({ events, onReload }: AdminEventsTabProps) => {
  const [newEvent, setNewEvent] = useState({ title: "", description: "", event_date: "", location: "", booking_enabled: false });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});

  const addEvent = async () => {
    if (!newEvent.title || !newEvent.event_date) { toast.error("Titolo e data obbligatori"); return; }
    const { error } = await supabase.from("events").insert([newEvent]);
    if (error) toast.error(error.message);
    else { toast.success("Evento creato!"); setNewEvent({ title: "", description: "", event_date: "", location: "", booking_enabled: false }); onReload(); }
  };

  const deleteEvent = async (id: string) => {
    await supabase.from("events").delete().eq("id", id);
    toast.success("Evento eliminato");
    onReload();
  };

  const startEdit = (event: any) => {
    setEditingId(event.id);
    setEditData({ title: event.title, description: event.description || "", event_date: event.event_date?.slice(0, 16) || "", location: event.location || "", booking_enabled: event.booking_enabled || false });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const { error } = await supabase.from("events").update(editData).eq("id", editingId);
    if (error) toast.error(error.message);
    else { toast.success("Evento aggiornato!"); setEditingId(null); onReload(); }
  };

  const togglePublished = async (id: string, current: boolean) => {
    const { error } = await supabase.from("events").update({ published: !current }).eq("id", id);
    if (error) toast.error(error.message);
    else onReload();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <h3 className="font-semibold flex items-center gap-2"><Plus className="w-4 h-4" /> Nuovo Evento</h3>
        <Input placeholder="Titolo" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
        <Textarea placeholder="Descrizione" value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} />
        <Input type="datetime-local" value={newEvent.event_date} onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })} />
        <Input placeholder="Luogo" value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} />
        <div className="flex items-center gap-2">
          <Switch checked={newEvent.booking_enabled} onCheckedChange={(c) => setNewEvent({ ...newEvent, booking_enabled: c })} />
          <Label className="text-sm">Abilita prenotazioni</Label>
        </div>
        <Button onClick={addEvent} className="gradient-forest text-primary-foreground w-full">Crea Evento</Button>
      </div>

      <div className="space-y-2">
        {events.map((event) => (
          <div key={event.id} className="rounded-lg border border-border bg-card p-3 space-y-2">
            {editingId === event.id ? (
              <>
                <Input placeholder="Titolo" value={editData.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })} />
                <Textarea placeholder="Descrizione" value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} />
                <Input type="datetime-local" value={editData.event_date} onChange={(e) => setEditData({ ...editData, event_date: e.target.value })} />
                <Input placeholder="Luogo" value={editData.location} onChange={(e) => setEditData({ ...editData, location: e.target.value })} />
                <div className="flex items-center gap-2">
                  <Switch checked={editData.booking_enabled} onCheckedChange={(c) => setEditData({ ...editData, booking_enabled: c })} />
                  <Label className="text-sm">Prenotazioni</Label>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={saveEdit} className="flex-1"><Check className="w-3 h-3 mr-1" />Salva</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingId(null)} className="flex-1"><X className="w-3 h-3 mr-1" />Annulla</Button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between">
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminEventsTab;
