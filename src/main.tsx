// ✅ MAIN.TSX - RENDER CON TESTO
import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

console.log('🔍 main.tsx caricato');

const rootElement = document.getElementById('root');

if (rootElement) {
  console.log('✅ Root element trovato');
  try {
    // Crea il root
    const root = createRoot(rootElement);
    
    // Renderizza il componente
    root.render(<App />);
    
    console.log('✅ App renderizzata con successo!');
  } catch (error) {
    console.error('❌ Errore durante il render:', error);
    rootElement.innerHTML = `
      <div style="padding: 20px; background: #fee2e2; border: 1px solid #dc2626; border-radius: 8px; margin: 20px; font-family: sans-serif;">
        <h2 style="color: #dc2626; margin-top: 0;">❌ Errore di Render</h2>
        <pre style="background: #1f2937; color: #fbbf24; padding: 10px; border-radius: 4px; font-size: 12px; overflow: auto;">
          ${String(error)}
        </pre>
        <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #dc2626; color: white; border: none; border-radius: 8px; cursor: pointer;">
          🔄 Riprova
        </button>
      </div>
    `;
  }
} else {
  console.error('❌ Root element non trovato!');
  document.body.innerHTML = '<h1 style="color:red;">❌ Root element non trovato</h1>';
}
