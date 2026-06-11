import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';
import '../assets/Digitalbanking.css';

const Home = () => {
  useEffect(() => {
    // Pulse animation for notification badge
    const badge = document.querySelector('.notification-badge');
    if (badge) {
      const interval = setInterval(() => {
        badge.style.transform = 'scale(1.15)';
        setTimeout(() => {
          badge.style.transform = 'scale(1)';
        }, 150);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div>
      {/* scrolling top ticker */}
      <div className="market-ticker">
        <div className="ticker-content">
          <span>BTC: $64,231.50 <small style={{ color: '#00ff88' }}>+2.4%</small></span>
          <span>ETH: $3,452.12 <small style={{ color: '#00ff88' }}>+1.8%</small></span>
          <span>SOL: $142.05 <small style={{ color: '#ff3366' }}>-0.5%</small></span>
          <span>GOLD: $2,342.10 <small style={{ color: '#00ff88' }}>+0.2%</small></span>
          <span>XRP: $0.62 <small style={{ color: '#00ff88' }}>+1.1%</small></span>
          <span>EUR/USD: 1.08 <small style={{ color: '#ff3366' }}>-0.1%</small></span>
          {/* Duplicate for seamless scrolling */}
          <span>BTC: $64,231.50 <small style={{ color: '#00ff88' }}>+2.4%</small></span>
          <span>ETH: $3,452.12 <small style={{ color: '#00ff88' }}>+1.8%</small></span>
          <span>SOL: $142.05 <small style={{ color: '#ff3366' }}>-0.5%</small></span>
        </div>
      </div>

      <Navbar />

      {/* Hero section */}
      <section className="hero" id="home">
        <div className="hero-content">
          <h1><span>SecureBank Premium</span><br />Banking Reimagined</h1>
          <p>Secure, fast, and available 24/7. Your financial world, simplified.</p>
          <div className="hero-buttons">
            <Link to="/signup" className="btn-primary">Get Started <i className="fas fa-arrow-right"></i></Link>
            <Link to="/login" className="btn-secondary">Demo Dashboard <i className="fas fa-chart-pie"></i></Link>
          </div>
        </div>
      </section>

      {/* Quick stats */}
      <section className="stats">
        <div className="stats-container">
          <div className="stat">
            <div className="stat-number">99.9%</div>
            <div className="stat-label">Uptime</div>
          </div>
          <div className="stat">
            <div className="stat-number">50k+</div>
            <div className="stat-label">Happy Customers</div>
          </div>
          <div className="stat">
            <div className="stat-number">$10B+</div>
            <div className="stat-label">Transactions</div>
          </div>
          <div className="stat">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Support</div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="features">
        <div className="container">
          <h2>Why Choose SecureBank?</h2>
          <div className="features-grid">
            <div className="feature">
              <i className="fas fa-shield-alt"></i>
              <h3>Bank-Grade Security</h3>
              <p>Multi-factor authentication and end-to-end encryption.</p>
            </div>
            <div className="feature">
              <i className="fas fa-mobile-alt"></i>
              <h3>Mobile First</h3>
              <p>Access your account from anywhere, anytime.</p>
            </div>
            <div className="feature">
              <i className="fas fa-bolt"></i>
              <h3>Lightning Fast</h3>
              <p>Instant transfers and real-time notifications.</p>
            </div>
            <div className="feature">
              <i className="fas fa-chart-line"></i>
              <h3>Smart Insights</h3>
              <p>AI-powered spending analysis and budgeting tools.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ChatBot />
    </div>
  );
};

export default Home;
