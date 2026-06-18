import { AuthProvider } from "@/hooks/useAuth";

// ✅ APP CON SOLO AUTH PROVIDER (MOCK)
function App() {
  console.log('✅ App con mock AuthProvider');
  
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
        <h1 style={{ color: '#1e40af', fontSize: '24px' }}>🔐 AuthProvider Mock</h1>
        <p style={{ color: '#3b82f6' }}>Se vedi questo, il problema è in Supabase!</p>
      </div>
    </AuthProvider>
  );
}

export default App;
