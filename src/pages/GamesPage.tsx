import PageHeader from "@/components/PageHeader";
import MobileLayout from "@/components/MobileLayout";
import { Gamepad2, Brain, Puzzle, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const games = [
  { icon: Brain, label: "Quiz sulla Natura", desc: "Metti alla prova le tue conoscenze", color: "gradient-forest", path: "/games/quiz", enabled: true },
  { icon: Puzzle, label: "Indovina l'Albero", desc: "Riconosci le specie del bosco", color: "gradient-amber", path: "", enabled: false },
  { icon: Trophy, label: "Sfida del Bosco", desc: "Completa le missioni nel parco", color: "gradient-forest", path: "", enabled: false },
];

const GamesPage = () => {
  const navigate = useNavigate();
  return (
    <MobileLayout>
      <PageHeader title="Giochi & Quiz" showBack />
      <div className="p-4 space-y-4">
        {games.map((game, i) => (
          <motion.button
            key={game.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => game.enabled && game.path && navigate(game.path)}
            disabled={!game.enabled}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:shadow-forest transition-shadow text-left disabled:opacity-60"
          >
            <div className={`w-14 h-14 rounded-xl ${game.color} flex items-center justify-center flex-shrink-0`}>
              <game.icon className="w-7 h-7 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground">{game.label}</h3>
              <p className="text-sm text-muted-foreground">{game.desc}</p>
            </div>
            {!game.enabled && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">presto</span>
            )}
          </motion.button>
        ))}
        <div className="rounded-xl bg-muted p-4 text-center">
          <Gamepad2 className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Altri giochi interattivi saranno disponibili prossimamente!
          </p>
        </div>
      </div>
    </MobileLayout>
  );
};

export default GamesPage;
