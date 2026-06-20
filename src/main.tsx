// ✅ MAIN.TSX - SENZA REACT (SOLO JAVASCRIPT)
import "./index.css";

console.log('🔍 main.tsx caricato');

const rootElement = document.getElementById('root');

if (rootElement) {
  console.log('✅ Root element trovato');
  try {
    // Svuota il root
    rootElement.innerHTML = '';
    
    // Crea un elemento di testo semplice
    const textElement = document.createElement('div');
    textElement.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background-color: #f0fdf4;
      font-family: sans-serif;
      padding: 20px;
    `;
    
    // Aggiungi contenuto
    textElement.innerHTML = `
      <h1 style="color: #166534; font-size: 28px;">🌳 Test JavaScript Puro</h1>
      <p style="color: #4a5568; font-size: 16px;">Questo è solo JavaScript, senza React</p>
      <p style="color: #6b7280; font-size: 14px; margin-top: 10px;">
        Se vedi questo, il problema è in React
      </p>
      <button 
        onclick="alert('Il pulsante funziona!')"
        style="margin-top: 20px; padding: 10px 20px; background: #166534; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px;"
      >
        Clicca per test
      </button>
    `;
    
    // Aggiungi al DOM
    rootElement.appendChild(textElement);
    
    console.log('✅ Contenuto renderizzato con JavaScript puro');
    
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
