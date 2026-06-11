import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../assets/Digitalbanking.css';

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [accountType, setAccountType] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [acctNums, setAcctNums] = useState({ checking: '', savings: '' });

  const navigate = useNavigate();

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 6) {
      value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }
    setPhone(value);
  };

  const validatePassword = (pass) => {
    return pass.length >= 8 && /[A-Z]/.test(pass) && /\d/.test(pass);
  };

  const showError = (message) => {
    const toast = document.createElement('div');
    toast.className = 'toast-notification error-toast';
    toast.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
    toast.style.cssText = 'position: fixed; top: 20px; right: 20px; background: linear-gradient(135deg, #dc3545, #c82333); z-index: 9999; padding: 1rem 1.5rem; border-radius: 12px; color: white; box-shadow: 0 8px 25px rgba(220,53,69,0.4);';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    if (!validatePassword(password)) {
      showError('Password must be 8+ chars, 1 uppercase, 1 number');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const checkingAccount = '1234' + Math.floor(10000000 + Math.random() * 90000000).toString();
      const savingsAccount = '8765' + Math.floor(10000000 + Math.random() * 90000000).toString();
      const checkingLast4Val = checkingAccount.slice(-4);
      const savingsLast4Val = savingsAccount.slice(-4);

      setAcctNums({ checking: checkingLast4Val, savings: savingsLast4Val });

      const userData = {
        name: fullName,
        email: email,
        phone: phone,
        checking: checkingAccount,
        savings: savingsAccount,
        checkingLast4: checkingLast4Val,
        savingsLast4: savingsLast4Val,
        checkingBalance: 2850000.00,
        savingsBalance: 150000.00,
        incomeThisMonth: 350000.00,
        spendingThisMonth: 50890.45,
        password: password,
        pin: '1234',
        kycStatus: 'unverified',
        profilePhoto: '',
        twoFactor: false,
        emailVerified: false,
        emailPreferences: {
          marketing: true,
          transactions: true,
          alerts: true
        },
        theme: 'light',
        btcBalance: 0.05,
        ethBalance: 1.25,
        solBalance: 15.4,
        usdtBalance: 2500.00,
        address: '123 Wall Street, New York, NY 10005',
        purchasedCourses: [],
        completedLessons: [],
        irsRefunds: []
      };

      localStorage.setItem('secureBankUser', JSON.stringify(userData));

      const defaultCard = {
        id: 'CARD-' + Math.floor(1000 + Math.random() * 9000),
        type: 'visa',
        tier: 'platinum',
        cardHolder: fullName.toUpperCase(),
        number: '4112 7834 ' + Math.floor(1000 + Math.random()*9000) + ' ' + checkingLast4Val,
        expiry: '12/29',
        cvc: Math.floor(100 + Math.random()*900).toString(),
        balance: 5000.00,
        status: 'active',
        transactions: [
          { merchant: 'Netflix Subscription', amount: 15.49, date: '06/10/2026' },
          { merchant: 'AWS Cloud Services', amount: 89.12, date: '06/08/2026' },
          { merchant: 'Uber Eats Premium', amount: 32.40, date: '06/05/2026' }
        ]
      };
      
      localStorage.setItem('bankCards', JSON.stringify([defaultCard]));
      localStorage.setItem('bankLoans', JSON.stringify([]));
      localStorage.setItem('bankInvestments', JSON.stringify([]));
      
      const welcomeNotifs = [
        {
          id: Date.now(),
          type: 'info',
          title: 'Welcome to SecureBank!',
          message: 'Thank you for choosing SecureBank. Complete your KYC verification to unlock all transfer features.',
          time: new Date().toLocaleString(),
          read: false
        }
      ];
      localStorage.setItem('bankNotifications', JSON.stringify(welcomeNotifs));

      const initialTxns = [
        {
          type: 'deposit',
          recipient: 'Initial Account Seed',
          amount: '3000000.00',
          account: checkingLast4Val,
          txnId: 'TXN-INIT',
          time: new Date().toLocaleString(),
          status: 'completed'
        }
      ];
      localStorage.setItem('bankTransactions', JSON.stringify(initialTxns));

      setLoading(false);
      setShowSuccess(true);
    }, 2500);
  };

  return (
    <div>
      <Navbar />
      <div className="page-header" style={{ marginTop: '4rem', marginBottom: '2rem', textAlign: 'center' }}>
        <h1>Create Account</h1>
        <p>Join thousands of satisfied customers. Sign up in minutes.</p>
      </div>

      <div className="accounts1-content" style={{ padding: '1rem 1rem 6rem', background: 'radial-gradient(circle at 10% 20%, rgba(224, 235, 255, 0.4) 0%, rgba(244, 247, 254, 0.9) 90%)' }}>
        <div className="new-account-form signup-form glass-panel" style={{ padding: '3rem', border: '1px solid rgba(255,255,255,0.7)', boxShadow: '0 15px 35px rgba(30, 60, 114, 0.05)', marginTop: '2rem', maxWidth: '600px', margin: '0 auto' }}>
          <h3 style={{ color: 'var(--primary-dark)', fontWeight: '800', fontSize: '1.6rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <i className="fas fa-user-plus" style={{ color: 'var(--gold)' }}></i> Complete Registration
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row-custom">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
            <div className="form-row-custom">
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" placeholder="+1 (555) 123-4567" value={phone} onChange={handlePhoneChange} required />
              </div>
              <div className="form-group">
                <label>Primary Account</label>
                <select value={accountType} onChange={(e) => setAccountType(e.target.value)} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}>
                  <option value="">Choose account</option>
                  <option value="checking">Checking Account</option>
                  <option value="savings">Savings Account</option>
                  <option value="both">Both (Recommended)</option>
                </select>
              </div>
            </div>
            <div className="form-row-custom">
              <div className="form-group">
                <label>Create Password</label>
                <input type="password" placeholder="Minimum 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <small style={{ display: 'block', marginTop: '0.25rem', color: '#64748b' }}>At least 8 characters, 1 uppercase, 1 number</small>
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input type="password" placeholder="Repeat password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>
            </div>
            <div className="form-group checkbox-group" style={{ margin: '1.5rem 0' }}>
              <label className="terms-checkbox" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.95rem' }}>
                <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} required style={{ marginTop: '0.2rem' }} />
                <span>I agree to the <a href="#">Terms & Conditions</a> and <a href="#">Privacy Policy</a></span>
              </label>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
              {!loading ? (
                <span>Create My Account</span>
              ) : (
                <span><i className="fas fa-circle-notch fa-spin"></i> Creating...</span>
              )}
            </button>
          </form>

          {/* Success Modal */}
          {showSuccess && (
            <div className="modal" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
              <div className="modal-content" style={{ background: 'white', borderRadius: '20px', padding: '2.5rem', maxWidth: '500px', width: '90%', textAlign: 'center', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
                <i className="fas fa-check-circle success-icon" style={{ fontSize: '4rem', color: 'var(--success)' }}></i>
                <h3 style={{ margin: '1rem 0' }}>Account Created Successfully!</h3>
                <p>Your accounts are now active. Proceed to login below.</p>
                <div className="new-accounts-summary" style={{ display: 'flex', gap: '2rem', margin: '2rem 0', justifyContent: 'center' }}>
                  <div className="account-preview" style={{ textAlign: 'center' }}>
                    <div className="account-type-preview" style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '0.5rem' }}>Checking</div>
                    <div className="account-number-preview" style={{ fontFamily: 'Courier New, monospace', fontSize: '1.1rem', opacity: 0.8 }}>**** **** **** {acctNums.checking}</div>
                  </div>
                  <div className="account-preview" style={{ textAlign: 'center' }}>
                    <div className="account-type-preview" style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '0.5rem' }}>Savings</div>
                    <div className="account-number-preview" style={{ fontFamily: 'Courier New, monospace', fontSize: '1.1rem', opacity: 0.8 }}>**** **** **** {acctNums.savings}</div>
                  </div>
                </div>
                <button onClick={() => navigate('/login')} className="btn-primary" style={{ width: '100%' }}>Login to Banking</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
