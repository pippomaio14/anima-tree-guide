// ✅ MAIN.TSX - VERSIONE DEFINITIVA (senza require, senza top-level await)
import "./index.css";

console.log('🔍 main.tsx caricato');

// Funzione che carica App dinamicamente usando import()
const loadApp = () => {
  console.log('🔍 Tentativo di importare App...');
  return import('./App')
    .then((module) => {
      console.log('✅ App importata con successo!', module);
      return module.default;
    })
    .catch((error) => {
      console.error('❌ Errore durante l\'import di App:', error);
      throw error;
    });
};

// Esegui il caricamento
const root = document.getElementById('root');
if (root) {
  // Mostra un messaggio di caricamento
  root.innerHTML = `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background-color: #f0fdf4;
      font-family: sans-serif;
      padding: 20px;
    ">
      <h1 style="color: #166534; font-size: 28px;">⏳ Caricamento...</h1>
      <p style="color: #4a5568;">Sto caricando l'applicazione...</p>
      <div style="margin-top: 20px; width: 40px; height: 40px; border: 4px solid #e5e7eb; border-top: 4px solid #166534; border-radius: 50%; animation: spin 1s linear infinite;"></div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    </div>
  `;

  // Carica App e la renderizza
  loadApp()
    .then((App) => {
      console.log('✅ App caricata, avvio render');
      // Qui renderizzerai App con React
      // Per ora, mostriamo un messaggio
      root.innerHTML = `
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background-color: #dbeafe;
          font-family: sans-serif;
          padding: 20px;
        ">
          <h1 style="color: #1e40af; font-size: 28px;">✅ App Caricata!</h1>
          <p style="color: #3b82f6;">App è stata caricata con successo.</p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 10px;">
            Ora possiamo renderizzare App con React.
          </p>
          <button 
            onclick="document.getElementById('app-details').style.display='block'"
            style="margin-top: 20px; padding: 8px 16px; background: #1e40af; color: white; border: none; border-radius: 6px; cursor: pointer;"
          >
            Dettagli
          </button>
          <pre id="app-details" style="display: none; margin-top: 20px; padding: 10px; background: #1f2937; color: #fbbf24; border-radius: 4px; font-size: 12px; text-align: left; overflow: auto; max-width: 100%;">
            ${String(App)}
          </pre>
        </div>
      `;
    })
    .catch((error) => {
      console.error('❌ Errore durante il caricamento:', error);
      root.innerHTML = `
        <div style="padding: 20px; background: #fee2e2; border: 1px solid #dc2626; border-radius: 8px; margin: 20px; font-family: sans-serif;">
          <h2 style="color: #dc2626; margin-top: 0;">❌ Errore di Caricamento</h2>
          <p style="color: #6b7280;">Errore durante il caricamento di App:</p>
          <pre style="background: #1f2937; color: #fbbf24; padding: 10px; border-radius: 4px; font-size: 12px; overflow: auto; white-space: pre-wrap; word-break: break-all;">
            ${String(error)}
          </pre>
          <button 
            onclick="location.reload()"
            style="margin-top: 20px; padding: 10px 20px; background: #dc2626; color: white; border: none; border-radius: 8px; cursor: pointer;"
          >
            🔄 Riprova
          </button>
        </div>
      `;
    });
}
