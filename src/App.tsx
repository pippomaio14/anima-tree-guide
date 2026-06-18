import { AuthProvider } from "@/hooks/useAuth";

function App() {
  console.log('✅ App con AuthProvider minimale');
  return (
    <AuthProvider>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        backgroundColor: '#dbeafe',
        fontFamily: 'sans-serif',
        padding: '20px'
      }}>
        <h1 style={{ color: '#1e40af', fontSize: '24px' }}>🔐 AuthProvider Funziona!</h1>
        <p style={{ color: '#3b82f6' }}>Il provider è stato montato correttamente.</p>
      </div>
    </AuthProvider>
  );
}

export default App;
