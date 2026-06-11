import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="foot" id="contact">
      <div className="footer-content">
        <div className="footer-section">
          <h3>SecureBank</h3>
          <p>Your trusted partner in digital banking.</p>
          <p>&copy; {new Date().getFullYear()} SecureBank. All rights reserved.</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/services">Our Services</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Register</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contact</h4>
          <p><i className="fas fa-phone"></i> +1-800-SECURE</p>
          <p><i className="fas fa-envelope"></i> support@securebank.com</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
