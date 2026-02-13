import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, X, Check, ImagePlus } from "lucide-react";
import RichTextEditor from "@/components/RichTextEditor";

interface AdminArticlesTabProps {
  articles: any[];
  onReload: () => void;
}

const AdminArticlesTab = ({ articles, onReload }: AdminArticlesTabProps) => {
  const [newArticle, setNewArticle] = useState({ title: "", content: "", category: "article", image_url: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});

  const uploadImage = async (file: File, callback: (url: string) => void) => {
    const ext = file.name.split(".").pop();
    const path = `articles/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("content-images").upload(path, file);
    if (error) { toast.error("Errore upload: " + error.message); return; }
    const { data } = supabase.storage.from("content-images").getPublicUrl(path);
    callback(data.publicUrl);
  };

  const addArticle = async () => {
    if (!newArticle.title) { toast.error("Il titolo è obbligatorio"); return; }
    const payload = { ...newArticle, image_url: newArticle.image_url || null };
    const { error } = await supabase.from("articles").insert([payload]);
    if (error) toast.error(error.message);
    else { toast.success("Articolo pubblicato!"); setNewArticle({ title: "", content: "", category: "article", image_url: "" }); onReload(); }
  };

  const deleteArticle = async (id: string) => {
    await supabase.from("articles").delete().eq("id", id);
    toast.success("Articolo eliminato");
    onReload();
  };

  const startEdit = (article: any) => {
    setEditingId(article.id);
    setEditData({ title: article.title, content: article.content || "", category: article.category || "article", image_url: article.image_url || "" });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const payload = { ...editData, image_url: editData.image_url || null };
    const { error } = await supabase.from("articles").update(payload).eq("id", editingId);
    if (error) toast.error(error.message);
    else { toast.success("Articolo aggiornato!"); setEditingId(null); onReload(); }
  };

  const togglePublished = async (id: string, current: boolean) => {
    const { error } = await supabase.from("articles").update({ published: !current }).eq("id", id);
    if (error) toast.error(error.message);
    else onReload();
  };

  const ImageUpload = ({ value, onChange }: { value: string; onChange: (url: string) => void }) => (
    <div className="space-y-2">
      <Label className="text-xs">Immagine copertina</Label>
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
        <h3 className="font-semibold flex items-center gap-2"><Plus className="w-4 h-4" /> Nuovo Articolo</h3>
        <Input placeholder="Titolo" value={newArticle.title} onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })} />
        <Label className="text-xs">Contenuto</Label>
        <RichTextEditor content={newArticle.content} onChange={(html) => setNewArticle({ ...newArticle, content: html })} />
        <Input placeholder="Categoria (es: articolo, lettura, gioco)" value={newArticle.category} onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })} />
        <ImageUpload value={newArticle.image_url} onChange={(url) => setNewArticle({ ...newArticle, image_url: url })} />
        <Button onClick={addArticle} className="gradient-forest text-primary-foreground w-full">Pubblica</Button>
      </div>

      <div className="space-y-2">
        {articles.map((article) => (
          <div key={article.id} className="rounded-lg border border-border bg-card overflow-hidden">
            {editingId === article.id ? (
              <div className="p-3 space-y-2">
                <Input placeholder="Titolo" value={editData.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })} />
                <Label className="text-xs">Contenuto</Label>
                <RichTextEditor content={editData.content} onChange={(html) => setEditData({ ...editData, content: html })} />
                <Input placeholder="Categoria" value={editData.category} onChange={(e) => setEditData({ ...editData, category: e.target.value })} />
                <ImageUpload value={editData.image_url} onChange={(url) => setEditData({ ...editData, image_url: url })} />
                <div className="flex gap-2">
                  <Button size="sm" onClick={saveEdit} className="flex-1"><Check className="w-3 h-3 mr-1" />Salva</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingId(null)} className="flex-1"><X className="w-3 h-3 mr-1" />Annulla</Button>
                </div>
              </div>
            ) : (
              <>
                {article.image_url && <img src={article.image_url} alt={article.title} className="w-full h-24 object-cover" />}
                <div className="flex items-center justify-between p-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{article.title}</p>
                    <p className="text-xs text-muted-foreground">{article.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={article.published !== false} onCheckedChange={() => togglePublished(article.id, article.published !== false)} />
                    <button onClick={() => startEdit(article)} className="text-muted-foreground p-1 hover:text-foreground"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => deleteArticle(article.id)} className="text-destructive p-1"><Trash2 className="w-4 h-4" /></button>
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

export default AdminArticlesTab;
