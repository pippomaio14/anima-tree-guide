import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log('🚀 main.tsx caricato - versione React');

const rootElement = document.getElementById('root');

if (rootElement) {
  console.log('✅ Root element trovato');
  try {
    const root = createRoot(rootElement);
    root.render(<App />);
    console.log('✅ App renderizzata con React');
  } catch (error) {
    console.error('❌ Errore durante il render:', error);
    rootElement.innerHTML = `
      <div style="padding: 20px; background: #fee2e2; border: 1px solid #dc2626; border-radius: 8px; margin: 20px; font-family: sans-serif;">
        <h2 style="color: #dc2626; margin-top: 0;">❌ Errore di Render</h2>
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
