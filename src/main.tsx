// ✅ MAIN.TSX - CON CATTURA ERRORI
import "./index.css";

console.log('🔍 main.tsx caricato');

// Funzione per loggare gli errori
window.addEventListener('error', function(e) {
  console.error('❌ Errore globale catturato:', e.message, e.filename, e.lineno);
  const root = document.getElementById('root');
  if (root) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed;
      bottom: 10px;
      left: 10px;
      right: 10px;
      background: rgba(220, 38, 38, 0.95);
      color: white;
      padding: 12px;
      border-radius: 8px;
      font-family: monospace;
      font-size: 12px;
      z-index: 99999;
      max-height: 200px;
      overflow: auto;
    `;
    errorDiv.textContent = `❌ ${e.message}`;
    root.appendChild(errorDiv);
  }
});

// Cattura anche errori non gestiti nelle Promise
window.addEventListener('unhandledrejection', function(e) {
  console.error('❌ Promise non gestita:', e.reason);
  const root = document.getElementById('root');
  if (root) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed;
      bottom: 10px;
      left: 10px;
      right: 10px;
      background: rgba(220, 38, 38, 0.95);
      color: white;
      padding: 12px;
      border-radius: 8px;
      font-family: monospace;
      font-size: 12px;
      z-index: 99999;
      max-height: 200px;
      overflow: auto;
    `;
    errorDiv.textContent = `⚠️ ${String(e.reason)}`;
    root.appendChild(errorDiv);
  }
});

const rootElement = document.getElementById('root');

if (rootElement) {
  console.log('✅ Root element trovato');
  try {
    // Crea il contenuto
    rootElement.innerHTML = '';
    
    const container = document.createElement('div');
    container.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background-color: #f0fdf4;
      font-family: sans-serif;
      padding: 20px;
    `;
    
    container.innerHTML = `
      <h1 style="color: #166534; font-size: 28px;">🌳 Test JavaScript Puro</h1>
      <p style="color: #4a5568; font-size: 16px;">Bottone funzionante con cattura errori</p>
      <p id="status" style="color: #6b7280; font-size: 14px; margin-top: 10px;">
        In attesa di azioni...
      </p>
      <button 
        onclick="document.getElementById('status').textContent = '✅ Bottone cliccato!';"
        style="margin-top: 20px; padding: 10px 20px; background: #166534; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px;"
      >
        Clicca per test (funziona!)
      </button>
      <div id="error-log" style="margin-top: 20px; padding: 10px; background: #1f2937; color: #fbbf24; border-radius: 8px; font-size: 12px; width: 100%; max-width: 400px; max-height: 150px; overflow: auto; text-align: left; font-family: monospace; display: none;">
      </div>
    `;
    
    rootElement.appendChild(container);
    
    console.log('✅ Contenuto renderizzato con JavaScript puro');
    
    // Log di completamento
    console.log('✅ App pronta - in attesa di errori');
    
  } catch (error) {
    console.error('❌ Errore durante il render:', error);
    rootElement.innerHTML = `
      <div style="padding: 20px; background: #fee2e2; border: 1px solid #dc2626; border-radius: 8px; margin: 20px; font-family: sans-serif;">
        <h2 style="color: #dc2626; margin-top: 0;">❌ Errore</h2>
        <pre style="background: #1f2937; color: #fbbf24; padding: 10px; border-radius: 4px; font-size: 12px; overflow: auto;">
          ${String(error)}
        </pre>
      </div>
    `;
  }
} else {
  console.error('❌ Root element non trovato!');
  document.body.innerHTML = '<h1 style="color:red;">❌ Root element non trovato</h1>';
}
