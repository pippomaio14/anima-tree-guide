import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/PageHeader";
import MobileLayout from "@/components/MobileLayout";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, XCircle, Trophy, RotateCcw, Lightbulb } from "lucide-react";

const sb = supabase as any;

interface Item {
  id: string;
  species_name: string;
  scientific_name: string | null;
  image_url: string;
  hint: string | null;
}

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

const TreeGuessPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [done, setDone] = useState(false);

  const load = async () => {
    const { data } = await sb.from("tree_guess_items").select("*").eq("published", true).order("sort_order");
    setItems(shuffle((data || []) as Item[]));
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const current = items[round];
  const options = current
    ? shuffle([current, ...shuffle(items.filter((i) => i.id !== current.id)).slice(0, 3)])
    : [];
  const [opts, setOpts] = useState<Item[]>([]);
  useEffect(() => {
    if (current) setOpts(shuffle([current, ...shuffle(items.filter((i) => i.id !== current.id)).slice(0, 3)]));
    setSelected(null); setShowHint(false);
  }, [round, items.length]);

  const answer = (id: string) => {
    if (selected) return;
    setSelected(id);
    if (id === current.id) setScore((s) => s + 1);
  };
  const next = () => {
    if (round + 1 >= Math.min(items.length, 10)) setDone(true);
    else setRound((r) => r + 1);
  };
  const restart = () => { setRound(0); setScore(0); setDone(false); setItems(shuffle(items)); };

  if (loading) {
    return <MobileLayout><PageHeader title="Indovina l'Albero" showBack /><div className="p-4 text-sm text-muted-foreground">Caricamento…</div></MobileLayout>;
  }

  if (items.length < 4) {
    return (
      <MobileLayout>
        <PageHeader title="Indovina l'Albero" showBack />
        <div className="p-6 text-center space-y-3">
          <p className="text-sm text-muted-foreground">Servono almeno 4 piante pubblicate per giocare.</p>
          <Button variant="outline" onClick={() => navigate("/games")}>Torna ai giochi</Button>
        </div>
      </MobileLayout>
    );
  }

  if (done) {
    return (
      <MobileLayout>
        <PageHeader title="Risultato" showBack />
        <div className="p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl border border-border bg-card p-6 text-center space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full gradient-amber flex items-center justify-center">
              <Trophy className="w-10 h-10 text-primary-foreground" />
            </div>
            <h2 className="text-3xl font-bold">{score} / {Math.min(items.length, 10)}</h2>
            <p className="text-sm text-muted-foreground">Hai riconosciuto {score} piante!</p>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={restart}><RotateCcw className="w-4 h-4 mr-1" />Rigioca</Button>
              <Button className="flex-1" onClick={() => navigate("/games")}>Altri giochi</Button>
            </div>
          </motion.div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <PageHeader title="Indovina l'Albero" showBack />
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between text-xs">
          <Button variant="ghost" size="sm" onClick={() => navigate("/games")}><ArrowLeft className="w-4 h-4 mr-1" />Giochi</Button>
          <span className="text-muted-foreground">{round + 1} / {Math.min(items.length, 10)}</span>
          <span className="font-medium text-primary">Punti: {score}</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={current?.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="space-y-3">
            <div className="rounded-xl overflow-hidden border border-border bg-card">
              <img src={current.image_url} alt="Pianta" className="w-full h-64 object-cover" />
            </div>

            {current.hint && (
              <div>
                {!showHint ? (
                  <Button variant="outline" size="sm" className="w-full" onClick={() => setShowHint(true)}>
                    <Lightbulb className="w-4 h-4 mr-1" /> Mostra suggerimento
                  </Button>
                ) : (
                  <div className="rounded-lg bg-muted p-3 text-sm">💡 {current.hint}</div>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              {opts.map((o) => {
                const isCorrect = selected && o.id === current.id;
                const isWrong = selected === o.id && o.id !== current.id;
                let cls = "border-border bg-card hover:border-primary";
                if (isCorrect) cls = "border-primary bg-primary/10";
                else if (isWrong) cls = "border-destructive bg-destructive/10";
                else if (selected) cls = "border-border bg-card opacity-60";
                return (
                  <button key={o.id} disabled={!!selected} onClick={() => answer(o.id)}
                    className={`p-3 rounded-lg border text-sm text-left transition-colors flex items-center justify-between gap-2 ${cls}`}>
                    <div>
                      <p className="font-medium">{o.species_name}</p>
                      {o.scientific_name && <p className="text-xs italic text-muted-foreground">{o.scientific_name}</p>}
                    </div>
                    {isCorrect && <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />}
                    {isWrong && <XCircle className="w-4 h-4 text-destructive flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            {selected && (
              <Button className="w-full" onClick={next}>
                {round + 1 >= Math.min(items.length, 10) ? "Vedi risultati" : "Prossima"}
              </Button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </MobileLayout>
  );
};

export default TreeGuessPage;
