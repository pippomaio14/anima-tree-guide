import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
console.log('🔍 [useAuth] Verifica connessione Supabase:');
console.log('  - supabase:', supabase ? '✅ Caricato' : '❌ Non caricato');
console.log('  - supabase.auth:', supabase.auth ? '✅ Disponibile' : '❌ Non disponibile');
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

// ✅ COMPONENTE DI TEST PER ISOLARE IL PROBLEMA
const TestComponent = () => {
  bootLog('🔬 [TEST] TestComponent montato correttamente!');
  
  useEffect(() => {
    bootLog('🔬 [TEST] useEffect di TestComponent eseguito');
  }, []);
  
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', 
      padding: '20px', 
      fontFamily: 'sans-serif', 
      textAlign: 'center',
      backgroundColor: '#f0fdf4',
      color: '#166534'
    }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
      <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '600' }}>Test Riuscito!</h1>
      <p style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#166534' }}>
        AuthProvider funziona e ha renderizzato questo componente.
      </p>
      <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#6b7280' }}>
        Se vedi questo messaggio, il problema è nei componenti figli (Index, MobileLayout, ecc.).
      </p>
      <button 
        onClick={() => window.location.reload()}
        style={{ 
          padding: '10px 24px', 
          backgroundColor: '#166534', 
          color: 'white', 
          border: 'none', 
          borderRadius: '8px', 
          fontSize: '14px', 
          cursor: 'pointer',
          marginTop: '10px'
        }}
      >
        🔄 Ricarica
      </button>
      <button 
        onClick={() => {
          bootLog('🔬 [TEST] Pulsante "Mostra dettagli" cliccato');
          const details = document.getElementById('test-details');
          if (details) {
            details.style.display = details.style.display === 'none' ? 'block' : 'none';
          }
        }}
        style={{ 
          padding: '8px 16px', 
          backgroundColor: '#e5e7eb', 
          color: '#374151', 
          border: 'none', 
          borderRadius: '8px', 
          fontSize: '12px', 
          cursor: 'pointer',
          marginTop: '10px'
        }}
      >
        📋 Mostra dettagli
      </button>
      <pre id="test-details" style={{ 
        display: 'none', 
        marginTop: '16px', 
        padding: '12px', 
        backgroundColor: '#ffffff', 
        border: '1px solid #d1d5db', 
        borderRadius: '8px', 
        fontSize: '11px', 
        textAlign: 'left', 
        overflow: 'auto', 
        maxWidth: '100%', 
        maxHeight: '200px', 
        whiteSpace: 'pre-wrap', 
        wordBreak: 'break-all',
        color: '#1f2937'
      }}>
        {`Test eseguito il: ${new Date().toLocaleString()}
Ambiente: ${typeof window !== 'undefined' && window.Capacitor ? 'Capacitor (Android)' : 'Web'}
User: null (non autenticato)`}
      </pre>
    </div>
  );
};

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

  // ✅ DETERMINA SE MOSTRARE IL TEST O I CHILDREN
  // Attiva il test cambiando questa variabile a 'true'
  const USE_TEST_COMPONENT = false; // <- CAMBIA A 'true' PER TESTARE
  
  if (USE_TEST_COMPONENT) {
    bootLog('🔬 [TEST] Modalità test attivata - mostro TestComponent');
    return (
      <AuthContext.Provider value={{ user, session, loading, isAdmin, signOut }}>
        <TestComponent />
      </AuthContext.Provider>
    );
  }

  bootLog('Modalità normale - mostro children');
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
