import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// ✅ FUNZIONE PER LOGGARE SU SCHERMO (USA IL DIV ESPOSTO DA HTML)
const bootLog = (message: string, type: 'info' | 'warn' | 'error' = 'info') => {
  try {
    const logEl = document.getElementById('boot-log');
    if (logEl) {
      const prefix = type === 'error' ? '❌' : type === 'warn' ? '⚠️' : '✅';
      const colorClass = type === 'error' ? 'error' : type === 'warn' ? 'warn' : 'info';
      logEl.innerHTML += `\n${prefix} [${new Date().toLocaleTimeString()}] ${message}`;
      logEl.className = colorClass;
      logEl.scrollTop = logEl.scrollHeight;
    }
    console.log(`[BootLog] ${message}`);
  } catch (e) {
    // Ignora
  }
};

// ✅ LOG SUBITO
bootLog('main.tsx caricato');

// ✅ GESTIONE ERRORI CON LOG
window.addEventListener('error', (event) => {
  bootLog(`ERRORE: ${event.message}`, 'error');
  bootLog(`📍 ${event.filename}:${event.lineno}`, 'error');
  console.error('Global error:', event);
});

window.addEventListener('unhandledrejection', (event) => {
  bootLog(`Promise non gestita: ${event.reason}`, 'warn');
  console.error('Unhandled rejection:', event);
});

// ✅ AVVIO CON STEP
const startApp = () => {
  try {
    bootLog('Avvio startApp()');
    
    const rootElement = document.getElementById('root');
    bootLog(`Root element: ${rootElement ? 'trovato' : 'NON TROVATO'}`);
    
    if (!rootElement) {
      throw new Error('Root element non trovato!');
    }
    
    bootLog('Creazione root React');
    const root = createRoot(rootElement);
    
    bootLog('Render App');
    root.render(<App />);
    
    bootLog('✅ APP AVVIATA!');
    
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Errore sconosciuto';
    bootLog(`💥 FATALE: ${msg}`, 'error');
    if (error instanceof Error && error.stack) {
      bootLog(`Stack: ${error.stack.substring(0, 100)}...`, 'error');
    }
    console.error('Fatal error:', error);
  }
};

// ✅ AVVIO
bootLog('Preparazione avvio...');

if (document.readyState === 'loading') {
  bootLog('DOM in caricamento, attendo...');
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  bootLog('DOM pronto, avvio subito');
  startApp();
}

bootLog('main.tsx eseguito completamente');
