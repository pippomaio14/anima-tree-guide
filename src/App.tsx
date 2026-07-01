import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { PushNotifications } from "@capacitor/push-notifications";
import { Capacitor } from "@capacitor/core";
import { supabase } from "@/integrations/supabase/client";
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

const queryClient = new QueryClient();

// ✅ FUNZIONE PER REGISTRARE IL TOKEN SU SUPABASE
const savePushToken = async (userId: string, token: string) => {
  try {
    console.log('📱 Salvataggio token push per utente:', userId);
    
    // Verifica se esiste già un token per questo utente
    const { data: existing, error: findError } = await supabase
      .from('push_tokens')
      .select('id')
      .eq('user_id', userId)
      .eq('token', token)
      .maybeSingle();
    
    if (findError && findError.code !== 'PGRST116') {
      console.error('❌ Errore verifica token:', findError);
      return;
    }
    
    if (existing) {
      console.log('✅ Token già presente per questo utente');
      return;
    }
    
    // Salva il nuovo token
    const { error: insertError } = await supabase
      .from('push_tokens')
      .insert({
        user_id: userId,
        token: token,
        platform: Capacitor.getPlatform(),
        created_at: new Date().toISOString(),
      });
    
    if (insertError) {
      console.error('❌ Errore salvataggio token:', insertError);
    } else {
      console.log('✅ Token push salvato con successo!');
    }
  } catch (err) {
    console.error('❌ Errore savePushToken:', err);
  }
};

// ✅ COMPONENTE PER GESTIRE LE NOTIFICHE PUSH
const PushNotificationHandler = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const setupPushNotifications = async () => {
      // Solo su dispositivi nativi (Android/iOS)
      if (!Capacitor.isNativePlatform()) {
        console.log('🌐 Web: notifiche push non disponibili');
        return;
      }

      try {
        console.log('📱 Inizializzazione notifiche push...');

        // 1. Richiedi i permessi
        let permStatus = await PushNotifications.checkPermissions();
        console.log('📱 Stato permessi:', permStatus);

        if (permStatus.receive === 'prompt') {
          permStatus = await PushNotifications.requestPermissions();
          console.log('📱 Richiesta permessi:', permStatus);
        }

        if (permStatus.receive !== 'granted') {
          console.warn('⚠️ Permesso notifiche negato');
          return;
        }

        // 2. Registra il dispositivo
        await PushNotifications.register();
        console.log('📱 Dispositivo registrato per notifiche push');

        // 3. Ascolta il token di registrazione
        PushNotifications.addListener('registration', async (token) => {
          console.log('📱 Token FCM ricevuto:', token.value);
          
          // Se l'utente è loggato, salva il token
          if (user?.id) {
            await savePushToken(user.id, token.value);
          } else {
            console.log('⏳ Utente non loggato, token salvato al login');
            // Salva il token localmente per salvarlo dopo il login
            localStorage.setItem('pending_push_token', token.value);
          }
        });

        // 4. Ascolta gli errori di registrazione
        PushNotifications.addListener('registrationError', (error) => {
          console.error('❌ Errore registrazione push:', error);
        });

        // 5. Ascolta le notifiche ricevute (quando l'app è in primo piano)
        PushNotifications.addListener('pushNotificationReceived', (notification) => {
          console.log('📨 Notifica ricevuta in primo piano:', notification);
          // Qui puoi mostrare un toast o aggiornare la UI
        });

        // 6. Ascolta quando l'utente apre una notifica
        PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
          console.log('🔔 Notifica aperta:', notification);
          // Naviga alla pagina appropriata in base al payload
          const data = notification.notification.data;
          if (data?.route) {
            navigate(data.route);
          } else if (data?.eventId) {
            navigate(`/events/${data.eventId}`);
          } else if (data?.articleId) {
            navigate(`/articles/${data.articleId}`);
          }
        });

      } catch (error) {
        console.error('❌ Errore setup notifiche push:', error);
      }
    };

    setupPushNotifications();

    // ✅ Se l'utente si logga e c'è un token pendente, salvalo
    if (user?.id) {
      const pendingToken = localStorage.getItem('pending_push_token');
      if (pendingToken) {
        console.log('📱 Salvataggio token pendente per utente:', user.id);
        savePushToken(user.id, pendingToken);
        localStorage.removeItem('pending_push_token');
      }
    }

    return () => {
      // Cleanup listeners quando il componente viene smontato
      PushNotifications.removeAllListeners().catch(() => {});
    };
  }, [user, navigate]);

  return null;
};

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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SplashScreen />
      <PermissionsRequester />
      <BrowserRouter>
        <AuthProvider>
          <PushNotificationHandler />
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

export default App;
