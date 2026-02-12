import PageHeader from "@/components/PageHeader";
import MobileLayout from "@/components/MobileLayout";
import { TreePine, Target, Heart, Globe } from "lucide-react";
import { motion } from "framer-motion";

const sections = [
  {
    icon: TreePine,
    title: "Il Bosco Anima Mundi",
    content:
      "Il Parco Bosco Anima Mundi nasce a Camisano Vicentino con l'obiettivo di creare un'oasi verde dove la natura e la comunità si incontrano. Ogni albero racconta una storia, ogni sentiero è un invito alla scoperta.",
  },
  {
    icon: Target,
    title: "I Nostri Obiettivi",
    content:
      "Promuovere la biodiversità, educare alla sostenibilità ambientale, creare uno spazio di incontro per la comunità e preservare il patrimonio naturale per le generazioni future.",
  },
  {
    icon: Heart,
    title: "Adotta un Albero",
    content:
      "Il programma di adozione permette a chiunque di contribuire alla crescita del bosco. Ogni albero adottato può essere dedicato a una persona cara, creando un legame speciale con la natura.",
  },
  {
    icon: Globe,
    title: "Sostenibilità",
    content:
      "Il parco è gestito seguendo principi di sostenibilità ambientale, utilizzando pratiche di cura naturali e promuovendo la partecipazione attiva dei cittadini nella tutela dell'ambiente.",
  },
];

const ParkInfoPage = () => {
  return (
    <MobileLayout>
      <PageHeader title="Il Parco" showBack />
      <div className="p-4 space-y-4">
        {sections.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg gradient-forest flex items-center justify-center">
                <section.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <h2 className="font-display font-semibold text-foreground">{section.title}</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
          </motion.div>
        ))}
      </div>
    </MobileLayout>
  );
};

export default ParkInfoPage;
