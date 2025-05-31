import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import SafeBrowsing from './components/SafeBrowsing';
import Steganography from './components/Steganography';
import EmailScanner from './components/EmailScanner';
import DeepfakeDetector from './components/DeepfakeDetector';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );

  return (
    <>
      <Router>
        <div className="app-container">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Dashboard setIsAuthenticated={setIsAuthenticated} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/safe-browsing" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <SafeBrowsing />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/steganography" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Steganography />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/emailscanner" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <EmailScanner />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/detect" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <DeepfakeDetector />
                </ProtectedRoute>
              }
            />
            
            {/* Catch all unmatched routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;