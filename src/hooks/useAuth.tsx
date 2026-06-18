import { createContext, useContext, useState, ReactNode } from "react";

// ✅ VERSIONE MOCK DI AUTH PROVIDER - SENZA SUPABASE
// Questo file serve per testare se il problema è in Supabase

interface AuthContextType {
  user: null;
  session: null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: false,
  isAdmin: false,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  console.log('✅ [Mock AuthProvider] Montato');
  
  // Stato fittizio - sempre non autenticato
  const [loading] = useState(false);
  
  console.log('✅ [Mock AuthProvider] Render - loading: false, user: null');

  return (
    <AuthContext.Provider value={{ 
      user: null, 
      session: null, 
      loading: false, 
      isAdmin: false, 
      signOut: async () => {} 
    }}>
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
