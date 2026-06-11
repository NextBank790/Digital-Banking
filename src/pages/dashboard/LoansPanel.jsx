import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const LoansPanel = () => {
  const {
    userData,
    loans,
    applyLoan,
    repayLoan
  } = useAuth();

  const [loanAmount, setLoanAmount] = useState('');
  const [loanTerm, setLoanTerm] = useState('6');
  const [loanPurpose, setLoanPurpose] = useState('');

  // 1. Calculate estimates
  const principal = parseFloat(loanAmount) || 0;
  const term = parseInt(loanTerm) || 6;
  const totalRepay = principal * 1.05; // 5% APR fixed markup
  const monthly = principal > 0 ? (totalRepay / term) : 0;

  const handleApplyLoanSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(loanAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Enter valid principal.');
      return;
    }

    applyLoan(amount, term, loanPurpose);
    alert('Loan application submitted. Our system is evaluating your credentials...');
    
    // Reset
    setLoanAmount('');
    setLoanPurpose('');
  };

  const handleRepayLoan = (loanId, amount) => {
    const totalRepayAmount = amount * 1.05;
    if ((userData?.checkingBalance || 0) < totalRepayAmount) {
      alert('Insufficient checking balance to repay this loan.');
      return;
    }
    if (window.confirm(`Settle loan reference ${loanId} for $${totalRepayAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}?`)) {
      repayLoan(loanId, totalRepayAmount);
    }
  };

  const getReferralCode = () => {
    if (!userData?.name) return 'SB789456';
    const initials = userData.name.split(' ').map(p => p[0]).join('').toUpperCase();
    return `${initials}789456`;
  };

  const handleCopyReferral = () => {
    const code = getReferralCode();
    navigator.clipboard.writeText(`https://securebank.com/ref?code=${code}`);
    alert('Referral link copied to clipboard!');
  };

  return (
    <section id="panel-loans-referrals" className="dashboard-panel active">
      <div className="settings-grid">
        
        {/* Loans Column */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2>Apply for a Personal/Business Loan</h2>
          <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>Instant evaluation based on net asset valuations. 5% fixed APR.</p>
          
          <form onSubmit={handleApplyLoanSubmit} id="formLoan">
            <div className="form-row-custom">
              <div className="form-group">
                <label>Principal Amount ($)</label>
                <input
                  type="number"
                  id="loanAmount"
                  placeholder="10000"
                  className="form-control"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Term (Months)</label>
                <select
                  id="loanTerm"
                  className="form-control"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                >
                  <option value="6">6 Months</option>
                  <option value="12">12 Months</option>
                  <option value="24">24 Months</option>
                  <option value="36">36 Months</option>
                </select>
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label>Loan Purpose</label>
              <input
                type="text"
                id="loanPurpose"
                placeholder="Real estate expansion / Business equipment"
                className="form-control"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
                value={loanPurpose}
                onChange={(e) => setLoanPurpose(e.target.value)}
                required
              />
            </div>
            
            <div style={{ background: 'var(--light)', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: '1.6' }} id="loanEstimateText">
              Interest Rate: <strong>5.0% APR (Fixed)</strong><br />
              Total Repayment: <strong>${totalRepay.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong><br />
              Estimated Monthly Repayment: <strong>${monthly.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Submit Loan Application</button>
          </form>
          
          <h3 style={{ marginTop: '2rem' }}>Active Loan Statements</h3>
          <div id="loansList" style={{ marginTop: '1rem' }}>
            {loans.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: '#aaa', fontSize: '0.85rem' }}>No active loan portfolios.</div>
            ) : (
              loans.map(l => (
                <div
                  key={l.id}
                  style={{
                    background: 'var(--light)',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    marginBottom: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <strong>Loan Reference: {l.id}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Principal: ${l.amount.toLocaleString()} | Term: {l.term} Months
                    </div>
                    <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Purpose: {l.purpose} • Applied: {l.dateApplied}
                    </small>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
                    <span
                      style={{
                        fontWeight: 'bold',
                        fontSize: '0.85rem',
                        padding: '4px 10px',
                        borderRadius: '50px',
                        background:
                          l.status === 'approved'
                            ? 'rgba(40,167,69,0.1)'
                            : l.status === 'repaid'
                            ? 'rgba(100,116,139,0.1)'
                            : 'rgba(255,193,7,0.1)',
                        color:
                          l.status === 'approved'
                            ? 'var(--success)'
                            : l.status === 'repaid'
                            ? '#64748b'
                            : 'var(--warning)',
                        textTransform: 'uppercase'
                      }}
                    >
                      {l.status}
                    </span>
                    {l.status === 'approved' && (
                      <button
                        className="btn-primary"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem', background: 'var(--success)', border: 'none' }}
                        onClick={() => handleRepayLoan(l.id, l.amount)}
                      >
                        Pay Loan
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Referrals Column */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2>Referral Program</h2>
          <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>Share the SecureBank experience and receive $25.00 for every account funded.</p>
          
          <div style={{ background: 'var(--light)', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Your Referral Code</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)', margin: '5px 0 10px' }} id="referralCodeText">
              {getReferralCode()}
            </div>
            <button className="btn-secondary" style={{ padding: '5px 12px', fontSize: '0.8rem' }} onClick={handleCopyReferral}>
              Copy Referral Link
            </button>
          </div>

          <h3>Referred Users</h3>
          <div style={{ marginTop: '1rem', maxHeight: '250px', overflowY: 'auto' }} id="referralsList">
            <div style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-color)', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>sarah_connors@yahoo.com (Funded Account)</span>
              <strong className="profit">+$25.00 Commission</strong>
            </div>
            <div style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-color)', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>mike_todd@gmail.com (Funded Account)</span>
              <strong className="profit">+$25.00 Commission</strong>
            </div>
            <div style={{ padding: '0.75rem', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>danny_wood@outlook.com (Registered)</span>
              <span style={{ color: 'var(--text-muted)' }}>Awaiting funding</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default LoansPanel;
