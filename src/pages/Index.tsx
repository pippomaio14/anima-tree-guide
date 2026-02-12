import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { TreePine, Search, Calendar, BookOpen, Leaf, Users, Info, Gamepad2 } from "lucide-react";
import { motion } from "framer-motion";
import MobileLayout from "@/components/MobileLayout";
import heroImage from "@/assets/hero-park.jpg";

const sections = [
  { icon: Search, label: "Trova il tuo Albero", desc: "Cerca l'albero adottato", path: "/trees", color: "gradient-forest" },
  { icon: Leaf, label: "Classifica Piante", desc: "Identifica da foglia o frutto", path: "/classify", color: "gradient-amber" },
  { icon: Gamepad2, label: "Giochi & Quiz", desc: "Test e giochi sul bosco", path: "/games", color: "gradient-forest" },
  { icon: BookOpen, label: "Letture", desc: "Articoli e brani del giorno", path: "/articles", color: "gradient-amber" },
  { icon: Calendar, label: "Eventi", desc: "Scopri gli eventi del parco", path: "/events", color: "gradient-forest" },
  { icon: Info, label: "Il Parco", desc: "Storia e obiettivi", path: "/park-info", color: "gradient-amber" },
  { icon: Users, label: "Volontari", desc: "Diventa volontario", path: "/volunteers", color: "gradient-forest" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <MobileLayout>
      {/* Hero */}
      <div className="relative h-52 overflow-hidden">
        <img src={heroImage} alt="Parco Bosco Anima Mundi" className="w-full h-full object-cover" />
        <div className="absolute inset-0 gradient-hero flex flex-col justify-end p-5">
          <h1 className="font-display text-2xl font-bold text-primary-foreground leading-tight">
            Bosco Anima Mundi
          </h1>
          <p className="text-primary-foreground/80 text-sm mt-1">
            Camisano Vicentino • Il tuo bosco, la tua anima
          </p>
        </div>
      </div>

      {/* Greeting */}
      <div className="px-4 py-4">
        <p className="text-muted-foreground text-sm">
          Ciao{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}! 🌿
        </p>
      </div>

      {/* Sections Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="px-4 pb-6 grid grid-cols-2 gap-3"
      >
        {sections.map((section) => (
          <motion.button
            key={section.path}
            variants={item}
            onClick={() => navigate(section.path)}
            className="flex flex-col items-start p-4 rounded-xl bg-card border border-border hover:shadow-forest transition-shadow text-left"
          >
            <div className={`w-10 h-10 rounded-lg ${section.color} flex items-center justify-center mb-3`}>
              <section.icon className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-medium text-sm text-foreground">{section.label}</span>
            <span className="text-xs text-muted-foreground mt-0.5">{section.desc}</span>
          </motion.button>
        ))}
      </motion.div>
    </MobileLayout>
  );
};

export default Index;
