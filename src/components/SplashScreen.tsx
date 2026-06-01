import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SplashScreen = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 1800);
    return () => clearTimeout(t);
  }, []);

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
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
