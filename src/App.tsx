import { BrowserRouter } from "react-router-dom";

// Componente di test che usa il router
const TestWithRouter = () => {
  return (
    <BrowserRouter>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh', 
        padding: '20px', 
        fontFamily: 'sans-serif', 
        textAlign: 'center',
        backgroundColor: '#e0f2fe',
        color: '#0369a1'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🧭</div>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '600' }}>Router Funziona!</h1>
        <p style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#0369a1' }}>
          BrowserRouter è stato montato correttamente.
        </p>
        <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#6b7280' }}>
          Il problema non è nel Router.
        </p>
        <button 
          onClick={() => window.location.reload()}
          style={{ 
            padding: '10px 24px', 
            backgroundColor: '#0369a1', 
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
    </BrowserRouter>
  );
};

function App() {
  console.log('🚀 App con Router avviata');
  return <TestWithRouter />;
}

export default App;
