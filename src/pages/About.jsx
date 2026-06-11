import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';
import '../assets/Digitalbanking.css';

const About = () => {
  return (
    <div>
      <Navbar />
      <div className="page-header" style={{ marginTop: '4rem', marginBottom: '2rem', textAlign: 'center' }}>
        <h1>About SecureBank</h1>
        <p>Providing cutting-edge digital financial systems with zero border constraints.</p>
      </div>

      <section className="features" style={{ padding: '2rem 1rem 6rem' }}>
        <div className="features-grid" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div className="feature glass-panel" style={{ padding: '3rem', textAlign: 'left' }}>
            <h3 style={{ fontSize: '1.6rem', color: 'var(--primary-dark)', fontWeight: '800', marginBottom: '1rem' }}>Our Mission</h3>
            <p style={{ lineHeight: '1.8', color: 'var(--text-muted)' }}>
              At SecureBank, we believe borders shouldn't define your financial freedom. We built a bank-grade client-side management interface that allows users to seamlessly handle checking, savings, staking plans, MT4 connectivity, and cryptocurrency swaps from a single, unified workspace.
            </p>
          </div>
          <div className="feature glass-panel" style={{ padding: '3rem', textAlign: 'left' }}>
            <h3 style={{ fontSize: '1.6rem', color: 'var(--primary-dark)', fontWeight: '800', marginBottom: '1rem' }}>Secure Client-Side Vaults</h3>
            <p style={{ lineHeight: '1.8', color: 'var(--text-muted)' }}>
              All profiles, ledger histories, card codes, and balance sheets are managed directly inside your browser's secure `localStorage` vaults. SecureBank encrypts transactions on your device, ensuring zero transmission of personal privacy files to external tracking systems.
            </p>
          </div>
        </div>
      </section>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default About;
