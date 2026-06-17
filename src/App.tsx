import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";

// ✅ COMPONENTE DI TEST PER AUTH PROVIDER
const TestWithAuth = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh', 
          padding: '20px', 
          fontFamily: 'sans-serif', 
          textAlign: 'center',
          backgroundColor: '#fef3c7',
          color: '#92400e'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔐</div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '600' }}>AuthProvider Funziona!</h1>
          <p style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#92400e' }}>
            AuthProvider è stato montato correttamente.
          </p>
          <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#6b7280' }}>
            Il problema non è in AuthProvider stesso.
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{ 
              padding: '10px 24px', 
              backgroundColor: '#92400e', 
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
      </AuthProvider>
    </BrowserRouter>
  );
};

function App() {
  console.log('🚀 App con AuthProvider avviata');
  return <TestWithAuth />;
}

export default App;
