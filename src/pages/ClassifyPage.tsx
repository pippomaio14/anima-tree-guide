import PageHeader from "@/components/PageHeader";
import MobileLayout from "@/components/MobileLayout";
import { Leaf, Flower2, Apple, Sprout } from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  { icon: Leaf, label: "Foglia", desc: "Identifica dalla forma della foglia", color: "gradient-forest" },
  { icon: Flower2, label: "Fiore", desc: "Riconosci dal tipo di fiore", color: "gradient-amber" },
  { icon: Apple, label: "Frutto", desc: "Classifica dal frutto", color: "gradient-forest" },
  { icon: Sprout, label: "Gemma", desc: "Osserva le gemme", color: "gradient-amber" },
];

const ClassifyPage = () => {
  return (
    <MobileLayout>
      <PageHeader title="Classifica una Pianta" showBack />
      <div className="p-4 space-y-4">
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
              className="flex flex-col items-center p-6 rounded-xl border border-border bg-card hover:shadow-forest transition-shadow"
            >
              <div className={`w-14 h-14 rounded-2xl ${cat.color} flex items-center justify-center mb-3`}>
                <cat.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <span className="font-medium text-foreground">{cat.label}</span>
              <span className="text-xs text-muted-foreground mt-1 text-center">{cat.desc}</span>
            </motion.button>
          ))}
        </div>
        <div className="rounded-xl bg-muted p-4 text-center">
          <p className="text-sm text-muted-foreground">
            🔬 La funzionalità di riconoscimento automatico sarà disponibile prossimamente!
          </p>
        </div>
      </div>
    </MobileLayout>
  );
};

export default ClassifyPage;
