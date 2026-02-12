import PageHeader from "@/components/PageHeader";
import MobileLayout from "@/components/MobileLayout";
import { Users, Heart, Bell, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const VolunteersPage = () => {
  return (
    <MobileLayout>
      <PageHeader title="Volontari" showBack />
      <div className="p-4 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border bg-card p-5 text-center space-y-3"
        >
          <div className="w-16 h-16 rounded-2xl gradient-forest flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="font-display text-xl font-bold text-foreground">Diventa Volontario</h2>
          <p className="text-sm text-muted-foreground">
            Unisciti al nostro team di volontari e contribuisci alla cura del Bosco Anima Mundi. 
            Organizziamo giornate di pulizia, piantumazione e attività educative.
          </p>
          <Button className="gradient-forest text-primary-foreground shadow-forest">
            <Mail className="w-4 h-4 mr-2" /> Contattaci
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border bg-card p-4"
        >
          <div className="flex items-center gap-3 mb-3">
            <Bell className="w-5 h-5 text-accent" />
            <h3 className="font-display font-semibold">Avvisi per Volontari</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Gli avvisi verranno pubblicati qui. Resta aggiornato sulle prossime attività!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border bg-card p-4"
        >
          <div className="flex items-center gap-3 mb-3">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="font-display font-semibold">Cosa Facciamo</h3>
          </div>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>🌱 Piantumazione e cura degli alberi</li>
            <li>🧹 Manutenzione sentieri e aree verdi</li>
            <li>📚 Attività educative per bambini e adulti</li>
            <li>🎉 Organizzazione di eventi nel parco</li>
            <li>📷 Documentazione e comunicazione</li>
          </ul>
        </motion.div>
      </div>
    </MobileLayout>
  );
};

export default VolunteersPage;
