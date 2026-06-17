import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// ✅ LOG SU SCHERMO - VISIBILE ANCHE SE CRASH
const showScreenLog = (message: string, isError: boolean = false) => {
  try {
    const root = document.getElementById('root');
    if (root) {
      const logDiv = document.createElement('div');
      logDiv.style.cssText = `
        position: fixed;
        bottom: 10px;
        left: 10px;
        right: 10px;
        background: ${isError ? 'rgba(255,0,0,0.9)' : 'rgba(0,0,0,0.8)'};
        color: ${isError ? '#fff' : '#0f0'};
        padding: 8px 12px;
        border-radius: 8px;
        font-family: monospace;
        font-size: 12px;
        z-index: 99999;
        max-height: 200px;
        overflow-y: auto;
        white-space: pre-wrap;
        word-break: break-all;
        pointer-events: none;
      `;
      logDiv.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
      root.appendChild(logDiv);
      
      // Limita a 10 log
      const logs = root.querySelectorAll('div[style*="position: fixed; bottom: 10px;"]');
      if (logs.length > 10) {
        logs[0].remove();
      }
    }
  } catch (e) {
    // Ignora errori di log
  }
};

// ✅ GESTIONE ERRORI CON LOG SU SCHERMO
const handleGlobalError = (event: ErrorEvent) => {
  const errorMsg = `❌ ERRORE: ${event.message}`;
  console.error(errorMsg, event);
  showScreenLog(errorMsg, true);
  showScreenLog(`📍 ${event.filename || 'unknown'}:${event.lineno || '?'}`, true);
  
  // Mostra messaggio all'utente
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;padding:20px;font-family:-apple-system,system-ui,sans-serif;text-align:center;background:#f8f9fa;color:#1a1a1a;">
        <div style="font-size:48px;margin-bottom:16px;">⚠️</div>
        <h2 style="margin:0 0 8px 0;font-size:20px;font-weight:600;">Errore durante l'avvio</h2>
        <p style="margin:0 0 4px 0;font-size:14px;color:#666;">${event.message || 'Errore sconosciuto'}</p>
        <p style="margin:0 0 20px 0;font-size:12px;color:#999;">${event.filename || ''} riga ${event.lineno || ''}</p>
        <button onclick="location.reload()" style="padding:10px 24px;background:#1976d2;color:white;border:none;border-radius:8px;font-size:14px;cursor:pointer;">
          🔄 Riprova
        </button>
      </div>
    `;
  }
  
  event.preventDefault();
  return true;
};

const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
  const errorMsg = `❌ PROMESSA NON GESTITA: ${event.reason}`;
  console.error(errorMsg, event);
  showScreenLog(errorMsg, true);
  event.preventDefault();
};

// ✅ FUNZIONE PER TESTARE STEP-BY-STEP
const testSteps = [
  '1. Avvio main.tsx',
  '2. Caricamento index.css',
  '3. Verifica root element',
  '4. Import App',
  '5. Creazione root',
  '6. Render App'
];

let currentStep = 0;

const logStep = (step: string) => {
  currentStep++;
  const msg = `✅ Step ${currentStep}/${testSteps.length}: ${step}`;
  console.log(msg);
  showScreenLog(msg);
};

// ✅ AVVIO CON STEP LOGGATI
const startApp = () => {
  try {
    logStep('Avvio main.tsx');
    
    // Importa index.css (già fatto all'inizio)
    logStep('Caricamento index.css');
    
    const rootElement = document.getElementById('root');
    logStep('Verifica root element');
    
    if (!rootElement) {
      throw new Error('Elemento root non trovato!');
    }
    
    logStep('Import App');
    // App è già importata all'inizio
    
    logStep('Creazione root');
    const root = createRoot(rootElement);
    
    logStep('Render App');
    root.render(<App />);
    
    showScreenLog('✅ APP AVVIATA CON SUCCESSO!');
    console.log('✅ App avviata con successo!');
    
  } catch (error) {
    const msg = `❌ ERRORE FATALE: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`;
    console.error(msg, error);
    showScreenLog(msg, true);
    showScreenLog(`📍 Stack: ${error instanceof Error ? error.stack : 'N/A'}`, true);
    
    const root = document.getElementById('root');
    if (root) {
      root.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;padding:20px;font-family:-apple-system,system-ui,sans-serif;text-align:center;background:#fff3e0;color:#e65100;">
          <div style="font-size:48px;margin-bottom:16px;">🔥</div>
          <h2 style="margin:0 0 8px 0;font-size:20px;font-weight:600;">Errore fatale</h2>
          <p style="margin:0 0 4px 0;font-size:14px;color:#bf360c;">${error instanceof Error ? error.message : 'Errore sconosciuto'}</p>
          <p style="margin:0 0 20px 0;font-size:12px;color:#bf360c;">Controlla i log in basso</p>
          <button onclick="location.reload()" style="padding:10px 24px;background:#e65100;color:white;border:none;border-radius:8px;font-size:14px;cursor:pointer;">
            🔄 Riprova
          </button>
        </div>
      `;
    }
  }
};

// ✅ REGISTRA GESTORI ERRORI
window.addEventListener('error', handleGlobalError);
window.addEventListener('unhandledrejection', handleUnhandledRejection);

// ✅ LOG AMBIENTE
console.log('📱 Ambiente:', {
  platform: navigator.platform,
  userAgent: navigator.userAgent,
  url: window.location.href,
  Capacitor: typeof window !== 'undefined' && window.Capacitor ? '✅ Presente' : '❌ Assente',
  isNative: typeof window !== 'undefined' && window.Capacitor?.isNativePlatform ? window.Capacitor.isNativePlatform() : false
});

// ✅ AVVIA
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
