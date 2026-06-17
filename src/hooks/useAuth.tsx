import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

// ✅ FUNZIONE DI LOG PER DEBUG
const bootLog = (message: string, type: 'info' | 'warn' | 'error' = 'info') => {
  try {
    const logEl = document.getElementById('boot-log');
    if (logEl) {
      const prefix = type === 'error' ? '❌' : type === 'warn' ? '⚠️' : '✅';
      logEl.innerHTML += `\n${prefix} [AuthProvider] ${message}`;
      logEl.scrollTop = logEl.scrollHeight;
    }
    console.log(`[AuthProvider] ${message}`);
  } catch (e) {
    // Ignora errori di log
  }
};

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isAdmin: false,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  bootLog('AuthProvider montato');
  
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  bootLog(`State iniziale: loading=${loading}, user=${user ? 'presente' : 'null'}`);

  // ✅ EFFETTO 1: AUTENTICAZIONE
  useEffect(() => {
    bootLog('useEffect autenticazione avviato');
    
    let isMounted = true;

    // Gestisci il cambiamento di stato auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      bootLog(`Auth state changed: ${_event}, session: ${session ? 'presente' : 'null'}`);
      if (isMounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        bootLog(`Auth state aggiornato: loading=${false}, user=${session?.user ? 'presente' : 'null'}`);
      }
    });

    // Ottieni la sessione iniziale
    bootLog('Recupero sessione iniziale...');
    supabase.auth.getSession()
      .then(({ data: { session }, error }) => {
        if (error) {
          bootLog(`❌ Errore getSession: ${error.message}`, 'error');
          console.error('Errore getSession:', error);
          if (isMounted) {
            setLoading(false);
          }
          return;
        }
        bootLog(`Sessione ottenuta: ${session ? 'presente' : 'null'}`);
        if (isMounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      })
      .catch((error) => {
        bootLog(`❌ Errore imprevisto getSession: ${error.message}`, 'error');
        console.error('Errore imprevisto:', error);
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      bootLog('Cleanup useEffect autenticazione');
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ✅ EFFETTO 2: CONTROLLO ADMIN
  useEffect(() => {
    bootLog(`useEffect admin avviato, user: ${user ? 'presente' : 'null'}`);
    
    if (!user) {
      bootLog('Nessun utente, reset isAdmin');
      setIsAdmin(false);
      return;
    }

    let isMounted = true;

    bootLog(`Controllo admin per user: ${user.id}`);
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .then(({ data, error }) => {
        if (error) {
          bootLog(`❌ Errore controllo admin: ${error.message}`, 'error');
          console.error('Errore controllo admin:', error);
          if (isMounted) {
            setIsAdmin(false);
          }
          return;
        }
        const adminStatus = data && data.length > 0;
        bootLog(`Admin status: ${adminStatus}`);
        if (isMounted) {
          setIsAdmin(adminStatus);
        }
      })
      .catch((error) => {
        bootLog(`❌ Errore imprevisto admin: ${error.message}`, 'error');
        console.error('Errore imprevisto admin:', error);
        if (isMounted) {
          setIsAdmin(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  // ✅ SIGNOUT CON LOG
  const signOut = async () => {
    bootLog('signOut chiamato');
    try {
      await supabase.auth.signOut();
      bootLog('✅ signOut completato');
    } catch (error) {
      bootLog(`❌ Errore signOut: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`, 'error');
      console.error('Errore signOut:', error);
      throw error;
    }
  };

  // ✅ LOG DEL CONTESTO FINALE
  bootLog(`Provider render - loading: ${loading}, user: ${user ? 'presente' : 'null'}, isAdmin: ${isAdmin}`);

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error('❌ useAuth deve essere usato all\'interno di AuthProvider');
    throw new Error('useAuth deve essere usato all\'interno di AuthProvider');
  }
  return context;
};

// ✅ LOG DI ESPORTAZIONE
bootLog('AuthProvider esportato');
