// ✅ USEAUTH.TSX - VERSIONE MINIMALE (SENZA SUPABASE)
import { createContext, useContext, ReactNode } from "react";

// Contesto minimale
const AuthContext = createContext({
  user: null,
  session: null,
  loading: false,
  isAdmin: false,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  console.log('✅ AuthProvider minimale montato');
  
  return (
    <AuthContext.Provider value={{
      user: null,
      session: null,
      loading: false,
      isAdmin: false,
      signOut: async () => {},
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
