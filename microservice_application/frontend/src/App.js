import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import Products from './components/Products';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      if (!isAuthenticated) {
        navigate('/login', { state: { from: location }, replace: true });
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate, location]);

  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return localStorage.getItem('isAuthenticated') === 'true' ? children : null;
};

// Public Route Component (for login/signup when already authenticated)
const PublicRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      if (isAuthenticated) {
        const from = location.state?.from?.pathname || '/products';
        navigate(from, { replace: true });
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate, location]);

  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return localStorage.getItem('isAuthenticated') === 'true' ? null : children;
};

function App() {
  // Handle login state
  const navigate = useNavigate();
  
  const handleLogin = () => {
    localStorage.setItem('isAuthenticated', 'true');
    navigate('/products', { replace: true });
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };
  
  // Initial render - no loading state to show products immediately
  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={<Products />}
        />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login onLogin={handleLogin} />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUp onSignUp={handleLogin} />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={<Navigate to="/products" replace />}
        />
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <Navigate to="/products" replace />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;