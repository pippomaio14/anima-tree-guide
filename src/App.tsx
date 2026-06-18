import { AuthProvider } from "@/hooks/useAuth";

function App() {
  console.log('✅ App renderizzata');
  
  // Usa un children semplice
  return (
    <AuthProvider>
      <h1 style={{ color: '#1e40af', fontSize: '24px', textAlign: 'center', padding: '40px' }}>
        🚀 App con AuthProvider funziona!
      </h1>
    </AuthProvider>
  );
}

export default App;
