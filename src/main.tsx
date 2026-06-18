// ✅ MAIN.TSX - SENZA TOP-LEVEL AWAIT
import "./index.css";

console.log('🔍 main.tsx caricato');

// Importa App in modo sincrono (non usare await)
let App: any = null;
let importError: any = null;

try {
  // Import sincrono - non usare await al top level
  App = require('./App').default;
  console.log('✅ App importata con successo!');
} catch (error) {
  console.error('❌ Errore durante l\'import di App:', error);
  importError = error;
}

// Mostra un messaggio a schermo
const root = document.getElementById('root');
if (root) {
  if (importError) {
    root.innerHTML = `
      <div style="padding: 20px; background: #fee2e2; border: 1px solid #dc2626; border-radius: 8px; margin: 20px;">
        <h2 style="color: #dc2626;">❌ Errore di Import</h2>
        <p style="color: #6b7280;">Errore durante il caricamento di App:</p>
        <pre style="background: #1f2937; color: #fbbf24; padding: 10px; border-radius: 4px; font-size: 12px; overflow: auto;">
          ${String(importError)}
        </pre>
      </div>
    `;
  } else {
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
        <h1 style="color: #166534; font-size: 28px;">✅ Test Import</h1>
        <p style="color: #4a5568;">Il file main.tsx è stato caricato.</p>
        <p style="color: #6b7280; font-size: 14px; margin-top: 10px;">
          ✅ App è stata importata!
        </p>
        <button 
          onclick="document.getElementById('app-root').style.display='block'"
          style="margin-top: 20px; padding: 10px 20px; background: #166534; color: white; border: none; border-radius: 8px; cursor: pointer;"
        >
          Mostra App
        </button>
        <div id="app-root" style="display: none; margin-top: 20px; width: 100%;">
          ${App ? 'App è pronta per essere renderizzata' : 'App non disponibile'}
        </div>
      </div>
    `;
  }
}
