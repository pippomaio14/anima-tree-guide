import { useEffect, useState } from "react";

// ✅ NUOVO SPLASHSCREEN - SENZA FRAMER-MOTION
const SplashScreen = () => {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Dopo 1.5 secondi, avvia la dissolvenza
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 1500);

    // Dopo 2 secondi, nascondi completamente
    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
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
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.5s ease-out',
        pointerEvents: 'none', // Permette di cliccare attraverso lo splash
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

export default SplashScreen;
