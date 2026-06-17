import { createClient } from '@supabase/supabase-js';

// ✅ LOG DELLE VARIABILI D'AMBIENTE
console.log('🔍 [Supabase] Variabili d\'ambiente:');
console.log('  - URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('  - ANON KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Presente' : '❌ Manca');

// Verifica che le variabili esistano
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ [Supabase] Variabili d\'ambiente mancanti!');
  console.error('  - URL:', supabaseUrl);
  console.error('  - ANON KEY:', supabaseAnonKey ? 'presente' : 'mancante');
  
  // Mostra un errore visibile
  const logEl = document.getElementById('boot-log');
  if (logEl) {
    logEl.innerHTML += '\n❌ [Supabase] VARIABILI AMBIENTE MANCANTI!';
    logEl.innerHTML += '\n   Verifica il file .env';
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('✅ [Supabase] Client inizializzato');
