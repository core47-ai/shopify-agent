import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import OrderConfirmationDashboard from "./pages/OrderConfirmationDashboard";
import ReturnsManagementDashboard from "./pages/ReturnsManagementDashboard";
import CourierOptimizationDashboard from "./pages/CourierOptimizationDashboard";
import AddressVerificationDashboard from "./pages/AddressVerificationDashboard";
import AlternativeContactsDashboard from "./pages/AlternativeContactsDashboard";
import HighRiskAreasDashboard from "./pages/HighRiskAreasDashboard";
import FakeOrderDetectionDashboard from "./pages/FakeOrderDetectionDashboard";
import UnresponsiveCustomersDashboard from "./pages/UnresponsiveCustomersDashboard";
import SettingsDashboard from "./pages/SettingsDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/order-confirmation" element={<OrderConfirmationDashboard />} />
            <Route path="/dashboard/returns" element={<ReturnsManagementDashboard />} />
            <Route path="/dashboard/courier" element={<CourierOptimizationDashboard />} />
            <Route path="/dashboard/fraud" element={<AddressVerificationDashboard />} />
            <Route path="/dashboard/alternative-contacts" element={<AlternativeContactsDashboard />} />
            <Route path="/dashboard/high-risk-areas" element={<HighRiskAreasDashboard />} />
            <Route path="/dashboard/fake-order-detection" element={<FakeOrderDetectionDashboard />} />
            <Route path="/dashboard/unresponsive-customers" element={<UnresponsiveCustomersDashboard />} />
            <Route path="/dashboard/settings" element={<SettingsDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
