import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [mobileActive, setMobileActive] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const handleHamburgerClick = () => {
    setMobileActive(!mobileActive);
  };

  const closeMenu = () => {
    setMobileActive(false);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar" style={{ position: 'static', marginBottom: '2rem' }}>
      <div className="nav-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          <i className="fas fa-university"></i> SecureBank
        </Link>
        <ul className={`nav-menu ${mobileActive ? 'active' : ''}`}>
          <li>
            <Link to="/" className={isActive('/')} onClick={closeMenu}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className={isActive('/about')} onClick={closeMenu}>
              About
            </Link>
          </li>
          <li>
            <Link to="/services" className={isActive('/services')} onClick={closeMenu}>
              Services
            </Link>
          </li>
          <li>
            <Link to="/contact" className={isActive('/contact')} onClick={closeMenu}>
              Contact
            </Link>
          </li>
        </ul>
        <div className="auth-buttons">
          {isAuthenticated ? (
            <Link to="/dashboard" className="signup-btn">
              Go to Dashboard <i className="fas fa-arrow-right"></i>
            </Link>
          ) : (
            <>
              <Link to="/login" className="login-btn" onClick={closeMenu}>
                Login
              </Link>
              <Link to="/signup" className="signup-btn" onClick={closeMenu}>
                Sign Up
              </Link>
            </>
          )}
        </div>
        <div className={`hamburger ${mobileActive ? 'active' : ''}`} onClick={handleHamburgerClick}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
