import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { useState, useEffect } from "react";

// ✅ COMPONENTE SPLASHSCREEN SICURO - SENZA FRAMER-MOTION
const SafeSplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Dopo 1.5 secondi, avvia la dissolvenza
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 1500);

    // Dopo 2 secondi, completa
    const hideTimer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.5s ease-out',
        pointerEvents: 'none', // Permette di cliccare attraverso
      }}
    >
      <img
        src="/logo.png"
        alt="Parco Bosco Anima Mundi"
        style={{
          width: '256px',
          maxWidth: '70vw',
          height: 'auto',
          transform: fadeOut ? 'scale(0.95)' : 'scale(1)',
          transition: 'transform 0.5s ease-out',
        }}
        onError={(e) => {
          console.warn('Logo non caricato, uso testo fallback');
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent) {
            const text = document.createElement('div');
            text.style.cssText = 'font-size: 24px; font-weight: bold; color: #166534; text-align: center; padding: 20px;';
            text.textContent = '🌳 Parco Bosco Anima Mundi';
            parent.appendChild(text);
          }
        }}
      />
    </div>
  );
};

// ✅ COMPONENTE PRINCIPALE DELL'APP
function App() {
  const [showSplash, setShowSplash] = useState(true);
  
  console.log('🚀 App avviata');

  // Se lo splash è finito, mostra il contenuto principale
  if (showSplash) {
    return (
      <BrowserRouter>
        <AuthProvider>
          <SafeSplashScreen onComplete={() => {
            console.log('✅ Splash completato');
            setShowSplash(false);
          }} />
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100vh', 
            padding: '20px', 
            fontFamily: 'sans-serif', 
            textAlign: 'center',
            backgroundColor: '#fef3c7',
            color: '#92400e'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🚀</div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '600' }}>App con Splash</h1>
            <p style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#92400e' }}>
              Lo SplashScreen funziona correttamente!
            </p>
            <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#6b7280' }}>
              Il componente è stato montato e smontato senza errori.
            </p>
            <button 
              onClick={() => window.location.reload()}
              style={{ 
                padding: '10px 24px', 
                backgroundColor: '#92400e', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                fontSize: '14px', 
                cursor: 'pointer'
              }}
            >
              🔄 Ricarica
            </button>
          </div>
        </AuthProvider>
      </BrowserRouter>
    );
  }

  // Dopo lo splash, mostra il contenuto principale
  return (
    <BrowserRouter>
      <AuthProvider>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh', 
          padding: '20px', 
          fontFamily: 'sans-serif', 
          textAlign: 'center',
          backgroundColor: '#d1fae5',
          color: '#065f46'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '600' }}>App Pronta!</h1>
          <p style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#065f46' }}>
            Lo SplashScreen è stato rimosso correttamente.
          </p>
          <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#6b7280' }}>
            Ora puoi reinserire i componenti originali uno per uno.
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{ 
              padding: '10px 24px', 
              backgroundColor: '#065f46', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              fontSize: '14px', 
              cursor: 'pointer'
            }}
          >
            🔄 Ricarica
          </button>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
