// ✅ COMPONENTE INDEX SEMPLIFICATO PER IL TEST
// Questo componente non ha dipendenze complesse e dovrebbe funzionare sempre.

const Index = () => {
  return (
    <div style={{ 
      padding: '40px 20px', 
      textAlign: 'center', 
      fontFamily: 'sans-serif',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8f9fa'
    }}>
      <h1 style={{ color: '#2d3748', marginBottom: '10px' }}>✅ Index Funziona!</h1>
      <p style={{ color: '#4a5568', fontSize: '16px' }}>
        Se vedi questo messaggio, Index è stato caricato correttamente.
      </p>
      <p style={{ color: '#718096', fontSize: '14px', marginTop: '20px' }}>
        Il problema è in uno dei componenti che Index importava (es. MobileLayout, BottomNav, o l'immagine hero).
      </p>
      <button 
        onClick={() => window.location.reload()}
        style={{ 
          marginTop: '30px', 
          padding: '10px 24px', 
          backgroundColor: '#4299e1', 
          color: 'white', 
          border: 'none', 
          borderRadius: '8px', 
          fontSize: '16px', 
          cursor: 'pointer' 
        }}
      >
        🔄 Ricarica
      </button>
    </div>
  );
};

export default Index;
