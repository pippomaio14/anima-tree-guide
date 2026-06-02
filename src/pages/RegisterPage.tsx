import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { TreePine, ShieldCheck, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isVolunteer, setIsVolunteer] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [liabilityAccepted, setLiabilityAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      toast.error("Il numero di telefono è obbligatorio");
      return;
    }
    if (!privacyAccepted) {
      toast.error("Devi accettare l'informativa sulla privacy");
      return;
    }
    if (!liabilityAccepted) {
      toast.error("Devi accettare l'esonero di responsabilità");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName, phone, is_volunteer: isVolunteer },
      },
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Registrazione completata! Controlla la tua email per confermare l'account.");
      navigate("/login");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-8 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-forest shadow-forest mb-4">
            <TreePine className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">Registrati</h1>
          <p className="text-muted-foreground text-sm">Entra nella comunità del Bosco</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nome e Cognome</Label>
            <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Mario Rossi" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="la-tua@email.it" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefono</Label>
            <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+39 333 1234567" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimo 6 caratteri" required minLength={6} />
          </div>

          <div className="flex items-start space-x-3 rounded-lg border border-border p-3 bg-muted/30">
            <Checkbox
              id="volunteer"
              checked={isVolunteer}
              onCheckedChange={(checked) => setIsVolunteer(checked === true)}
              className="mt-0.5"
            />
            <div className="space-y-1">
              <Label htmlFor="volunteer" className="text-sm font-medium cursor-pointer">
                Voglio essere volontario del parco
              </Label>
              <p className="text-xs text-muted-foreground">
                Riceverai aggiornamenti e avvisi tramite WhatsApp
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 rounded-lg border border-border p-3 bg-muted/30">
            <Checkbox
              id="privacy"
              checked={privacyAccepted}
              onCheckedChange={(checked) => setPrivacyAccepted(checked === true)}
              className="mt-0.5"
              required
            />
            <div className="space-y-1">
              <Label htmlFor="privacy" className="text-sm font-medium cursor-pointer flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" /> Informativa Privacy (GDPR)
              </Label>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Ai sensi del Reg. UE 2016/679, acconsento al trattamento dei miei dati personali
                (nome, email, telefono, geolocalizzazione durante l'uso dell'app) per la gestione
                dell'account e l'erogazione dei servizi del Parco.{" "}
                <Link to="/legal/privacy" target="_blank" className="text-primary underline font-medium">
                  Leggi l'informativa completa
                </Link>
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 rounded-lg border border-border p-3 bg-muted/30">
            <Checkbox
              id="liability"
              checked={liabilityAccepted}
              onCheckedChange={(checked) => setLiabilityAccepted(checked === true)}
              className="mt-0.5"
              required
            />
            <div className="space-y-1">
              <Label htmlFor="liability" className="text-sm font-medium cursor-pointer flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-primary" /> Esonero di Responsabilità
              </Label>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Accetto espressamente che il Parco Bosco Anima Mundi non ha alcuna responsabilità
                per danni, furto di dati o qualsiasi altro problema causato dall'installazione o
                dall'uso dell'app.{" "}
                <Link to="/legal/liability" target="_blank" className="text-primary underline font-medium">
                  Leggi il testo completo
                </Link>
              </p>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full gradient-forest text-primary-foreground shadow-forest"
            disabled={loading || !privacyAccepted || !liabilityAccepted}
          >
            {loading ? "Registrazione..." : "Crea Account"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Hai già un account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">Accedi</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
