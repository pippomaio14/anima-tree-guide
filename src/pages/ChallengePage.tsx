import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/PageHeader";
import MobileLayout from "@/components/MobileLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import {
  TreePine, Trophy, CheckCircle2, Circle, ChevronLeft, RotateCcw, Lightbulb,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const sb = supabase as any;

interface Mission {
  id: string;
  title: string;
  description: string | null;
  objective: string | null;
  points: number;
  difficulty: string;
  icon: string;
  tips: string[];
}

const difficultyColors: Record<string, string> = {
  facile: "bg-primary/15 text-primary",
  media: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  difficile: "bg-destructive/15 text-destructive",
};

const ChallengePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const storageKey = `forest-challenge-${user?.id || "guest"}`;

  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [active, setActive] = useState<Mission | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await sb.from("missions").select("*").eq("published", true).order("sort_order");
      setMissions((data || []) as Mission[]);
      setLoading(false);
    })();
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setCompleted(JSON.parse(raw));
    } catch {}
  }, [storageKey]);

  const persist = (next: Record<string, boolean>) => {
    setCompleted(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch {}
  };
  const toggle = (id: string) => persist({ ...completed, [id]: !completed[id] });
  const reset = () => { if (confirm("Vuoi davvero azzerare i progressi?")) persist({}); };

  const renderIcon = (name: string, className = "w-6 h-6") => {
    const Icon = (Icons as any)[name] || TreePine;
    return <Icon className={className} />;
  };

  const totalPoints = missions.reduce((s, m) => s + m.points, 0);
  const earnedPoints = missions.reduce((s, m) => s + (completed[m.id] ? m.points : 0), 0);
  const doneCount = missions.filter((m) => completed[m.id]).length;
  const progress = totalPoints ? Math.round((earnedPoints / totalPoints) * 100) : 0;

  if (loading) {
    return <MobileLayout><PageHeader title="Sfida del Bosco" showBack /><div className="p-4 text-sm text-muted-foreground">Caricamento…</div></MobileLayout>;
  }

  if (active) {
    const isDone = !!completed[active.id];
    return (
      <MobileLayout>
        <PageHeader title="Missione" showBack />
        <div className="p-4 space-y-4">
          <button onClick={() => setActive(null)} className="flex items-center gap-1 text-sm text-muted-foreground">
            <ChevronLeft className="w-4 h-4" /> Tutte le missioni
          </button>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="gradient-forest p-6 text-primary-foreground">
              <div className="w-14 h-14 rounded-xl bg-primary-foreground/15 flex items-center justify-center mb-3">
                {renderIcon(active.icon, "w-7 h-7")}
              </div>
              <h2 className="text-xl font-semibold">{active.title}</h2>
              <p className="text-sm opacity-90 mt-1">{active.description}</p>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary-foreground/20">{active.difficulty}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary-foreground/20">{active.points} punti</span>
              </div>
            </div>
            <div className="p-5 space-y-4">
              {active.objective && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Obiettivo</p>
                  <p className="text-sm text-foreground">{active.objective}</p>
                </div>
              )}
              {active.tips?.length > 0 && (
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1"><Lightbulb className="w-3 h-3" /> Consigli</p>
                  <ul className="space-y-1">
                    {active.tips.map((t, i) => (
                      <li key={i} className="text-sm text-foreground flex gap-2"><span className="text-primary">•</span><span>{t}</span></li>
                    ))}
                  </ul>
                </div>
              )}
              <Button onClick={() => toggle(active.id)} className={`w-full ${isDone ? "" : "gradient-forest text-primary-foreground"}`} variant={isDone ? "outline" : "default"}>
                {isDone ? <><RotateCcw className="w-4 h-4 mr-2" /> Segna come da rifare</> : <><CheckCircle2 className="w-4 h-4 mr-2" /> Missione completata!</>}
              </Button>
            </div>
          </motion.div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <PageHeader title="Sfida del Bosco" showBack />
      <div className="p-4 space-y-4">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl gradient-forest p-5 text-primary-foreground shadow-forest">
          <div className="flex items-center gap-3 mb-3">
            <Trophy className="w-8 h-8" />
            <div>
              <h2 className="text-lg font-semibold">I tuoi progressi</h2>
              <p className="text-xs opacity-90">{doneCount} di {missions.length} missioni · {earnedPoints}/{totalPoints} punti</p>
            </div>
          </div>
          <Progress value={progress} className="h-2 bg-primary-foreground/20" />
          {progress === 100 && missions.length > 0 && (
            <p className="text-sm mt-3 font-medium">🏆 Esploratore Leggendario!</p>
          )}
        </motion.div>

        <div className="space-y-3">
          <AnimatePresence>
            {missions.map((m, i) => {
              const done = !!completed[m.id];
              return (
                <motion.button key={m.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  onClick={() => setActive(m)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${done ? "border-primary/50 bg-primary/5" : "border-border bg-card hover:shadow-forest"}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${done ? "bg-primary text-primary-foreground" : "gradient-forest text-primary-foreground"}`}>
                    {renderIcon(m.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`font-medium ${done ? "text-foreground line-through opacity-70" : "text-foreground"}`}>{m.title}</h3>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${difficultyColors[m.difficulty] || difficultyColors.facile}`}>{m.difficulty}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{m.description}</p>
                    <p className="text-[11px] text-primary mt-1 font-medium">{m.points} punti</p>
                  </div>
                  {done ? <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" /> : <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {doneCount > 0 && (
          <Button onClick={reset} variant="outline" className="w-full">
            <RotateCcw className="w-4 h-4 mr-2" /> Azzera progressi
          </Button>
        )}
      </div>
    </MobileLayout>
  );
};

export default ChallengePage;
