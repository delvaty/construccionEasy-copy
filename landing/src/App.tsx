import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Landing components
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Advantages from "./components/Advantages";
import Process from "./components/Process";
import Banking from "./components/Banking";
import Guide from "./components/Guide";
import Pricing from "./components/Pricing";
import Footer from "./components/Footer";
import PolandMap from "./components/PolandMap";
import Pesel from "./components/Pesel";

// Landing pages
import LoginPage from "./pages/LoginPage";
import ContactPage from "./pages/ContactPage";
import ServiciosPage from "./pages/ServiciosPage";
import GuiaPage from "./pages/GuiaPage";
import BankingPage from "./pages/BankingPage";
import RegisterPage from "./pages/RegisterPage";
import Form from "./pages/Form";

// Admin components
import AdminNavbar from "./components/AdminNavbar";

// Admin pages
import HomePage from "./pages/dashboard/HomePage";
import DocumentsPage from "./pages/dashboard/DocumentsPage";
import TicketsPage from "./pages/dashboard/TicketsPage";
import PaymentsPage from "./pages/dashboard/PaymentsPage";
import ProfilePage from "./pages/dashboard/ProfilePage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ClientsManagement from "./pages/admin/ClientsManagement";
import ClientDetail from "./pages/admin/ClientDetail";
import ProcessManagement from "./pages/admin/ProcessManagement";
import AdminTickets from "./pages/admin/AdminTickets";
import PaymentsManagement from "./pages/admin/PaymentsManagement";

// Auth context (usando el AuthProvider del proyecto Landing)
import { AuthProvider, useAuth } from "./context/AuthContext";
import NavbarClient from "./components/NavbarClient";
import ClientDashboard from "./pages/dashboard/HomePage";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  isAdmin?: boolean;
}

// Componente de protección de rutas para el dashboard
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { user, isAdmin } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Componente de Layout para el Dashboard
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, isAdmin = false }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {isAdmin ? <AdminNavbar /> : <NavbarClient dashboard />}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

function App() {
  const ClientDashboardWrapper = () => {
    const { user } = useAuth();
    return <ClientDashboard user={user} />;
  };
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Landing Routes */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                {/* Main value proposition */}
                <Hero />
                {/* Core service offering */}
                <Services />
                <Process />
                <Advantages />
                {/* Pricing and conversion */}
                <Pricing />
                {/* Additional value services */}
                <Pesel />
                <Banking />
                {/* Resources and support */}
                <Guide />
                {/* Trust and coverage */}
                <PolandMap />
                {/* Footer */}
                <Footer />
              </>
            }
          />
          
          {/* Authentication and registration */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Onboarding forms */}
          <Route path="/form" element={<Form />} />
          
          {/* Landing info pages */}
          <Route path="/contact" element={<><Navbar /><ContactPage /><Footer /></>} />
          <Route path="/servicios" element={<><Navbar /><ServiciosPage /><Footer /></>} />
          <Route path="/guia" element={<><Navbar /><GuiaPage /><Footer /></>} />
          <Route path="/banking" element={<><Navbar /><BankingPage /><Footer /></>} />

          {/* Dashboard Client Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout>
                <ClientDashboardWrapper  />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/documentos" element={
            <ProtectedRoute>
              <DashboardLayout>
                <DocumentsPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/tickets" element={
            <ProtectedRoute>
              <DashboardLayout>
                <TicketsPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/pagos" element={
            <ProtectedRoute>
              <DashboardLayout>
                <PaymentsPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/perfil" element={
            <ProtectedRoute>
              <DashboardLayout>
                <ProfilePage />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <DashboardLayout isAdmin={true}>
                <AdminDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/clientes" element={
            <ProtectedRoute requireAdmin={true}>
              <DashboardLayout isAdmin={true}>
                <ClientsManagement />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/clientes/:id" element={
            <ProtectedRoute requireAdmin={true}>
              <DashboardLayout isAdmin={true}>
                <ClientDetail />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/procesos" element={
            <ProtectedRoute requireAdmin={true}>
              <DashboardLayout isAdmin={true}>
                <ProcessManagement />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/tickets" element={
            <ProtectedRoute requireAdmin={true}>
              <DashboardLayout isAdmin={true}>
                <AdminTickets />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/pagos" element={
            <ProtectedRoute requireAdmin={true}>
              <DashboardLayout isAdmin={true}>
                <PaymentsManagement />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;