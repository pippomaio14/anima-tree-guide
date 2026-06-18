import { AuthProvider } from "@/hooks/useAuth";
import LoginPage from "./pages/LoginPage";

// ✅ LOG PER DEBUG
const bootLog = (message: string) => {
  try {
    const logEl = document.getElementById('boot-log');
    if (logEl) {
      logEl.innerHTML += `\n✅ [App] ${message}`;
      logEl.scrollTop = logEl.scrollHeight;
    }
    console.log(`[App] ${message}`);
  } catch (e) {}
};

function App() {
  bootLog('App avviata - versione senza routing');
  
  return (
    <AuthProvider>
      <LoginPage />
    </AuthProvider>
  );
}

export default App;
