// ✅ USEAUTH.TSX - CON CHILDREN SEMPLIFICATI
import { createContext, useContext, ReactNode } from "react";

const AuthContext = createContext({
  user: null,
  session: null,
  loading: false,
  isAdmin: false,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  console.log('✅ AuthProvider: inizio render');
  console.log('✅ Children:', children);
  
  // Se children è undefined o null, mostra un fallback
  if (!children) {
    console.warn('⚠️ AuthProvider: children è undefined');
    return <div>Nessun children</div>;
  }

  try {
    console.log('✅ AuthProvider: renderizzo children');
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
  } catch (error) {
    console.error('❌ AuthProvider: errore nel render:', error);
    return <div style={{ color: 'red', padding: '20px' }}>
      Errore in AuthProvider: {String(error)}
    </div>;
  }
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve essere usato all\'interno di AuthProvider');
  }
  return context;
};
