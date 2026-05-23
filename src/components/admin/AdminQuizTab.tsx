import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, X, Check, ChevronDown, ChevronRight } from "lucide-react";

const sb = supabase as any;

interface Category {
  id: string;
  title: string;
  description: string | null;
  icon: string;
  color: string;
  sort_order: number;
  published: boolean;
}
interface Question {
  id: string;
  category_id: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string | null;
  sort_order: number;
}

const emptyCat = { title: "", description: "", icon: "Brain", color: "gradient-forest", sort_order: 0 };
const emptyQ = { question: "", options: ["", "", "", ""], correct_index: 0, explanation: "", sort_order: 0 };

const AdminQuizTab = () => {
  const [cats, setCats] = useState<Category[]>([]);
  const [questions, setQuestions] = useState<Record<string, Question[]>>({});
  const [expanded, setExpanded] = useState<string | null>(null);
  const [newCat, setNewCat] = useState<any>({ ...emptyCat });
  const [editCatId, setEditCatId] = useState<string | null>(null);
  const [editCat, setEditCat] = useState<any>({});
  const [newQ, setNewQ] = useState<any>({ ...emptyQ });
  const [editQId, setEditQId] = useState<string | null>(null);
  const [editQ, setEditQ] = useState<any>({});

  const load = async () => {
    const { data: c } = await sb.from("quiz_categories").select("*").order("sort_order");
    setCats(c || []);
    const { data: q } = await sb.from("quiz_questions").select("*").order("sort_order");
    const grouped: Record<string, Question[]> = {};
    (q || []).forEach((x: Question) => {
      (grouped[x.category_id] ||= []).push(x);
    });
    setQuestions(grouped);
  };

  useEffect(() => { load(); }, []);

  const addCat = async () => {
    if (!newCat.title) return toast.error("Titolo richiesto");
    const { error } = await sb.from("quiz_categories").insert([newCat]);
    if (error) return toast.error(error.message);
    setNewCat({ ...emptyCat });
    toast.success("Categoria creata");
    load();
  };
  const saveCat = async () => {
    const { error } = await sb.from("quiz_categories").update(editCat).eq("id", editCatId);
    if (error) return toast.error(error.message);
    setEditCatId(null); load(); toast.success("Salvato");
  };
  const deleteCat = async (id: string) => {
    if (!confirm("Eliminare categoria e tutte le sue domande?")) return;
    await sb.from("quiz_categories").delete().eq("id", id);
    load();
  };
  const togglePub = async (c: Category) => {
    await sb.from("quiz_categories").update({ published: !c.published }).eq("id", c.id);
    load();
  };

  const addQuestion = async (catId: string) => {
    if (!newQ.question) return toast.error("Domanda richiesta");
    const opts = newQ.options.filter((o: string) => o.trim());
    if (opts.length < 2) return toast.error("Almeno 2 opzioni");
    const { error } = await sb.from("quiz_questions").insert([{ ...newQ, options: opts, category_id: catId }]);
    if (error) return toast.error(error.message);
    setNewQ({ ...emptyQ });
    load();
  };
  const saveQ = async () => {
    const opts = editQ.options.filter((o: string) => o.trim());
    const { error } = await sb.from("quiz_questions").update({ ...editQ, options: opts }).eq("id", editQId);
    if (error) return toast.error(error.message);
    setEditQId(null); load();
  };
  const delQ = async (id: string) => {
    await sb.from("quiz_questions").delete().eq("id", id);
    load();
  };

  const QForm = ({ data, setData }: any) => (
    <div className="space-y-2">
      <Textarea placeholder="Domanda" value={data.question} onChange={(e) => setData({ ...data, question: e.target.value })} />
      {data.options.map((opt: string, i: number) => (
        <div key={i} className="flex gap-2 items-center">
          <input type="radio" checked={data.correct_index === i} onChange={() => setData({ ...data, correct_index: i })} />
          <Input placeholder={`Opzione ${i + 1}`} value={opt} onChange={(e) => {
            const opts = [...data.options]; opts[i] = e.target.value; setData({ ...data, options: opts });
          }} />
        </div>
      ))}
      <div className="flex gap-2">
        <Button type="button" size="sm" variant="outline" onClick={() => setData({ ...data, options: [...data.options, ""] })}>+ Opzione</Button>
        {data.options.length > 2 && (
          <Button type="button" size="sm" variant="outline" onClick={() => setData({ ...data, options: data.options.slice(0, -1) })}>- Opzione</Button>
        )}
      </div>
      <Textarea placeholder="Spiegazione" value={data.explanation || ""} onChange={(e) => setData({ ...data, explanation: e.target.value })} />
      <Input type="number" placeholder="Ordine" value={data.sort_order} onChange={(e) => setData({ ...data, sort_order: parseInt(e.target.value) || 0 })} />
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-4 space-y-2">
        <h3 className="font-semibold flex items-center gap-2"><Plus className="w-4 h-4" /> Nuova categoria quiz</h3>
        <Input placeholder="Titolo" value={newCat.title} onChange={(e) => setNewCat({ ...newCat, title: e.target.value })} />
        <Input placeholder="Descrizione" value={newCat.description} onChange={(e) => setNewCat({ ...newCat, description: e.target.value })} />
        <div className="grid grid-cols-3 gap-2">
          <Input placeholder="Icona (Lucide)" value={newCat.icon} onChange={(e) => setNewCat({ ...newCat, icon: e.target.value })} />
          <Input placeholder="Colore (gradient-forest/amber)" value={newCat.color} onChange={(e) => setNewCat({ ...newCat, color: e.target.value })} />
          <Input type="number" placeholder="Ordine" value={newCat.sort_order} onChange={(e) => setNewCat({ ...newCat, sort_order: parseInt(e.target.value) || 0 })} />
        </div>
        <Button onClick={addCat} className="w-full gradient-forest text-primary-foreground">Crea categoria</Button>
      </div>

      <div className="space-y-2">
        {cats.map((c) => (
          <div key={c.id} className="rounded-lg border border-border bg-card">
            {editCatId === c.id ? (
              <div className="p-3 space-y-2">
                <Input value={editCat.title} onChange={(e) => setEditCat({ ...editCat, title: e.target.value })} />
                <Input value={editCat.description || ""} onChange={(e) => setEditCat({ ...editCat, description: e.target.value })} />
                <div className="grid grid-cols-3 gap-2">
                  <Input value={editCat.icon} onChange={(e) => setEditCat({ ...editCat, icon: e.target.value })} />
                  <Input value={editCat.color} onChange={(e) => setEditCat({ ...editCat, color: e.target.value })} />
                  <Input type="number" value={editCat.sort_order} onChange={(e) => setEditCat({ ...editCat, sort_order: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={saveCat} className="flex-1"><Check className="w-3 h-3 mr-1" />Salva</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditCatId(null)} className="flex-1"><X className="w-3 h-3 mr-1" />Annulla</Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3">
                <button onClick={() => setExpanded(expanded === c.id ? null : c.id)} className="flex items-center gap-2 flex-1 text-left">
                  {expanded === c.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  <div>
                    <p className="font-medium text-sm">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{(questions[c.id] || []).length} domande</p>
                  </div>
                </button>
                <div className="flex items-center gap-2">
                  <Switch checked={c.published} onCheckedChange={() => togglePub(c)} />
                  <button onClick={() => { setEditCatId(c.id); setEditCat(c); }} className="p-1"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => deleteCat(c.id)} className="p-1 text-destructive"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            )}

            {expanded === c.id && (
              <div className="border-t border-border p-3 space-y-3 bg-muted/30">
                {(questions[c.id] || []).map((q) => (
                  <div key={q.id} className="rounded-lg border border-border bg-card p-3">
                    {editQId === q.id ? (
                      <>
                        <QForm data={editQ} setData={setEditQ} />
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" onClick={saveQ} className="flex-1"><Check className="w-3 h-3 mr-1" />Salva</Button>
                          <Button size="sm" variant="outline" onClick={() => setEditQId(null)} className="flex-1"><X className="w-3 h-3 mr-1" />Annulla</Button>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{q.question}</p>
                          <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
                            {q.options.map((o, i) => (
                              <li key={i} className={i === q.correct_index ? "text-primary font-medium" : ""}>
                                {String.fromCharCode(65 + i)}. {o}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex flex-col gap-1">
                          <button onClick={() => { setEditQId(q.id); setEditQ({ ...q, options: [...q.options] }); }} className="p-1"><Pencil className="w-3.5 h-3.5" /></button>
                          <button onClick={() => delQ(q.id)} className="p-1 text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div className="rounded-lg border border-dashed border-border p-3 bg-background">
                  <p className="text-xs font-semibold mb-2">+ Nuova domanda</p>
                  <QForm data={newQ} setData={setNewQ} />
                  <Button size="sm" onClick={() => addQuestion(c.id)} className="w-full mt-2">Aggiungi domanda</Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminQuizTab;
