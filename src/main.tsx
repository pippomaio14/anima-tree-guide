// ✅ MAIN.TSX - SOLO IMPORT, NESSUN PULSANTE
import "./index.css";

console.log('🔍 main.tsx caricato');

// Funzione che carica App
const loadApp = () => {
  console.log('🔍 Tentativo di importare App...');
  return import('./App')
    .then((module) => {
      console.log('✅ App importata con successo!', module);
      return module;
    })
    .catch((error) => {
      console.error('❌ Errore durante l\'import di App:', error);
      throw error;
    });
};

// Esegui il caricamento
const root = document.getElementById('root');
if (root) {
  // Mostra un messaggio statico - senza pulsanti
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
      <h1 style="color: #166534; font-size: 28px;">⏳ Test Import</h1>
      <p style="color: #4a5568;">Sto importando App...</p>
      <div id="import-status" style="margin-top: 20px; padding: 10px; background: #e5e7eb; border-radius: 8px; width: 100%; max-width: 400px; text-align: center;">
        <span style="color: #6b7280;">In attesa...</span>
      </div>
    </div>
  `;

  // Carica App
  loadApp()
    .then((module) => {
      console.log('✅ App caricata');
      const statusEl = document.getElementById('import-status');
      if (statusEl) {
        statusEl.innerHTML = `
          <span style="color: #166534; font-weight: bold;">✅ App importata con successo!</span>
          <br>
          <span style="color: #6b7280; font-size: 12px;">
            ${Object.keys(module).join(', ')}
          </span>
        `;
      }
      console.log('✅ Test completato - nessun crash!');
    })
    .catch((error) => {
      console.error('❌ Errore:', error);
      const statusEl = document.getElementById('import-status');
      if (statusEl) {
        statusEl.innerHTML = `
          <span style="color: #dc2626; font-weight: bold;">❌ Errore di import</span>
          <br>
          <pre style="background: #1f2937; color: #fbbf24; padding: 10px; border-radius: 4px; font-size: 12px; overflow: auto; text-align: left; margin-top: 10px;">
            ${String(error)}
          </pre>
        `;
      }
    });
}
