// ✅ MAIN.TSX - IMPORTA APP MA NON LA USA
import "./index.css";

console.log('🔍 main.tsx caricato');

// Funzione che carica App e cattura qualsiasi errore
const loadApp = () => {
  console.log('🔍 Tentativo di importare App...');
  return import('./App')
    .then((module) => {
      console.log('✅ App importata con successo!', module);
      // Non facciamo nulla con App - solo import
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
  // Mostra un messaggio
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
      console.log('✅ App caricata, mostro successo');
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
      
      // Aggiungi un pulsante per testare il render
      const button = document.createElement('button');
      button.textContent = '📱 Renderizza App';
      button.style.cssText = `
        margin-top: 20px;
        padding: 12px 24px;
        background: #166534;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        cursor: pointer;
      `;
      button.onclick = () => {
        alert('Il pulsante funziona! Ora possiamo renderizzare App.');
      };
      root.appendChild(button);
    })
    .catch((error) => {
      console.error('❌ Errore durante il caricamento:', error);
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
