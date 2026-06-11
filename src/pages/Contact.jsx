import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';
import '../assets/Digitalbanking.css';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      alert("Thank you. Our compliance team will reach out shortly.");
      setSubmitted(false);
    }, 500);
  };

  return (
    <div>
      <Navbar />
      <div className="page-header" style={{ marginTop: '4rem', marginBottom: '2rem', textAlign: 'center' }}>
        <h1>Contact SecureBank</h1>
        <p>Get in touch with our security operations and compliance team.</p>
      </div>

      <section className="features" style={{ padding: '1rem 1rem 6rem' }}>
        <div className="features-grid" style={{ maxWidth: '900px', margin: '0 auto', gridTemplateColumns: '1fr 1fr' }}>
          
          <div className="feature glass-panel" style={{ padding: '2.5rem', textAlign: 'left' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Send Message</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>Name</label>
                <input type="text" className="form-control" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} required />
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>Email</label>
                <input type="email" className="form-control" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} required />
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>Message</label>
                <textarea className="form-control" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', height: '100px', resize: 'none' }} required></textarea>
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.75rem' }}>Transmit Inquiry</button>
            </form>
          </div>

          <div className="feature glass-panel" style={{ padding: '2.5rem', textAlign: 'left', background: 'var(--light)' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Offices & Channels</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--text-muted)' }}>
              <div>
                <strong style={{ color: 'var(--primary-dark)', display: 'block' }}>Corporate HQ</strong>
                120 Wall Street, 24th Floor, New York, NY 10005
              </div>
              <div>
                <strong style={{ color: 'var(--primary-dark)', display: 'block' }}>Email Support</strong>
                support@securebank.com
              </div>
              <div>
                <strong style={{ color: 'var(--primary-dark)', display: 'block' }}>Telephony Support</strong>
                +1-800-SECURE (1-800-732-8730)
              </div>
              <div>
                <strong style={{ color: 'var(--primary-dark)', display: 'block' }}>Support Hours</strong>
                Monday – Friday: 8:00 AM – 8:00 PM EST
              </div>
            </div>
          </div>

        </div>
      </section>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Contact;
