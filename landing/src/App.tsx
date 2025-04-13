import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import LoginPage from "./pages/LoginPage";
import ContactPage from "./pages/ContactPage";
import ServiciosPage from "./pages/ServiciosPage";
import GuiaPage from "./pages/GuiaPage";
import BankingPage from "./pages/BankingPage";
import RegisterPage from "./pages/RegisterPage";
import { AuthProvider } from "./context/AuthContext";
import Form from "./pages/Form";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <>
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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/form" element={<Form/>}/>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/servicios" element={<ServiciosPage />} />
          <Route path="/guia" element={<GuiaPage />} />
          <Route path="/banking" element={<BankingPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
