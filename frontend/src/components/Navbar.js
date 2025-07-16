import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          Avatar Lab
        </Link>
        
        <div className="navbar-nav">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            🏠 Dashboard
          </Link>
          <Link 
            to="/generate" 
            className={`nav-link ${location.pathname === '/generate' ? 'active' : ''}`}
          >
            🎭 Generate
          </Link>
          <Link 
            to="/history" 
            className={`nav-link ${location.pathname === '/history' ? 'active' : ''}`}
          >
            📚 History
          </Link>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>
              👤 {user.email || 'User'}
            </span>
            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 16px' }}>
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 