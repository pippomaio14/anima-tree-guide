import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, X, Check } from "lucide-react";

interface AdminArticlesTabProps {
  articles: any[];
  onReload: () => void;
}

const AdminArticlesTab = ({ articles, onReload }: AdminArticlesTabProps) => {
  const [newArticle, setNewArticle] = useState({ title: "", content: "", category: "article" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});

  const addArticle = async () => {
    if (!newArticle.title) { toast.error("Il titolo è obbligatorio"); return; }
    const { error } = await supabase.from("articles").insert([newArticle]);
    if (error) toast.error(error.message);
    else { toast.success("Articolo pubblicato!"); setNewArticle({ title: "", content: "", category: "article" }); onReload(); }
  };

  const deleteArticle = async (id: string) => {
    await supabase.from("articles").delete().eq("id", id);
    toast.success("Articolo eliminato");
    onReload();
  };

  const startEdit = (article: any) => {
    setEditingId(article.id);
    setEditData({ title: article.title, content: article.content || "", category: article.category || "article" });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const { error } = await supabase.from("articles").update(editData).eq("id", editingId);
    if (error) toast.error(error.message);
    else { toast.success("Articolo aggiornato!"); setEditingId(null); onReload(); }
  };

  const togglePublished = async (id: string, current: boolean) => {
    const { error } = await supabase.from("articles").update({ published: !current }).eq("id", id);
    if (error) toast.error(error.message);
    else onReload();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <h3 className="font-semibold flex items-center gap-2"><Plus className="w-4 h-4" /> Nuovo Articolo</h3>
        <Input placeholder="Titolo" value={newArticle.title} onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })} />
        <Textarea placeholder="Contenuto" rows={5} value={newArticle.content} onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })} />
        <Input placeholder="Categoria (es: articolo, lettura, gioco)" value={newArticle.category} onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })} />
        <Button onClick={addArticle} className="gradient-forest text-primary-foreground w-full">Pubblica</Button>
      </div>

      <div className="space-y-2">
        {articles.map((article) => (
          <div key={article.id} className="rounded-lg border border-border bg-card p-3 space-y-2">
            {editingId === article.id ? (
              <>
                <Input placeholder="Titolo" value={editData.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })} />
                <Textarea placeholder="Contenuto" rows={4} value={editData.content} onChange={(e) => setEditData({ ...editData, content: e.target.value })} />
                <Input placeholder="Categoria" value={editData.category} onChange={(e) => setEditData({ ...editData, category: e.target.value })} />
                <div className="flex gap-2">
                  <Button size="sm" onClick={saveEdit} className="flex-1"><Check className="w-3 h-3 mr-1" />Salva</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingId(null)} className="flex-1"><X className="w-3 h-3 mr-1" />Annulla</Button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between">
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminArticlesTab;
