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
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

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

// ✅ COMPONENTE DI LOADING
const LoadingScreen = () => {
  bootLog('LoadingScreen renderizzato');
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <div style={{ fontSize: '48px' }}>🌳</div>
      <div style={{ color: '#166534', fontSize: '18px' }}>Caricamento...</div>
    </div>
  );
};

// ✅ COMPONENTE APP ROUTER
const AppRouter = () => {
  const { user, loading } = useAuth();
  
  bootLog(`AppRouter: loading=${loading}, user=${user ? 'presente' : 'null'}`);
  
  // Mostra loading mentre l'autenticazione è in corso
  if (loading) {
    bootLog('Mostro loading screen');
    return <LoadingScreen />;
  }
  
  bootLog(`Mostro routes: ${user ? 'Index' : 'LoginPage'}`);
  
  return (
    <Routes>
      <Route path="/login" element={
        !user ? <LoginPage /> : <Navigate to="/" replace />
      } />
      <Route path="/register" element={
        !user ? <RegisterPage /> : <Navigate to="/" replace />
      } />
      <Route path="/legal/:slug" element={<LegalPage />} />
      <Route path="/" element={
        user ? <Index /> : <Navigate to="/login" replace />
      } />
      <Route path="/trees" element={
        user ? <TreeSearchPage /> : <Navigate to="/login" replace />
      } />
      <Route path="/events" element={
        user ? <EventsPage /> : <Navigate to="/login" replace />
      } />
      <Route path="/articles" element={
        user ? <ArticlesPage /> : <Navigate to="/login" replace />
      } />
      <Route path="/park-info" element={
        user ? <ParkInfoPage /> : <Navigate to="/login" replace />
      } />
      <Route path="/volunteers" element={
        user ? <VolunteersPage /> : <Navigate to="/login" replace />
      } />
      <Route path="/classify" element={
        user ? <ClassifyPage /> : <Navigate to="/login" replace />
      } />
      <Route path="/games" element={
        user ? <GamesPage /> : <Navigate to="/login" replace />
      } />
      <Route path="/games/quiz" element={
        user ? <QuizPage /> : <Navigate to="/login" replace />
      } />
      <Route path="/games/challenge" element={
        user ? <ChallengePage /> : <Navigate to="/login" replace />
      } />
      <Route path="/games/tree-guess" element={
        user ? <TreeGuessPage /> : <Navigate to="/login" replace />
      } />
      <Route path="/profile" element={
        user ? <ProfilePage /> : <Navigate to="/login" replace />
      } />
      <Route path="/admin" element={
        user ? <AdminPage /> : <Navigate to="/login" replace />
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  bootLog('App render avviato');
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <SplashScreen />
        <PermissionsRequester />
        <BrowserRouter>
          <AuthProvider>
            <AppRouter />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
