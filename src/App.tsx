
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
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
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Switch>
            <Route path="/login" component={LoginPage} />
            <Route path="/">
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            </Route>
            <Route path="/clients">
              <ProtectedRoute>
                <Layout>
                  <ClientsPage />
                </Layout>
              </ProtectedRoute>
            </Route>
            <Route path="/products">
              <ProtectedRoute>
                <Layout>
                  <ProductsPage />
                </Layout>
              </ProtectedRoute>
            </Route>
            <Route path="/industries">
              <ProtectedRoute>
                <Layout>
                  <IndustriesPage />
                </Layout>
              </ProtectedRoute>
            </Route>
            <Route path="/categories">
              <ProtectedRoute>
                <Layout>
                  <CategoriesPage />
                </Layout>
              </ProtectedRoute>
            </Route>
            <Route path="/sales">
              <ProtectedRoute>
                <Layout>
                  <SalesPage />
                </Layout>
              </ProtectedRoute>
            </Route>
            <Route path="/financial">
              <ProtectedRoute>
                <Layout>
                  <FinancialPage />
                </Layout>
              </ProtectedRoute>
            </Route>
            <Route path="/financial/payment-methods">
              <ProtectedRoute>
                <Layout>
                  <PaymentMethodsPage />
                </Layout>
              </ProtectedRoute>
            </Route>
            <Route path="/financial/commission-rules">
              <ProtectedRoute>
                <Layout>
                  <CommissionRulesPage />
                </Layout>
              </ProtectedRoute>
            </Route>
            <Route path="/financial/receivables">
              <ProtectedRoute>
                <Layout>
                  <ReceivablesPage />
                </Layout>
              </ProtectedRoute>
            </Route>
            <Route path="/financial/saldo">
              <ProtectedRoute>
                <Layout>
                  <SaldoPage />
                </Layout>
              </ProtectedRoute>
            </Route>
            <Route path="/reports">
              <ProtectedRoute>
                <Layout>
                  <ReportsPage />
                </Layout>
              </ProtectedRoute>
            </Route>
            <Route>
              <ProtectedRoute>
                <Layout>
                  <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold mb-4">404</h1>
                      <p className="text-muted-foreground">Página não encontrada</p>
                    </div>
                  </div>
                </Layout>
              </ProtectedRoute>
            </Route>
          </Switch>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
