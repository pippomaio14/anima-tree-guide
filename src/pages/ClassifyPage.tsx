import { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import MobileLayout from "@/components/MobileLayout";
import { Leaf, Flower2, Apple, Sprout, ArrowLeft, RotateCcw, CheckCircle2, HelpCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const sb = supabase as any;

type KeyMode = "leaf" | "flower" | "bud" | "fruit";

type Node =
  | {
      id: string;
      type: "question";
      question: string;
      hint?: string;
      optionA: { label: string; next: string };
      optionB: { label: string; next: string };
    }
  | {
      id: string;
      type: "result";
      species: string;
      scientificName: string;
      description: string;
      characteristics: string[];
    };

const keyTitles: Record<KeyMode, string> = {
  leaf: "Chiave delle foglie",
  flower: "Chiave dei fiori",
  bud: "Chiave delle gemme",
  fruit: "Chiave dei frutti",
};

const categories = [
  { key: "leaf" as const, icon: Leaf, label: "Foglia", desc: "Identifica dalla forma della foglia", color: "gradient-forest" },
  { key: "flower" as const, icon: Flower2, label: "Fiore", desc: "Riconosci dal tipo di fiore", color: "gradient-amber" },
  { key: "fruit" as const, icon: Apple, label: "Frutto", desc: "Classifica dal frutto", color: "gradient-forest" },
  { key: "bud" as const, icon: Sprout, label: "Gemma", desc: "Osserva le gemme invernali", color: "gradient-amber" },
];

const ClassifyPage = () => {
  const [mode, setMode] = useState<"menu" | KeyMode>("menu");
  const [nodes, setNodes] = useState<Record<string, Node>>({});
  const [loading, setLoading] = useState(false);
  const [nodeId, setNodeId] = useState<string>("start");
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    if (mode === "menu") return;
    setLoading(true);
    sb.from("dichotomous_key_nodes")
      .select("*")
      .eq("key_type", mode)
      .then(({ data }: any) => {
        const map: Record<string, Node> = {};
        (data || []).forEach((r: any) => {
          if (r.node_type === "question") {
            map[r.node_id] = {
              id: r.node_id,
              type: "question",
              question: r.question || "",
              hint: r.hint || undefined,
              optionA: { label: r.option_a_label || "", next: r.option_a_next || "" },
              optionB: { label: r.option_b_label || "", next: r.option_b_next || "" },
            };
          } else {
            map[r.node_id] = {
              id: r.node_id,
              type: "result",
              species: r.species || "",
              scientificName: r.scientific_name || "",
              description: r.description || "",
              characteristics: r.characteristics || [],
            };
          }
        });
        setNodes(map);
        setNodeId("start");
        setHistory([]);
        setLoading(false);
      });
  }, [mode]);

  const node = useMemo(() => nodes[nodeId], [nodes, nodeId]);

  const goTo = (next: string) => {
    if (!nodes[next]) return;
    setHistory((h) => [...h, nodeId]);
    setNodeId(next);
  };
  const goBack = () => {
    setHistory((h) => {
      if (h.length === 0) return h;
      setNodeId(h[h.length - 1]);
      return h.slice(0, -1);
    });
  };
  const restart = () => { setNodeId("start"); setHistory([]); };
  const exitToMenu = () => { setMode("menu"); setHistory([]); };

  return (
    <MobileLayout>
      <PageHeader title="Classifica una Pianta" showBack />
      <div className="p-4 space-y-4">
        {mode === "menu" && (
          <>
            <p className="text-sm text-muted-foreground">
              Seleziona una categoria per iniziare a identificare le piante del bosco.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat, i) => (
                <motion.button
                  key={cat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setMode(cat.key)}
                  className="relative flex flex-col items-center p-6 rounded-xl border border-border bg-card hover:shadow-forest transition-shadow"
                >
                  <div className={`w-14 h-14 rounded-2xl ${cat.color} flex items-center justify-center mb-3`}>
                    <cat.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <span className="font-medium text-foreground">{cat.label}</span>
                  <span className="text-xs text-muted-foreground mt-1 text-center">{cat.desc}</span>
                </motion.button>
              ))}
            </div>
          </>
        )}

        {mode !== "menu" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={exitToMenu}>
                <ArrowLeft className="w-4 h-4 mr-1" /> Categorie
              </Button>
              <span className="text-xs text-muted-foreground">{keyTitles[mode]}</span>
              <Button variant="outline" size="sm" onClick={restart}>
                <RotateCcw className="w-4 h-4 mr-1" /> Ricomincia
              </Button>
            </div>

            {loading && (
              <div className="flex justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            )}

            {!loading && !node && (
              <div className="rounded-xl border border-border bg-card p-5 text-center text-sm text-muted-foreground">
                Nessun nodo disponibile per questa chiave. Configurala dal pannello amministrazione.
              </div>
            )}

            {!loading && node && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-xl border border-border bg-card p-5 shadow-sm"
                >
                  {node.type === "question" ? (
                    <>
                      <div className="flex items-start gap-2 mb-4">
                        <HelpCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-foreground leading-snug">{node.question}</h3>
                          {node.hint && <p className="text-xs text-muted-foreground mt-1">{node.hint}</p>}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <button
                          onClick={() => goTo(node.optionA.next)}
                          className="w-full text-left p-4 rounded-lg border border-border bg-background hover:border-primary hover:bg-accent transition-colors"
                        >
                          <span className="text-xs font-semibold text-primary mr-2">A</span>
                          <span className="text-sm text-foreground">{node.optionA.label}</span>
                        </button>
                        <button
                          onClick={() => goTo(node.optionB.next)}
                          className="w-full text-left p-4 rounded-lg border border-border bg-background hover:border-primary hover:bg-accent transition-colors"
                        >
                          <span className="text-xs font-semibold text-primary mr-2">B</span>
                          <span className="text-sm text-foreground">{node.optionB.label}</span>
                        </button>
                      </div>
                      {history.length > 0 && (
                        <Button variant="ghost" size="sm" className="mt-4" onClick={goBack}>
                          <ArrowLeft className="w-4 h-4 mr-1" /> Indietro
                        </Button>
                      )}
                    </>
                  ) : (
                    <div className="space-y-3 text-center">
                      <div className="w-16 h-16 mx-auto rounded-full gradient-forest flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Probabile pianta</p>
                        <h2 className="text-2xl font-bold text-foreground mt-1">{node.species}</h2>
                        <p className="text-sm italic text-muted-foreground">{node.scientificName}</p>
                      </div>
                      <p className="text-sm text-foreground/90">{node.description}</p>
                      <ul className="text-left text-sm text-muted-foreground space-y-1 bg-muted/50 rounded-lg p-3">
                        {node.characteristics.map((c: string) => (
                          <li key={c} className="flex items-start gap-2">
                            <Leaf className="w-3.5 h-3.5 text-primary mt-1 flex-shrink-0" />
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" className="flex-1" onClick={goBack} disabled={history.length === 0}>
                          <ArrowLeft className="w-4 h-4 mr-1" /> Indietro
                        </Button>
                        <Button className="flex-1" onClick={restart}>
                          <RotateCcw className="w-4 h-4 mr-1" /> Nuova identificazione
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}

            <p className="text-xs text-center text-muted-foreground">
              Chiave dicotomica semplificata — l'identificazione è indicativa.
            </p>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default ClassifyPage;
