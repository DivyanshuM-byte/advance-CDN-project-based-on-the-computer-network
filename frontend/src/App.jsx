import React, { useState, useEffect } from 'react';
import './index.css';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import CustomCursor from './components/CustomCursor';
import NetworkBackground from './components/NetworkBackground';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem('cdn_auth');
    if (session) {
      setIsAuthenticated(true);
    }
    setAuthChecked(true);
  }, []);

  const handleLogin = (email) => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('cdn_auth');
    setIsAuthenticated(false);
  };

  if (!authChecked) return null;

  return (
    <>
      <CustomCursor />
      <NetworkBackground />
      {isAuthenticated ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <Auth onLogin={handleLogin} />
      )}
    </>
  );
}

export default App;
