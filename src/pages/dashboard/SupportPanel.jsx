import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const FAQS = [
  { q: 'How do I increase my withdrawal limit?', a: 'Complete KYC verification in the Account KYC panel. Upload an official government ID (Passport, Driver\'s License, or National ID). Once our compliance team approves your documents, large SWIFT and ACH wires are automatically unlocked.' },
  { q: 'How do I reset my transaction PIN?', a: 'Go to Settings & Security panel, enter your current 4-digit PIN in the "Old PIN" field, then create and confirm your new PIN. The PIN is required for withdrawals, SWIFT transfers, and card generation.' },
  { q: 'When will my loan be approved?', a: 'SecureBank AI auto-evaluates loan applications within approximately 8 seconds using your real-time account balance as collateral. Higher checking balances improve approval odds. Once approved, funds are instantly credited to your Checking account.' },
  { q: 'Can I cancel a crypto swap?', a: 'Crypto swaps are instant and irreversible once confirmed. Always double-check the asset type, amount, and exchange rate shown before pressing "Confirm Asset Swap".' },
  { q: 'How do I freeze a virtual card?', a: 'Navigate to the Virtual Cards panel in the sidebar. Click on any card in the carousel to select it (a gold border appears). Then press the "Freeze" button in the Card Controls section below. You can unfreeze anytime.' },
  { q: 'How do I export my transaction history?', a: 'Open the Account History panel in the sidebar and press "Export CSV" at the top right. This downloads a spreadsheet compatible with excel and ledger systems.' }
];

const SupportPanel = () => {
  const {
    userData,
    supportTickets,
    submitTicket
  } = useAuth();

  const [category, setCategory] = useState('account');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [email, setEmail] = useState(userData?.email || '');

  // FAQ Accordion opened state
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!subject || !description || !email) {
      alert('Please fill out all required ticket fields.');
      return;
    }

    submitTicket(category, subject, description, priority, email);
    alert('Support ticket submitted successfully. Our team will review your request shortly.');

    // Reset
    setSubject('');
    setDescription('');
  };

  const toggleFaq = (idx) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <section id="panel-support" className="dashboard-panel active">
      <div className="settings-grid">

        {/* Ticket Form Column */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2><i className="fas fa-headset"></i> Submit Support Ticket</h2>
          <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
            Our team responds within 1–2 business hours. Critical security issues are prioritized.
          </p>

          <form onSubmit={handleTicketSubmit} id="formSupportTicket">
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Issue Category</label>
              <select
                id="supportCategory"
                className="form-control"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="account">Account Access / Login</option>
                <option value="transfer">Transfer Issue</option>
                <option value="card">Virtual Card Problem</option>
                <option value="crypto">Crypto / Swap Issue</option>
                <option value="kyc">KYC Verification</option>
                <option value="loan">Loan Inquiry</option>
                <option value="security">Security Concern</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Subject</label>
              <input
                type="text"
                id="supportSubject"
                placeholder="Brief description of your issue"
                className="form-control"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Detailed Description</label>
              <textarea
                id="supportDescription"
                placeholder="Provide full context, transaction IDs, amounts, and any error messages you encountered..."
                className="form-control"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', height: '130px', resize: 'vertical', border: '1px solid #ddd' }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="form-row-custom" style={{ marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label>Priority Level</label>
                <select
                  id="supportPriority"
                  className="form-control"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="low">Low – General Inquiry</option>
                  <option value="medium">Medium – Transaction Issue</option>
                  <option value="high">High – Account Locked / Error</option>
                  <option value="critical">🚨 Critical – Unauthorized Access</option>
                </select>
              </div>
              <div className="form-group">
                <label>Account Email</label>
                <input
                  type="email"
                  id="supportEmail"
                  className="form-control"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              Submit Support Request <i className="fas fa-paper-plane"></i>
            </button>
          </form>

          {/* Submitted Tickets Ledger */}
          <div style={{ marginTop: '2.5rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>My Submitted Tickets</h3>
            <div id="supportTicketsList" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {supportTickets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '1.5rem', color: '#aaa', fontSize: '0.85rem' }}>
                  No support tickets submitted yet.
                </div>
              ) : (
                supportTickets.map(t => (
                  <div
                    key={t.id}
                    style={{
                      background: 'var(--light)',
                      padding: '1rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <strong>Ticket #{t.id}: {t.subject}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Category: {t.category.toUpperCase()} | Date: {t.date}
                      </div>
                      <p style={{ margin: '5px 0 0', fontSize: '0.8rem', color: '#555' }}>{t.description}</p>
                    </div>
                    <span
                      style={{
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                        padding: '4px 10px',
                        borderRadius: '50px',
                        background:
                          t.status === 'open'
                            ? 'rgba(255,193,7,0.1)'
                            : t.status === 'in-progress'
                            ? 'rgba(0,123,255,0.1)'
                            : 'rgba(40,167,69,0.1)',
                        color:
                          t.status === 'open'
                            ? 'var(--warning)'
                            : t.status === 'in-progress'
                            ? 'var(--primary)'
                            : 'var(--success)',
                        textTransform: 'uppercase',
                        flexShrink: 0
                      }}
                    >
                      {t.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* FAQ Column */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2><i className="fas fa-question-circle"></i> Help & FAQ</h2>
          <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
            Quick answers to common questions.
          </p>
          <div id="faqAccordion" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} style={{ border: '1px solid var(--border-color)', borderRadius: '10px', overflow: 'hidden' }}>
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    style={{
                      width: '100%',
                      padding: '1rem 1.25rem',
                      textAlign: 'left',
                      background: 'var(--light)',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontFamily: 'inherit',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: 'var(--text-color)',
                      transition: 'background 0.2s'
                    }}
                  >
                    <span>{faq.q}</span>
                    <i
                      className="fas fa-chevron-down"
                      style={{
                        transition: 'transform 0.3s',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        flexShrink: 0,
                        color: 'var(--primary)'
                      }}
                    ></i>
                  </button>
                  {isOpen && (
                    <div style={{ padding: '1rem 1.25rem', fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.7', borderTop: '1px solid var(--border-color)', background: 'white' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Contact Details */}
          <div style={{ marginTop: '2rem', background: 'var(--light)', padding: '1.5rem', borderRadius: '12px' }}>
            <h4 style={{ marginBottom: '1rem' }}><i className="fas fa-phone-alt" style={{ color: 'var(--primary)' }}></i> Contact Channels</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <div><i className="fas fa-envelope" style={{ color: 'var(--gold)', width: '20px' }}></i> support@securebank.com</div>
              <div><i className="fas fa-phone" style={{ color: 'var(--gold)', width: '20px' }}></i> +1-800-SECURE (1-800-732-8730)</div>
              <div><i className="fas fa-clock" style={{ color: 'var(--gold)', width: '20px' }}></i> Mon–Fri: 8AM–8PM EST | Sat: 9AM–5PM</div>
              <div><i className="fas fa-comments" style={{ color: 'var(--gold)', width: '20px' }}></i> Live chat available 24/7 via bot (bottom-right)</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default SupportPanel;
