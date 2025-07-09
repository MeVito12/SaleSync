
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
// Temporarily using mock auth for testing
import { MockAuthProvider } from "./contexts/MockAuthContext";
// import { AuthProvider } from "./contexts/AuthContext";
// import { ProtectedRoute } from "./components/ProtectedRoute";
// import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ClientsPage from "./pages/ClientsPage";
import ProductsPage from "./pages/ProductsPage";
import SalesPage from "./pages/SalesPage";
import FinancialPage from "./pages/FinancialPage";
import PaymentMethodsPage from "./pages/PaymentMethodsPage";
import CommissionRulesPage from "./pages/CommissionRulesPage";
import ReceivablesPage from "./pages/ReceivablesPage";
import SaldoPage from "./pages/SaldoPage";
import ReportsPage from "./pages/ReportsPage";
import IndustriesPage from "./pages/IndustriesPage";
import CategoriesPage from "./pages/CategoriesPage";
import Layout from "./components/Layout";
import { useState } from "react";

const App = () => {
  // Create QueryClient inside component to ensure proper React context
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MockAuthProvider>
          <Toaster />
          <Sonner />
          <Switch>
          {/* Temporarily removed login route */}
          <Route path="/">
            <Layout>
              <Dashboard />
            </Layout>
          </Route>
          <Route path="/clients">
            <Layout>
              <ClientsPage />
            </Layout>
          </Route>
          <Route path="/products">
            <Layout>
              <ProductsPage />
            </Layout>
          </Route>
          <Route path="/industries">
            <Layout>
              <IndustriesPage />
            </Layout>
          </Route>
          <Route path="/categories">
            <Layout>
              <CategoriesPage />
            </Layout>
          </Route>
          <Route path="/sales">
            <Layout>
              <SalesPage />
            </Layout>
          </Route>
          <Route path="/financial">
            <Layout>
              <FinancialPage />
            </Layout>
          </Route>
          <Route path="/financial/payment-methods">
            <Layout>
              <PaymentMethodsPage />
            </Layout>
          </Route>
          <Route path="/financial/commission-rules">
            <Layout>
              <CommissionRulesPage />
            </Layout>
          </Route>
          <Route path="/financial/receivables">
            <Layout>
              <ReceivablesPage />
            </Layout>
          </Route>
          <Route path="/financial/saldo">
            <Layout>
              <SaldoPage />
            </Layout>
          </Route>
          <Route path="/reports">
            <Layout>
              <ReportsPage />
            </Layout>
          </Route>
          <Route>
            <Layout>
              <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                  <h1 className="text-4xl font-bold mb-4">404</h1>
                  <p className="text-muted-foreground">Página não encontrada</p>
                </div>
              </div>
            </Layout>
          </Route>
        </Switch>
        </MockAuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
