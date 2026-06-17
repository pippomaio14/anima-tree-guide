import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ✅ FUNZIONE DI LOG PER DEBUG
const bootLog = (message: string, type: 'info' | 'warn' | 'error' = 'info') => {
  try {
    const logEl = document.getElementById('boot-log');
    if (logEl) {
      const prefix = type === 'error' ? '❌' : type === 'warn' ? '⚠️' : '✅';
      logEl.innerHTML += `\n${prefix} [SplashScreen] ${message}`;
      logEl.scrollTop = logEl.scrollHeight;
    }
    console.log(`[SplashScreen] ${message}`);
  } catch (e) {
    // Ignora errori di log
  }
};

const SplashScreen = () => {
  bootLog('Componente montato');
  
  const [visible, setVisible] = useState(true);
  bootLog(`State visible: ${visible}`);

  useEffect(() => {
    bootLog('useEffect avviato');
    
    // Imposta un timeout per nascondere lo splash
    const t = setTimeout(() => {
      bootLog('Timeout scaduto - nascondo splash');
      setVisible(false);
    }, 1800);
    
    bootLog('Timeout impostato');
    
    return () => {
      bootLog('Cleanup useEffect - cancello timeout');
      clearTimeout(t);
    };
  }, []);

  bootLog('Preparazione render JSX');
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
        >
          <motion.img
            src="/logo.png"
            alt="Parco Bosco Anima Mundi"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-64 max-w-[70vw] h-auto"
            onError={(e) => {
              bootLog('❌ ERRORE: Immagine logo non caricata!', 'error');
              console.error('Errore caricamento logo:', e);
            }}
            onLoad={() => {
              bootLog('✅ Logo caricato con successo');
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

bootLog('SplashScreen esportato');

export default SplashScreen;
