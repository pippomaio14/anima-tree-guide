import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { TreePine, Leaf } from "lucide-react";
import { motion } from "framer-motion";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
    } else {
      navigate("/");
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Inserisci la tua email per recuperare la password");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Email di recupero inviata! Controlla la tua casella.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-8"
      >
        <div className="text-center space-y-2">
          <img
            src="/logo.png"
            alt="Parco Bosco Anima Mundi"
            className="w-32 h-32 mx-auto mb-2 object-contain"
          />
          <p className="text-muted-foreground text-sm">
            Parco di Camisano Vicentino
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="la-tua@email.it"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <Button type="submit" className="w-full gradient-forest text-primary-foreground shadow-forest" disabled={loading}>
            {loading ? "Accesso..." : "Accedi"}
          </Button>
        </form>

        <div className="text-center space-y-2">
          <button
            onClick={handleForgotPassword}
            className="text-sm text-primary hover:underline"
          >
            Password dimenticata?
          </button>
          <p className="text-sm text-muted-foreground">
            Non hai un account?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Registrati
            </Link>
          </p>
        </div>

        <div className="flex items-center justify-center gap-1 text-muted-foreground">
          <Leaf className="w-3 h-3 animate-leaf-sway" />
          <span className="text-xs">Adotta un albero, coltiva il futuro</span>
          <Leaf className="w-3 h-3 animate-leaf-sway" style={{ animationDelay: "1s" }} />
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
