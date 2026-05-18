import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import MobileLayout from "@/components/MobileLayout";
import { Leaf, Flower2, Apple, Sprout, ArrowLeft, RotateCcw, CheckCircle2, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { leafKey, startNodeId as leafStart } from "@/lib/leafKey";
import { flowerKey, flowerStartNodeId } from "@/lib/flowerKey";

type KeyMode = "leaf" | "flower";

const keyConfig: Record<KeyMode, {
  title: string;
  data: Record<string, any>;
  start: string;
  resultLabel: string;
}> = {
  leaf: { title: "Chiave delle foglie", data: leafKey, start: leafStart, resultLabel: "Probabile specie" },
  flower: { title: "Chiave dei fiori", data: flowerKey, start: flowerStartNodeId, resultLabel: "Probabile pianta" },
};

const categories = [
  { key: "leaf" as const, icon: Leaf, label: "Foglia", desc: "Identifica dalla forma della foglia", color: "gradient-forest", enabled: true },
  { key: "flower" as const, icon: Flower2, label: "Fiore", desc: "Riconosci dal tipo di fiore", color: "gradient-amber", enabled: true },
  { key: "fruit", icon: Apple, label: "Frutto", desc: "Classifica dal frutto", color: "gradient-forest", enabled: false },
  { key: "bud", icon: Sprout, label: "Gemma", desc: "Osserva le gemme", color: "gradient-amber", enabled: false },
];

const ClassifyPage = () => {
  const [mode, setMode] = useState<"menu" | KeyMode>("menu");
  const [nodeId, setNodeId] = useState<string>("start");
  const [history, setHistory] = useState<string[]>([]);

  const active = mode !== "menu" ? keyConfig[mode] : null;
  const node = active ? active.data[nodeId] : undefined;

  const goTo = (next: string) => {
    setHistory((h) => [...h, nodeId]);
    setNodeId(next);
  };

  const goBack = () => {
    setHistory((h) => {
      if (h.length === 0) return h;
      const prev = h[h.length - 1];
      setNodeId(prev);
      return h.slice(0, -1);
    });
  };

  const restart = () => {
    if (active) setNodeId(active.start);
    setHistory([]);
  };

  const startKey = (m: KeyMode) => {
    setMode(m);
    setNodeId(keyConfig[m].start);
    setHistory([]);
  };

  const exitToMenu = () => {
    setMode("menu");
    setHistory([]);
  };

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
                  onClick={() => {
                    if (!cat.enabled) return;
                    if (cat.key === "leaf" || cat.key === "flower") startKey(cat.key);
                  }}
                  disabled={!cat.enabled}
                  className="relative flex flex-col items-center p-6 rounded-xl border border-border bg-card hover:shadow-forest transition-shadow disabled:opacity-60"
                >
                  <div className={`w-14 h-14 rounded-2xl ${cat.color} flex items-center justify-center mb-3`}>
                    <cat.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <span className="font-medium text-foreground">{cat.label}</span>
                  <span className="text-xs text-muted-foreground mt-1 text-center">{cat.desc}</span>
                  {!cat.enabled && (
                    <span className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      presto
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
            <div className="rounded-xl bg-muted p-4 text-center">
              <p className="text-sm text-muted-foreground">
                🌿 Scegli <strong>Foglia</strong> o <strong>Fiore</strong> e rispondi a poche domande per scoprire la pianta.
              </p>
            </div>
          </>
        )}

        {active && node && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={exitToMenu}>
                <ArrowLeft className="w-4 h-4 mr-1" /> Categorie
              </Button>
              <span className="text-xs text-muted-foreground">{active.title}</span>
              <Button variant="outline" size="sm" onClick={restart}>
                <RotateCcw className="w-4 h-4 mr-1" /> Ricomincia
              </Button>
            </div>

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
                        {node.hint && (
                          <p className="text-xs text-muted-foreground mt-1">{node.hint}</p>
                        )}
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
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">{active.resultLabel}</p>
                      <h2 className="text-2xl font-bold text-foreground mt-1">{node.species}</h2>
                      <p className="text-sm italic text-muted-foreground">{node.scientificName}</p>
                    </div>
                    <p className="text-sm text-foreground/90">{node.description}</p>
                    <ul className="text-left text-sm text-muted-foreground space-y-1 bg-muted/50 rounded-lg p-3">
                      {node.characteristics.map((c: string) => (
                        <li key={c} className="flex items-start gap-2">
                          {mode === "flower" ? (
                            <Flower2 className="w-3.5 h-3.5 text-primary mt-1 flex-shrink-0" />
                          ) : (
                            <Leaf className="w-3.5 h-3.5 text-primary mt-1 flex-shrink-0" />
                          )}
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
