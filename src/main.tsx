import { createRoot } from "react-dom/client";
import "./index.css";

// ✅ COMPONENTE DI TEST MINIMALE
const TestApp = () => {
  console.log('✅ TestApp renderizzato');
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      backgroundColor: '#f0fdf4',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ color: '#166534', fontSize: '48px' }}>🌳</h1>
      <h2 style={{ color: '#166534' }}>Test Funziona!</h2>
      <p style={{ color: '#4a5568' }}>Se vedi questo messaggio, il caricamento di base funziona.</p>
    </div>
  );
};

// ✅ AVVIO DIRETTO SENZA ALTRE DIPENDENZE
const rootElement = document.getElementById('root');
if (rootElement) {
  console.log('✅ Root element trovato');
  createRoot(rootElement).render(<TestApp />);
} else {
  console.error('❌ Root element non trovato');
}
