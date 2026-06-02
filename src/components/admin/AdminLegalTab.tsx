import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save } from "lucide-react";
import RichTextEditor from "@/components/RichTextEditor";

interface LegalPage {
  id: string;
  slug: string;
  title: string;
  content: string;
}

const AdminLegalTab = () => {
  const [pages, setPages] = useState<LegalPage[]>([]);
  const [edits, setEdits] = useState<Record<string, { title: string; content: string }>>({});

  const load = async () => {
    const { data } = await supabase.from("legal_pages").select("*").order("slug");
    setPages(data || []);
    const e: Record<string, { title: string; content: string }> = {};
    (data || []).forEach((p) => { e[p.id] = { title: p.title, content: p.content }; });
    setEdits(e);
  };

  useEffect(() => { load(); }, []);

  const save = async (id: string) => {
    const { error } = await supabase
      .from("legal_pages")
      .update({ title: edits[id].title, content: edits[id].content })
      .eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Pagina aggiornata"); load(); }
  };

  return (
    <div className="space-y-6">
      {pages.map((p) => (
        <div key={p.id} className="rounded-lg border border-border p-4 space-y-3 bg-card">
          <div className="text-xs text-muted-foreground">Slug: <code>{p.slug}</code> — URL: <code>/legal/{p.slug}</code></div>
          <div className="space-y-2">
            <Label>Titolo</Label>
            <Input
              value={edits[p.id]?.title || ""}
              onChange={(e) => setEdits({ ...edits, [p.id]: { ...edits[p.id], title: e.target.value } })}
            />
          </div>
          <div className="space-y-2">
            <Label>Contenuto</Label>
            <RichTextEditor
              content={edits[p.id]?.content || ""}
              onChange={(html) => setEdits({ ...edits, [p.id]: { ...edits[p.id], content: html } })}
            />
          </div>
          <Button onClick={() => save(p.id)} size="sm">
            <Save className="w-4 h-4 mr-1" /> Salva
          </Button>
        </div>
      ))}
      {pages.length === 0 && <p className="text-muted-foreground text-sm">Nessuna pagina legale trovata.</p>}
    </div>
  );
};

export default AdminLegalTab;
