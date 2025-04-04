import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AdminNavbar from './components/AdminNavbar';
import HomePage from './pages/HomePage';
import DocumentsPage from './pages/DocumentsPage';
import TicketsPage from './pages/TicketsPage';
import PaymentsPage from './pages/PaymentsPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ClientsManagement from './pages/admin/ClientsManagement';
import ClientDetail from './pages/admin/ClientDetail.tsx';
import ProcessManagement from './pages/admin/ProcessManagement';
import AdminTickets from './pages/admin/AdminTickets';
import PaymentsManagement from './pages/admin/PaymentsManagement';
import LoginPage from './pages/LoginPage.tsx';
/* import { use } from 'framer-motion/client'; */


export const AuthContext = React.createContext<{
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (isAdmin: boolean) => void;
  logout: () => void;
}>({ 
  isAuthenticated: false,
  isAdmin: false,
  login: () => {},
  logout: () => {},
 });

 

// Temporary admin check - In production, this would be handled by proper authentication
/* const isAdmin = window.location.pathname.startsWith('/admin'); */

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const login = (admin: boolean) => {
    setIsAuthenticated(true);
    setIsAdmin(admin);
  };
  const logout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, logout }}>
    <Router>
      <div className="min-h-screen bg-gray-50">
        {!isAuthenticated && (isAdmin ? <AdminNavbar /> : <Navbar />)}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            
            {/* Client Routes */}
            <Route path="/" element={<HomePage />  } />
            <Route path="/documentos" element={  <DocumentsPage />} />
            <Route path="/tickets" element={<TicketsPage /> } />
            <Route path="/pagos" element={<PaymentsPage />} />
            <Route path="/perfil" element={<ProfilePage /> } />

            {/* Admin Routes */}
            <Route path="/admin" element={
                
                  <AdminDashboard />
                
              } />
              <Route path="/admin/clientes" element={
                
                  <ClientsManagement />
                
              } />
              <Route path="/admin/clientes/:id" element={
                
                  <ClientDetail />
                
              } />
              <Route path="/admin/procesos" element={
                
                  <ProcessManagement />
                
              } />
              <Route path="/admin/tickets" element={
                
                  <AdminTickets />
                
              } />
              <Route path="/admin/pagos" element={
                
                  <PaymentsManagement />
                
              } />
            
            {/* Fallback route */}
            <Route path="*" element={isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
    </AuthContext.Provider>
  );
}

export default App;
