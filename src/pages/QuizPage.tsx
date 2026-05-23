import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/PageHeader";
import MobileLayout from "@/components/MobileLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import {
  ArrowLeft, RotateCcw, CheckCircle2, XCircle, Trophy, Brain,
} from "lucide-react";

const sb = supabase as any;

type Question = {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string | null;
};
type Category = {
  id: string;
  title: string;
  description: string | null;
  icon: string;
  color: string;
  questions: Question[];
};

type Phase = "menu" | "playing" | "result";

const QuizPage = () => {
  const navigate = useNavigate();
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<Phase>("menu");
  const [category, setCategory] = useState<Category | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    (async () => {
      const { data: c } = await sb.from("quiz_categories").select("*").eq("published", true).order("sort_order");
      const { data: q } = await sb.from("quiz_questions").select("*").order("sort_order");
      const grouped: Category[] = (c || []).map((cat: any) => ({
        ...cat,
        questions: (q || []).filter((qq: any) => qq.category_id === cat.id),
      })).filter((cat: Category) => cat.questions.length > 0);
      setCats(grouped);
      setLoading(false);
    })();
  }, []);

  const startQuiz = (cat: Category) => {
    setCategory(cat); setQIndex(0); setSelected(null); setAnswered(false); setScore(0); setPhase("playing");
  };
  const handleAnswer = (i: number) => {
    if (answered || !category) return;
    setSelected(i); setAnswered(true);
    if (i === category.questions[qIndex].correct_index) setScore((s) => s + 1);
  };
  const nextQuestion = () => {
    if (!category) return;
    if (qIndex + 1 >= category.questions.length) setPhase("result");
    else { setQIndex((q) => q + 1); setSelected(null); setAnswered(false); }
  };
  const backToMenu = () => { setPhase("menu"); setCategory(null); };

  const getRating = (s: number, t: number) => {
    const pct = (s / t) * 100;
    if (pct === 100) return { label: "Esperto naturalista! 🌳", color: "text-primary" };
    if (pct >= 80) return { label: "Ottime conoscenze! 🌿", color: "text-primary" };
    if (pct >= 60) return { label: "Buone basi, continua così 🌱", color: "text-foreground" };
    if (pct >= 40) return { label: "Puoi migliorare 📚", color: "text-foreground" };
    return { label: "Da approfondire 🌰", color: "text-muted-foreground" };
  };

  const renderIcon = (name: string) => {
    const Icon = (Icons as any)[name] || Brain;
    return <Icon className="w-6 h-6 text-primary-foreground" />;
  };

  return (
    <MobileLayout>
      <PageHeader title="Quiz sulla Natura" showBack />
      <div className="p-4 space-y-4">
        {loading && <p className="text-sm text-muted-foreground">Caricamento…</p>}

        {!loading && phase === "menu" && (
          <>
            <p className="text-sm text-muted-foreground">Metti alla prova le tue conoscenze sull'ambiente. Scegli un tema!</p>
            {cats.length === 0 && <p className="text-sm text-muted-foreground">Nessun quiz disponibile.</p>}
            <div className="grid grid-cols-1 gap-3">
              {cats.map((cat, i) => (
                <motion.button key={cat.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  onClick={() => startQuiz(cat)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:shadow-forest transition-shadow text-left">
                  <div className={`w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center flex-shrink-0`}>
                    {renderIcon(cat.icon)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{cat.title}</h3>
                    <p className="text-xs text-muted-foreground">{cat.description}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">{cat.questions.length} domande</p>
                  </div>
                </motion.button>
              ))}
            </div>
            <Button variant="outline" className="w-full" onClick={() => navigate("/games")}><ArrowLeft className="w-4 h-4 mr-1" /> Torna ai giochi</Button>
          </>
        )}

        {phase === "playing" && category && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={backToMenu}><ArrowLeft className="w-4 h-4 mr-1" /> Temi</Button>
              <span className="text-xs text-muted-foreground">{qIndex + 1} / {category.questions.length}</span>
              <span className="text-xs font-medium text-primary">Punti: {score}</span>
            </div>
            <Progress value={(qIndex / category.questions.length) * 100} />

            <AnimatePresence mode="wait">
              <motion.div key={qIndex} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
                <h3 className="font-semibold text-foreground leading-snug">{category.questions[qIndex].question}</h3>
                <div className="space-y-2">
                  {category.questions[qIndex].options.map((opt, i) => {
                    const isCorrect = i === category.questions[qIndex].correct_index;
                    const isSelected = selected === i;
                    let cls = "border-border bg-background hover:border-primary hover:bg-accent";
                    if (answered) {
                      if (isCorrect) cls = "border-primary bg-primary/10";
                      else if (isSelected) cls = "border-destructive bg-destructive/10";
                      else cls = "border-border bg-background opacity-70";
                    }
                    return (
                      <button key={i} onClick={() => handleAnswer(i)} disabled={answered}
                        className={`w-full text-left p-3 rounded-lg border transition-colors flex items-start gap-2 ${cls}`}>
                        <span className="text-xs font-semibold text-primary mt-0.5">{String.fromCharCode(65 + i)}</span>
                        <span className="text-sm text-foreground flex-1">{opt}</span>
                        {answered && isCorrect && <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />}
                        {answered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-destructive flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
                {answered && category.questions[qIndex].explanation && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg bg-muted p-3 text-sm text-foreground/90">
                    💡 {category.questions[qIndex].explanation}
                  </motion.div>
                )}
                {answered && (
                  <Button className="w-full" onClick={nextQuestion}>
                    {qIndex + 1 >= category.questions.length ? "Vedi risultati" : "Prossima domanda"}
                  </Button>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {phase === "result" && category && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl border border-border bg-card p-6 text-center space-y-4 shadow-sm">
            <div className="w-20 h-20 mx-auto rounded-full gradient-amber flex items-center justify-center">
              <Trophy className="w-10 h-10 text-primary-foreground" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Risultato</p>
              <h2 className="text-3xl font-bold text-foreground mt-1">{score} / {category.questions.length}</h2>
              <p className={`text-sm mt-2 font-medium ${getRating(score, category.questions.length).color}`}>
                {getRating(score, category.questions.length).label}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">Tema: <strong className="text-foreground">{category.title}</strong></p>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => startQuiz(category)}><RotateCcw className="w-4 h-4 mr-1" /> Rigioca</Button>
              <Button className="flex-1" onClick={backToMenu}>Altri temi</Button>
            </div>
          </motion.div>
        )}
      </div>
    </MobileLayout>
  );
};

export default QuizPage;
