import React, { useState } from 'react';

const Auth = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && pass) {
      localStorage.setItem('cdn_auth', email);
      onLogin(email);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#fff' }}>Velocity Edge Simulator</h2>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Authenticate to access edge configuration</p>
        </div>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="admin@edge.network"
            className="auth-input"
            required
          />
          <input
            type="password"
            value={pass}
            onChange={e => setPass(e.target.value)}
            placeholder="••••••••"
            className="auth-input"
            required
          />
          <button type="submit" className="primary-btn" style={{ marginTop: '10px' }}>
            Initialize Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
