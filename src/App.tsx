import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import SplashScreen from "@/components/SplashScreen";

// ✅ COMPONENTE DI TEST CON SPLASHSCREEN
const TestWithSplash = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* 👇 AGGIUNGI SPLASHSCREEN QUI */}
        <SplashScreen />
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh', 
          padding: '20px', 
          fontFamily: 'sans-serif', 
          textAlign: 'center',
          backgroundColor: '#d1fae5',
          color: '#065f46'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>💚</div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '600' }}>SplashScreen Funziona!</h1>
          <p style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#065f46' }}>
            SplashScreen è stato montato correttamente.
          </p>
          <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#6b7280' }}>
            Il problema non è in SplashScreen.
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{ 
              padding: '10px 24px', 
              backgroundColor: '#065f46', 
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
  console.log('🚀 App con SplashScreen avviata');
  return <TestWithSplash />;
}

export default App;
