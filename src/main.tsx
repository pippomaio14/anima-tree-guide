// ✅ MAIN.TSX - IMPORTA APP MA NON LA USA
import "./index.css";

// Questo import potrebbe causare il crash
// Mettiamolo in un try-catch per vedere se è lui il problema
try {
  console.log('🔍 Tentativo di importare App...');
  const App = await import('./App');
  console.log('✅ App importata con successo!');
} catch (error) {
  console.error('❌ Errore durante l\'import di App:', error);
  // Mostra l'errore a schermo
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="padding: 20px; background: #fee2e2; border: 1px solid #dc2626; border-radius: 8px; margin: 20px;">
        <h2 style="color: #dc2626;">❌ Errore di Import</h2>
        <p style="color: #6b7280;">Errore durante il caricamento di App:</p>
        <pre style="background: #1f2937; color: #fbbf24; padding: 10px; border-radius: 4px; font-size: 12px; overflow: auto;">
          ${String(error)}
        </pre>
      </div>
    `;
  }
}

// Mostra un messaggio di base (non usa App)
const root = document.getElementById('root');
if (root) {
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
        ${typeof App !== 'undefined' ? '✅ App è stata importata!' : '⏳ App non ancora importata'}
      </p>
    </div>
  `;
}
