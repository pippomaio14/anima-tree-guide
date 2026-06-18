// ✅ USEAUTH.TSX - SENZA CONTESTO (SOLO FUNZIONI)
import { ReactNode } from "react";

// Mock delle funzioni di autenticazione
const mockAuth = {
  user: null,
  session: null,
  loading: false,
  isAdmin: false,
  signOut: async () => {},
};

// Provider senza contesto
export function AuthProvider({ children }: { children: ReactNode }) {
  console.log('✅ AuthProvider senza contesto');
  
  // Non usa Context.Provider, renderizza solo children
  return <>{children}</>;
}

// Hook che restituisce il mock
export const useAuth = () => {
  console.log('✅ useAuth chiamato');
  return mockAuth;
};
