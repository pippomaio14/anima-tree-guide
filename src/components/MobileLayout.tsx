import { ReactNode, useEffect } from "react";
import BottomNav from "./BottomNav";
import { useAuth } from "@/hooks/useAuth";

// ✅ FUNZIONE DI LOG PER DEBUG
const bootLog = (message: string, type: 'info' | 'warn' | 'error' = 'info') => {
  try {
    const logEl = document.getElementById('boot-log');
    if (logEl) {
      const prefix = type === 'error' ? '❌' : type === 'warn' ? '⚠️' : '✅';
      logEl.innerHTML += `\n${prefix} [MobileLayout] ${message}`;
      logEl.scrollTop = logEl.scrollHeight;
    }
    console.log(`[MobileLayout] ${message}`);
  } catch (e) {
    // Ignora errori di log
  }
};

interface MobileLayoutProps {
  children: ReactNode;
  hideNav?: boolean;
}

const MobileLayout = ({ children, hideNav = false }: MobileLayoutProps) => {
  bootLog(`Componente montato - hideNav: ${hideNav}`);
  
  // ✅ USO DI useAuth CON GESTIONE ERRORI
  let user = null;
  let authError = null;
  
  try {
    const auth = useAuth();
    user = auth.user;
    bootLog(`useAuth ottenuto - user: ${user ? 'presente' : 'null'}`);
  } catch (error) {
    authError = error;
    bootLog(`❌ ERRORE useAuth: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`, 'error');
    console.error('Errore useAuth in MobileLayout:', error);
  }

  // ✅ EFFETTO PER LOG DEL RENDER
  useEffect(() => {
    bootLog('useEffect avviato - componente renderizzato');
    
    return () => {
      bootLog('Cleanup MobileLayout');
    };
  }, []);

  // ✅ SE C'È UN ERRORE, MOSTRA UN MESSAGGIO INVECE DI CRASHARE
  if (authError) {
    bootLog('❌ Mostro fallback per errore auth', 'error');
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <h2 className="text-red-800 font-semibold text-lg mb-2">⚠️ Errore di autenticazione</h2>
          <p className="text-red-600 text-sm mb-4">
            {authError instanceof Error ? authError.message : 'Errore sconosciuto'}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
          >
            🔄 Riprova
          </button>
        </div>
      </div>
    );
  }

  // ✅ LOG DEL RENDER
  bootLog(`Render - hideNav: ${hideNav}, user: ${user ? 'presente' : 'null'}`);
  bootLog(`Mostra BottomNav: ${!hideNav && user ? '✅ SI' : '❌ NO'}`);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className={`flex-1 ${!hideNav && user ? "pb-20" : ""}`}>
        {children}
      </main>
      {!hideNav && user && <BottomNav />}
    </div>
  );
};

bootLog('MobileLayout esportato');

export default MobileLayout;
