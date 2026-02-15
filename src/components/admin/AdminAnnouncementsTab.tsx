import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, X, Check, ImagePlus, MessageCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import RichTextEditor from "@/components/RichTextEditor";

interface AdminAnnouncementsTabProps {
  announcements: any[];
  onReload: () => void;
}

const AdminAnnouncementsTab = ({ announcements, onReload }: AdminAnnouncementsTabProps) => {
  const [newItem, setNewItem] = useState({ title: "", content: "", image_url: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const [volunteers, setVolunteers] = useState<{ full_name: string; phone: string }[]>([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);

  const sendWhatsApp = async (item: any) => {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, phone")
      .eq("is_volunteer", true);
    const vols = (data || []).filter((v) => v.phone);
    if (vols.length === 0) {
      toast.error("Nessun volontario con numero di telefono trovato");
      return;
    }
    setVolunteers(vols);
    setSelectedAnnouncement(item);
    setWhatsappOpen(true);
  };

  const getWhatsAppUrl = (phone: string, title: string) => {
    const cleanPhone = phone.replace(/[^0-9+]/g, "").replace(/^\+/, "");
    const text = encodeURIComponent(`📢 *Avviso del Parco*\n\n*${title}*\n\nPer maggiori dettagli consulta l'app.`);
    return `https://wa.me/${cleanPhone}?text=${text}`;
  };

  const uploadImage = async (file: File, callback: (url: string) => void) => {
    const ext = file.name.split(".").pop();
    const path = `announcements/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("content-images").upload(path, file);
    if (error) { toast.error("Errore upload: " + error.message); return; }
    const { data } = supabase.storage.from("content-images").getPublicUrl(path);
    callback(data.publicUrl);
  };

  const addItem = async () => {
    if (!newItem.title) { toast.error("Il titolo è obbligatorio"); return; }
    const payload = { ...newItem, image_url: newItem.image_url || null };
    const { error } = await supabase.from("announcements").insert([payload]);
    if (error) toast.error(error.message);
    else { toast.success("Avviso pubblicato!"); setNewItem({ title: "", content: "", image_url: "" }); onReload(); }
  };

  const deleteItem = async (id: string) => {
    await supabase.from("announcements").delete().eq("id", id);
    toast.success("Avviso eliminato");
    onReload();
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setEditData({ title: item.title, content: item.content || "", image_url: item.image_url || "" });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const payload = { ...editData, image_url: editData.image_url || null };
    const { error } = await supabase.from("announcements").update(payload).eq("id", editingId);
    if (error) toast.error(error.message);
    else { toast.success("Avviso aggiornato!"); setEditingId(null); onReload(); }
  };

  const togglePublished = async (id: string, current: boolean) => {
    const { error } = await supabase.from("announcements").update({ published: !current }).eq("id", id);
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
          input.type = "file";
          input.accept = "image/*";
          input.onchange = (e: any) => {
            const file = e.target.files?.[0];
            if (file) uploadImage(file, onChange);
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
        <h3 className="font-semibold flex items-center gap-2"><Plus className="w-4 h-4" /> Nuovo Avviso</h3>
        <Input placeholder="Titolo" value={newItem.title} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} />
        <Label className="text-xs">Contenuto</Label>
        <RichTextEditor content={newItem.content} onChange={(html) => setNewItem({ ...newItem, content: html })} />
        <ImageUpload value={newItem.image_url} onChange={(url) => setNewItem({ ...newItem, image_url: url })} />
        <Button onClick={addItem} className="gradient-forest text-primary-foreground w-full">Pubblica Avviso</Button>
      </div>

      <div className="space-y-2">
        {announcements.map((item) => (
          <div key={item.id} className="rounded-lg border border-border bg-card overflow-hidden">
            {editingId === item.id ? (
              <div className="p-3 space-y-2">
                <Input placeholder="Titolo" value={editData.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })} />
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
                    <p className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleDateString("it-IT")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={item.published !== false} onCheckedChange={() => togglePublished(item.id, item.published !== false)} />
                    <button onClick={() => startEdit(item)} className="text-muted-foreground p-1 hover:text-foreground"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => sendWhatsApp(item)} className="text-green-600 p-1 hover:text-green-700" title="Invia su WhatsApp ai volontari"><MessageCircle className="w-4 h-4" /></button>
                    <button onClick={() => deleteItem(item.id)} className="text-destructive p-1"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <Dialog open={whatsappOpen} onOpenChange={setWhatsappOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">Invia avviso ai volontari</DialogTitle>
          </DialogHeader>
          {selectedAnnouncement && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Clicca sul nome di ogni volontario per aprire WhatsApp e inviare l'avviso "<strong>{selectedAnnouncement.title}</strong>".
              </p>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {volunteers.map((v, i) => (
                  <a
                    key={i}
                    href={getWhatsAppUrl(v.phone, selectedAnnouncement.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-green-600 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{v.full_name || "Volontario"}</p>
                      <p className="text-xs text-muted-foreground">{v.phone}</p>
                    </div>
                  </a>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">{volunteers.length} volontari trovati</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAnnouncementsTab;
