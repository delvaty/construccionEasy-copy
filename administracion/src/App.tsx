import React from 'react';
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

// Temporary admin check - In production, this would be handled by proper authentication
const isAdmin = window.location.pathname.startsWith('/admin');

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {isAdmin ? <AdminNavbar /> : <Navbar />}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            {/* Client Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/documentos" element={<DocumentsPage />} />
            <Route path="/tickets" element={<TicketsPage />} />
            <Route path="/pagos" element={<PaymentsPage />} />
            <Route path="/perfil" element={<ProfilePage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/clientes" element={<ClientsManagement />} />
            <Route path="/admin/clientes/:id" element={<ClientDetail />} />
            <Route path="/admin/procesos" element={<ProcessManagement />} />
            <Route path="/admin/tickets" element={<AdminTickets />} />
            <Route path="/admin/pagos" element={<PaymentsManagement />} />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
