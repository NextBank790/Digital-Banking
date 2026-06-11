import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';
import '../assets/Digitalbanking.css';

const Services = () => {
  return (
    <div>
      <Navbar />
      <div className="page-header" style={{ marginTop: '4rem', marginBottom: '2rem', textAlign: 'center' }}>
        <h1>Our Digital Banking Services</h1>
        <p>Explore premium financial capabilities tailored for high-volume transactions.</p>
      </div>

      <section className="features" style={{ padding: '2rem 1rem 6rem' }}>
        <div className="features-grid" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="feature glass-panel">
            <i className="fas fa-wallet" style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '1.5rem' }}></i>
            <h3>Dynamic checking & Savings</h3>
            <p>Retain distinct accounting logs for primary daily cashflows and long-term locked capital accounts.</p>
          </div>
          <div className="feature glass-panel">
            <i className="fas fa-exchange-alt" style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '1.5rem' }}></i>
            <h3>Bespoke Wires & P2P</h3>
            <p>Transmit domestic ACH settlements, user-to-user instant email transfers, and global SWIFT wires securely.</p>
          </div>
          <div className="feature glass-panel">
            <i className="fas fa-credit-card" style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '1.5rem' }}></i>
            <h3>Virtual Visa/Mastercard</h3>
            <p>Provision metallic gold, black, or blue cards on the fly. Dynamically freeze, block, or delete cards to stop web trackers.</p>
          </div>
          <div className="feature glass-panel">
            <i className="fas fa-coins" style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '1.5rem' }}></i>
            <h3>Crypto Asset Swaps</h3>
            <p>Exchange balances instantly from fiat checking straight into BTC, ETH, SOL, or USDT with live fluctuating feeds.</p>
          </div>
          <div className="feature glass-panel">
            <i className="fas fa-chart-pie" style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '1.5rem' }}></i>
            <h3>Staking & MT4 API Bridge</h3>
            <p>Lock capital into high-yield staking pools or hook brokerage credentials to our autotrade signal receivers.</p>
          </div>
          <div className="feature glass-panel">
            <i className="fas fa-file-invoice-dollar" style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '1.5rem' }}></i>
            <h3>IRS Refund filings</h3>
            <p>Submit direct-deposit claims directly through the dashboard with automated review schedules.</p>
          </div>
        </div>
      </section>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Services;
