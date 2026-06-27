import { useEffect, useState } from "react";

const SplashScreen = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Nascondi lo splash dopo 2 secondi
    const timer = setTimeout(() => {
      setVisible(false);
    }, 2000);

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
      }}
    >
      <img
        src="/logo.png"
        alt="Parco Bosco Anima Mundi"
        style={{
          width: '200px',
          maxWidth: '70vw',
          height: 'auto',
        }}
        onError={(e) => {
          console.warn('Logo non trovato, uso testo fallback');
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
