import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// ✅ GESTIONE ERRORI GLOBALE - CATTURA TUTTI GLI ERRORI
const handleGlobalError = (event: ErrorEvent) => {
  console.error('❌ Errore globale catturato:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });
  
  // Mostra un messaggio all'utente invece di schermata bianca
  const root = document.getElementById('root');
  if (root && !root.hasChildNodes()) {
    root.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;padding:20px;font-family:-apple-system,system-ui,sans-serif;text-align:center;background:#f8f9fa;color:#1a1a1a;">
        <div style="font-size:48px;margin-bottom:16px;">⚠️</div>
        <h2 style="margin:0 0 8px 0;font-size:20px;font-weight:600;">Si è verificato un errore</h2>
        <p style="margin:0 0 4px 0;font-size:14px;color:#666;">${event.message || 'Errore sconosciuto'}</p>
        <p style="margin:0 0 20px 0;font-size:12px;color:#999;">${event.filename || ''} riga ${event.lineno || ''}</p>
        <button onclick="location.reload()" style="padding:10px 24px;background:#1976d2;color:white;border:none;border-radius:8px;font-size:14px;cursor:pointer;">
          🔄 Riprova
        </button>
        <button onclick="document.getElementById('error-details').style.display='block'" style="margin-top:12px;padding:8px 16px;background:#e0e0e0;color:#333;border:none;border-radius:8px;font-size:12px;cursor:pointer;">
          📋 Mostra dettagli
        </button>
        <pre id="error-details" style="display:none;margin-top:16px;padding:12px;background:#fff;border:1px solid #ddd;border-radius:8px;font-size:11px;text-align:left;overflow:auto;max-width:100%;max-height:200px;white-space:pre-wrap;word-break:break-all;">
          ${event.error?.stack || event.message || 'Nessun dettaglio disponibile'}
        </pre>
      </div>
    `;
  }
  
  // Evita che l'errore si propaghi ulteriormente
  event.preventDefault();
  return true;
};

// ✅ GESTIONE PROMISE NON GESTITE
const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
  console.error('❌ Promise non gestita:', {
    reason: event.reason,
    promise: event.promise
  });
  
  // Mostra un messaggio più leggero per errori di promise
  const root = document.getElementById('root');
  if (root && !root.hasChildNodes()) {
    root.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;padding:20px;font-family:-apple-system,system-ui,sans-serif;text-align:center;background:#f8f9fa;color:#1a1a1a;">
        <div style="font-size:48px;margin-bottom:16px;">⏳</div>
        <h2 style="margin:0 0 8px 0;font-size:20px;font-weight:600;">Caricamento in corso...</h2>
        <p style="margin:0;font-size:14px;color:#666;">Stiamo riscontrando un problema. Riprova tra qualche istante.</p>
        <button onclick="location.reload()" style="margin-top:20px;padding:10px 24px;background:#1976d2;color:white;border:none;border-radius:8px;font-size:14px;cursor:pointer;">
          🔄 Riprova
        </button>
      </div>
    `;
  }
  
  event.preventDefault();
};

// ✅ LOG DELL'AMBIENTE (UTILE PER DEBUG)
const logEnvironment = () => {
  console.log('🌍 Ambiente rilevato:');
  console.log('  - Platform:', navigator.platform);
  console.log('  - User Agent:', navigator.userAgent);
  console.log('  - Capacitor:', typeof window !== 'undefined' && window.Capacitor ? '✅ Presente' : '❌ Assente');
  console.log('  - Is Native:', typeof window !== 'undefined' && window.Capacitor?.isNativePlatform ? window.Capacitor.isNativePlatform() : false);
  console.log('  - URL Corrente:', window.location.href);
  console.log('  - Root element:', document.getElementById('root') ? '✅ Trovato' : '❌ Non trovato');
};

// ✅ FUNZIONE DI AVVIO SICURA
const startApp = () => {
  try {
    const rootElement = document.getElementById('root');
    
    if (!rootElement) {
      console.error('❌ Elemento root non trovato!');
      document.body.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;padding:20px;font-family:sans-serif;text-align:center;">
          <h2>⚠️ Errore di inizializzazione</h2>
          <p>Elemento root non trovato. Verifica che index.html contenga un div con id "root".</p>
        </div>
      `;
      return;
    }

    console.log('🚀 Avvio applicazione...');
    logEnvironment();
    
    // Render dell'app
    createRoot(rootElement).render(<App />);
    console.log('✅ Applicazione avviata con successo!');
    
  } catch (error) {
    console.error('❌ Errore fatale durante l\'avvio:', error);
    
    // Mostra errore visibile
    const root = document.getElementById('root');
    if (root) {
      root.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;padding:20px;font-family:-apple-system,system-ui,sans-serif;text-align:center;background:#fff3e0;color:#e65100;">
          <div style="font-size:48px;margin-bottom:16px;">🔥</div>
          <h2 style="margin:0 0 8px 0;font-size:20px;font-weight:600;">Errore fatale</h2>
          <p style="margin:0 0 4px 0;font-size:14px;color:#bf360c;">${error instanceof Error ? error.message : 'Errore sconosciuto'}</p>
          <p style="margin:0 0 20px 0;font-size:12px;color:#bf360c;">Controlla la console per i dettagli</p>
          <button onclick="location.reload()" style="padding:10px 24px;background:#e65100;color:white;border:none;border-radius:8px;font-size:14px;cursor:pointer;">
            🔄 Riprova
          </button>
        </div>
      `;
    }
  }
};

// ✅ REGISTRA GESTORI ERRORI GLOBALI
window.addEventListener('error', handleGlobalError);
window.addEventListener('unhandledrejection', handleUnhandledRejection);

// ✅ AVVIA L'APP SOLO DOPO CHE IL DOM È PRONTO
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  // DOM già pronto, avvia subito
  startApp();
}

// ✅ LOG PER LA BUILD (UTILE PER DEBUG)
console.log('📦 Build info:');
console.log('  - Data:', new Date().toISOString());
console.log('  - Vite:', import.meta.env.MODE || 'unknown');
console.log('  - Production:', import.meta.env.PROD ? '✅' : '❌');
console.log('  - Dev:', import.meta.env.DEV ? '✅' : '❌');
