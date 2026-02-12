import PageHeader from "@/components/PageHeader";
import MobileLayout from "@/components/MobileLayout";
import { Gamepad2, Brain, Puzzle, Trophy } from "lucide-react";
import { motion } from "framer-motion";

const games = [
  { icon: Brain, label: "Quiz sulla Natura", desc: "Metti alla prova le tue conoscenze", color: "gradient-forest" },
  { icon: Puzzle, label: "Indovina l'Albero", desc: "Riconosci le specie del bosco", color: "gradient-amber" },
  { icon: Trophy, label: "Sfida del Bosco", desc: "Completa le missioni nel parco", color: "gradient-forest" },
];

const GamesPage = () => {
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
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:shadow-forest transition-shadow text-left"
          >
            <div className={`w-14 h-14 rounded-xl ${game.color} flex items-center justify-center flex-shrink-0`}>
              <game.icon className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">{game.label}</h3>
              <p className="text-sm text-muted-foreground">{game.desc}</p>
            </div>
          </motion.button>
        ))}
        <div className="rounded-xl bg-muted p-4 text-center">
          <Gamepad2 className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            I giochi interattivi saranno disponibili prossimamente! L'amministratore potrà caricare quiz e contenuti.
          </p>
        </div>
      </div>
    </MobileLayout>
  );
};

export default GamesPage;
