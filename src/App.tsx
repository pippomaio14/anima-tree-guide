/ ✅ VERSIONE MINIMALE DI LOGIN PAGE - SENZA DIPENDENZE ESTERNE
// Questo file serve solo per testare se il componente base funziona

const LoginPage = () => {
  console.log('✅ LoginPage minimale renderizzata');
  
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      backgroundColor: '#f0fdf4',
      fontFamily: 'sans-serif',
      padding: '20px'
    }}>
      <h1 style={{ color: '#166534', fontSize: '28px', marginBottom: '10px' }}>
        🌳 Anima Tree Guide
      </h1>
      <p style={{ color: '#4a5568', fontSize: '16px' }}>
        Login Page (versione di test)
      </p>
      <div style={{ 
        marginTop: '20px', 
        padding: '20px', 
        backgroundColor: 'white', 
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '300px',
        textAlign: 'center'
      }}>
        <p style={{ color: '#6b7280' }}>
          Questa è una versione semplificata
        </p>
        <button 
          onClick={() => alert('Test click!')}
          style={{
            marginTop: '10px',
            padding: '10px 20px',
            backgroundColor: '#166534',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Clicca per test
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
