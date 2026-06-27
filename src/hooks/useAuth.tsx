import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

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
  console.log('✅ AuthProvider reale montato');
  
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Effetto: autenticazione
  useEffect(() => {
    console.log('🔍 AuthProvider: useEffect avviato');
    
    let isMounted = true;

    // Ascolta i cambiamenti di stato
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('🔍 AuthProvider: onAuthStateChange', { _event, session: session?.user?.email });
      if (isMounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    // Ottieni la sessione iniziale
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔍 AuthProvider: getSession', { session: session?.user?.email });
      if (isMounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Effetto: controllo admin
  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .then(({ data }) => {
        setIsAdmin(data && data.length > 0);
      });
  }, [user]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  console.log('🔍 AuthProvider: render con user=', user?.email || 'null');

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve essere usato all\'interno di AuthProvider');
  }
  return context;
};
