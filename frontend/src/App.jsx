import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Search from './pages/Search';
import ProfessionalProfile from './pages/ProfessionalProfile';
import BookingConfirmation from './pages/BookingConfirmation';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/AdminDashboard';
import VerifyEmail from './pages/VerifyEmail';
import { AuthContext } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="d-flex flex-column min-vh-100">
        {user && <Navbar />}
        <main className="flex-grow-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/" replace />} />
            <Route path="/verify-email" element={!user ? <VerifyEmail /> : <Navigate to="/" replace />} />
            <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/" replace />} />
            <Route path="/reset-password/:token" element={!user ? <ResetPassword /> : <Navigate to="/" replace />} />

            {/* Protected Routes */}
            <Route path="/" element={user ? <Home /> : <Navigate to="/login" replace />} />
            <Route path="/search" element={user ? <Search /> : <Navigate to="/login" replace />} />
            <Route path="/professional/:id" element={user ? <ProfessionalProfile /> : <Navigate to="/login" replace />} />
            <Route path="/booking-confirmation" element={user ? <BookingConfirmation /> : <Navigate to="/login" replace />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
            <Route path="/admin" element={user ? <AdminDashboard /> : <Navigate to="/login" replace />} />

            {/* Catch-all Route */}
            <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
          </Routes>
        </main>
        {user && <Footer />}
      </div>
    </Router>
  );
}

export default App;
