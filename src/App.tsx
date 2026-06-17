import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import TreeSearchPage from "./pages/TreeSearchPage";
import EventsPage from "./pages/EventsPage";
import ArticlesPage from "./pages/ArticlesPage";
import ParkInfoPage from "./pages/ParkInfoPage";
import VolunteersPage from "./pages/VolunteersPage";
import ClassifyPage from "./pages/ClassifyPage";
import GamesPage from "./pages/GamesPage";
import QuizPage from "./pages/QuizPage";
import ChallengePage from "./pages/ChallengePage";
import TreeGuessPage from "./pages/TreeGuessPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import SplashScreen from "./components/SplashScreen";
import LegalPage from "./pages/LegalPage";
import PermissionsRequester from "./components/PermissionsRequester";

// ✅ LOG SU SCHERMO (usa lo stesso sistema di main.tsx)
const bootLog = (message: string, type: 'info' | 'warn' | 'error' = 'info') => {
  try {
    const logEl = document.getElementById('boot-log');
    if (logEl) {
      const prefix = type === 'error' ? '❌' : type === 'warn' ? '⚠️' : '✅';
      logEl.innerHTML += `\n${prefix} [App] ${message}`;
      logEl.scrollTop = logEl.scrollHeight;
    }
    console.log(`[App] ${message}`);
  } catch (e) {}
};

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const App = () => {
  bootLog('App render avviato');
  
  // ✅ LOG DI OGNI COMPONENTE IMPORTANTE
  bootLog('Creazione QueryClientProvider');
  const queryClientProvider = (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <SplashScreen />
        <PermissionsRequester />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
              <Route path="/legal/:slug" element={<LegalPage />} />
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/trees" element={<ProtectedRoute><TreeSearchPage /></ProtectedRoute>} />
              <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
              <Route path="/articles" element={<ProtectedRoute><ArticlesPage /></ProtectedRoute>} />
              <Route path="/park-info" element={<ProtectedRoute><ParkInfoPage /></ProtectedRoute>} />
              <Route path="/volunteers" element={<ProtectedRoute><VolunteersPage /></ProtectedRoute>} />
              <Route path="/classify" element={<ProtectedRoute><ClassifyPage /></ProtectedRoute>} />
              <Route path="/games" element={<ProtectedRoute><GamesPage /></ProtectedRoute>} />
              <Route path="/games/quiz" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
              <Route path="/games/challenge" element={<ProtectedRoute><ChallengePage /></ProtectedRoute>} />
              <Route path="/games/tree-guess" element={<ProtectedRoute><TreeGuessPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );

  bootLog('App render completato - ritorno JSX');
  return queryClientProvider;
};

// ✅ ESPORT CON LOG
bootLog('App esportata');
export default App;
