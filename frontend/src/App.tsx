import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import DashboardPage from "./pages/DashboardPage";
import Profile from "./pages/Profile";
import JWTDecoder from "./pages/JWTDecoder";
import APIReference from "./pages/APIReference";
import Security from "./pages/Security";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/jwt-decoder" element={<JWTDecoder />} />
              <Route path="/api-reference" element={<APIReference />} />
              <Route path="/security" element={<Security />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
