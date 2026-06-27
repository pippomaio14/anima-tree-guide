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
  const [loginSuccess, setLoginSuccess] = useState(false);

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
    setLoginSuccess(false);

    try {
      setDebugInfo(`📧 Email: ${email}`);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      setDebugInfo(`📦 Risposta: ${error ? 'ERRORE' : 'OK'}`);

      if (error) {
        setError(`Errore: ${error.message}`);
        setDebugInfo(`❌ ${error.message}`);
        setLoading(false);
        return;
      }

      if (data?.user) {
        setDebugInfo(`✅ Login riuscito! User: ${data.user.email}`);
        setLoginSuccess(true);
        
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setDebugInfo("⚠️ Nessun dato ricevuto da Supabase");
        setError("Nessuna risposta dal server");
        setLoading(false);
      }
    } catch (err: any) {
      setError(`Errore: ${err.message}`);
      setDebugInfo(`❌ ${err.message}`);
      setLoading(false);
    } finally {
      if (!loginSuccess) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      {/* ✅ LOGO IN ALTO A DESTRA */}
      <div className="absolute top-4 right-4">
        <img
          src="/logo.png"
          alt="Logo"
          className="w-12 h-12 object-contain"
          onError={(e) => {
            // Fallback se il logo non carica
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      </div>

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
              <div className={`text-xs p-2 rounded break-all ${loginSuccess ? 'bg-green-100 text-green-800' : 'bg-muted text-muted-foreground'}`}>
                {debugInfo}
                {loginSuccess && (
                  <div className="mt-1 font-bold text-green-700">
                    ⏳ Reindirizzamento in 3 secondi...
                  </div>
                )}
              </div>
            )}
            
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                {error}
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={loading || loginSuccess}>
              {loading ? "Caricamento..." : loginSuccess ? "✅ Login effettuato!" : "Accedi"}
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
