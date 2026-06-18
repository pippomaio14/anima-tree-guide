// ✅ APP.TSX - VERSIONE SUPER MINIMALE (NESSUN IMPORT)
// Questo file non importa nulla - niente AuthProvider, niente router, niente nulla

function App() {
  console.log('✅ App renderizzata');
  return "Ciao mondo!";
}

export default App;
E poi main.tsx con questa versione che renderizza App:

tsx
// ✅ MAIN.TSX - RENDER DI APP MINIMALE
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

console.log('🔍 main.tsx caricato');

const rootElement = document.getElementById('root');
if (rootElement) {
  console.log('✅ Root trovato');
  try {
    const root = createRoot(rootElement);
    root.render(App());
    console.log('✅ App renderizzata');
  } catch (error) {
    console.error('❌ Errore render:', error);
    rootElement.innerHTML = `
      <div style="padding: 20px; color: red; background: #fee2e2; border-radius: 8px; margin: 20px;">
        <h2>❌ Errore</h2>
        <pre style="background: #1f2937; color: #fbbf24; padding: 10px; border-radius: 4px;">
          ${String(error)}
        </pre>
      </div>
    `;
  }
}
