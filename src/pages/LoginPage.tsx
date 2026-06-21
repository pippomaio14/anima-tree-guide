import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const LoginPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>("");

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setDebugInfo("🔍 Tentativo login...");

    try {
      // Verifica che Supabase sia configurato
      console.log("🔍 Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
      console.log("🔍 Supabase ANON KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY ? "✅ Presente" : "❌ Manca");
      
      setDebugInfo(`📧 Email: ${email}`);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("📦 Risposta Supabase:", { data, error });
      setDebugInfo(`📦 Risposta: ${error ? 'ERRORE' : 'OK'}`);

      if (error) {
        console.error("❌ Errore login:", error);
        setError(`Errore: ${error.message}`);
        setDebugInfo(`❌ ${error.message}`);
      } else if (data?.user) {
        console.log("✅ Login riuscito:", data.user);
        setDebugInfo(`✅ User: ${data.user.email} (${data.user.id})`);
        navigate('/');
      } else {
        console.log("⚠️ Nessun dato ricevuto");
        setDebugInfo("⚠️ Nessun dato ricevuto da Supabase");
        setError("Nessuna risposta dal server");
      }
    } catch (err: any) {
      console.error("❌ Eccezione:", err);
      setError(`Errore: ${err.message}`);
      setDebugInfo(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Benvenuto</CardTitle>
          <CardDescription>Accedi per continuare</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="nome@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {/* Debug info */}
            {debugInfo && (
              <div className="text-xs text-muted-foreground bg-muted p-2 rounded break-all">
                {debugInfo}
              </div>
            )}
            
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                {error}
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Caricamento..." : "Accedi"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Non hai un account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-primary hover:underline"
            >
              Registrati
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
