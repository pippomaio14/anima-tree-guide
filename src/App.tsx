import { useEffect } from "react";

// ✅ COMPONENTE DI TEST SUPER SEMPLICE
const TestApp = () => {
  useEffect(() => {
    console.log('✅ TestApp montato');
    // Scrivi un log anche nel DOM
    const logEl = document.getElementById('boot-log');
    if (logEl) {
      logEl.innerHTML += '\n✅ [TestApp] COMPONENTE MONTATO CON SUCCESSO!';
    }
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', 
      padding: '20px', 
      fontFamily: 'sans-serif', 
      textAlign: 'center',
      backgroundColor: '#f0fdf4',
      color: '#166534'
    }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
      <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '600' }}>Test Funziona!</h1>
      <p style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#166534' }}>
        L'app base funziona su Android!
      </p>
      <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#6b7280' }}>
        Il problema è nei componenti di routing o in AuthProvider.
      </p>
      <button 
        onClick={() => window.location.reload()}
        style={{ 
          padding: '10px 24px', 
          backgroundColor: '#166534', 
          color: 'white', 
          border: 'none', 
          borderRadius: '8px', 
          fontSize: '14px', 
          cursor: 'pointer'
        }}
      >
        🔄 Ricarica
      </button>
    </div>
  );
};

// ✅ APP SEMPLIFICATA - SENZA ROUTER, SENZA AUTH, SENZA NULLA
function App() {
  // Log immediato
  console.log('🚀 App semplificata avviata');
  const logEl = document.getElementById('boot-log');
  if (logEl) {
    logEl.innerHTML += '\n🚀 [App] Avvio app semplificata';
  }
  
  return <TestApp />;
}

export default App;
