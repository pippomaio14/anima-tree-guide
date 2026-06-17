import { useEffect, useState } from "react";

// ✅ VERSIONE SEMPLIFICATA DI SPLASHSCREEN - SENZA FRAMER-MOTION
const SplashScreen = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Nascondi lo splash dopo 1.5 secondi
    const timer = setTimeout(() => {
      setVisible(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

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
        transition: 'opacity 0.6s ease-out',
        opacity: visible ? 1 : 0
      }}
    >
      <img 
        src="/logo.png" 
        alt="Parco Bosco Anima Mundi"
        style={{
          width: '256px',
          maxWidth: '70vw',
          height: 'auto'
        }}
        onError={(e) => {
          console.error('❌ Errore caricamento logo:', e);
          // Se l'immagine non carica, mostra un testo
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent) {
            const text = document.createElement('div');
            text.style.cssText = 'font-size: 24px; font-weight: bold; color: #166534; text-align: center;';
            text.textContent = '🌳 Parco Bosco Anima Mundi';
            parent.appendChild(text);
          }
        }}
      />
    </div>
  );
};

export default SplashScreen;
