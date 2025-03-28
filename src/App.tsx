import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AlertsProvider } from "./context/AlertsContext";
import { AuthProvider } from "./context/AuthContext";
import { NotificationsProvider } from "./context/NotificationsContext";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Badges from "./pages/Badges";
import UserDashboard from "./pages/UserDashboard";
import NotFound from "./pages/NotFound";
import { store, persistor } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <TooltipProvider>
          <AuthProvider>
            <AlertsProvider>
              <NotificationsProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/badges" element={<Badges />} />
                    <Route path="/dashboard" element={<UserDashboard />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </NotificationsProvider>
            </AlertsProvider>
          </AuthProvider>
        </TooltipProvider>
      </PersistGate>
    </Provider>
  </QueryClientProvider>
);

export default App;
