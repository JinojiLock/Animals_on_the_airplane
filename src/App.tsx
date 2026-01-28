import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { HomePage } from './pages/HomePage';
import { AdminPanel } from './pages/admin/AdminPanel';
import { LoginPage } from './pages/admin/LoginPage';

// Simple password protection (in production, use proper auth)
const ADMIN_PASSWORD = 'admin123';

function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const handleLogin = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
    } else {
      alert('Неверный пароль');
    }
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('admin_auth');
  };

  // Check for saved auth on mount
  useState(() => {
    const savedAuth = localStorage.getItem('admin_auth');
    if (savedAuth === 'true') {
      setIsAdminAuthenticated(true);
    }
  });

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        
        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            isAdminAuthenticated ? (
              <AdminPanel />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          }
        />

        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
