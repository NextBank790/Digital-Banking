import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import '../assets/Digitalbanking.css';
import '../assets/loginDigital.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState('email'); // 'email', 'otp', 'password', 'twoFactor', 'loading'
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [enteredOtp, setEnteredOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const timerRef = useRef(null);
  const otpInputsRef = useRef([]);

  useEffect(() => {
    // Clean up timer on unmount
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const showError = (msg) => {
    setErrorMessage(msg);
    const toast = document.createElement('div');
    toast.className = 'toast-notification error-toast';
    toast.style.cssText = 'position: fixed; top: 20px; right: 20px; background: linear-gradient(135deg, #ff3366, #c82333); z-index: 9999; padding: 1rem 1.5rem; border-radius: 12px; color: white; box-shadow: 0 8px 25px rgba(220,53,69,0.4); display: flex; align-items: center; gap: 10px; font-weight: 500;';
    toast.innerHTML = `<i class="fas fa-exclamation-triangle"></i> <div>${msg}</div>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  };

  const startTimer = () => {
    setTimer(60);
    setResendDisabled(true);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Step 1: Email Form Submit
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      showError('Please enter your email');
      return;
    }

    // Check if user exists in localStorage, otherwise create default demo user
    const isStephen = cleanEmail.toLowerCase() === 'stephenjtownsend62829@gmail.com';
    let user = JSON.parse(localStorage.getItem('secureBankUser'));

    if (isStephen) {
      user = {
        name: 'Stephen Townsend',
        email: cleanEmail.toLowerCase(),
        phone: '+1 (555) 382-9012',
        checking: '123482736282',
        savings: '876523912910',
        checkingLast4: '6282',
        savingsLast4: '2910',
        checkingBalance: 17392000.00,
        savingsBalance: 150000.00,
        incomeThisMonth: 17542000.00,
        spendingThisMonth: 50890.45,
        password: 'Stephen2026!',
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
      localStorage.setItem('secureBankUser', JSON.stringify(user));
      
      const stephenTxns = [
        {
          type: 'deposit',
          recipient: 'FedWire Direct Deposit / US Treasury',
          amount: '14392000.00',
          account: '6282',
          txnId: 'TXN-FED-84729',
          time: '5/4/2026, 2:30:15 PM',
          status: 'completed'
        },
        {
          type: 'deposit',
          recipient: 'Initial Account Seed',
          amount: '3000000.00',
          account: '6282',
          txnId: 'TXN-INIT',
          time: '5/1/2026, 9:00:00 AM',
          status: 'completed'
        }
      ];
      localStorage.setItem('bankTransactions', JSON.stringify(stephenTxns));
    } else if (!user || user.email.toLowerCase() !== cleanEmail.toLowerCase()) {
      user = {
        name: 'Charles Walker',
        email: cleanEmail,
        phone: '+1 (555) 019-2834',
        checking: '123456783456',
        savings: '123456787890',
        checkingLast4: '3456',
        savingsLast4: '7890',
        checkingBalance: 2850000.00,
        savingsBalance: 150000.00,
        incomeThisMonth: 350000.00,
        spendingThisMonth: 50890.45,
        password: 'password', // default password
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
      localStorage.setItem('secureBankUser', JSON.stringify(user));
      localStorage.removeItem('bankTransactions');
    } else {
      // Backfill any missing fields for existing user
      let modified = false;
      if (user.pin === undefined) { user.pin = '1234'; modified = true; }
      if (user.kycStatus === undefined) { user.kycStatus = 'unverified'; modified = true; }
      if (user.profilePhoto === undefined) { user.profilePhoto = ''; modified = true; }
      if (user.twoFactor === undefined) { user.twoFactor = false; modified = true; }
      if (user.emailVerified === undefined) { user.emailVerified = false; modified = true; }
      if (user.btcBalance === undefined) { user.btcBalance = 0.05; modified = true; }
      if (user.ethBalance === undefined) { user.ethBalance = 1.25; modified = true; }
      if (user.solBalance === undefined) { user.solBalance = 15.4; modified = true; }
      if (user.usdtBalance === undefined) { user.usdtBalance = 2500.00; modified = true; }
      if (user.address === undefined) { user.address = '123 Wall Street, New York, NY 10005'; modified = true; }
      if (user.purchasedCourses === undefined) { user.purchasedCourses = []; modified = true; }
      if (user.completedLessons === undefined) { user.completedLessons = []; modified = true; }
      if (user.irsRefunds === undefined) { user.irsRefunds = []; modified = true; }
      if (modified) {
        localStorage.setItem('secureBankUser', JSON.stringify(user));
      }
    }

    // Generate 6 digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpCode(generatedOtp);
    console.log('OTP sent to', cleanEmail, ':', generatedOtp);

    setTimeout(() => {
      alert(`[SecureBank Secure OTP] Your 6-digit access code is: ${generatedOtp}`);
    }, 500);

    setStep('otp');
    startTimer();
    setEnteredOtp(['', '', '', '', '', '']);
    setTimeout(() => {
      if (otpInputsRef.current[0]) otpInputsRef.current[0].focus();
    }, 100);
  };

  const handleResendOtp = () => {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpCode(generatedOtp);
    console.log('OTP resent to', email, ':', generatedOtp);
    alert(`[SecureBank Secure OTP] Your new 6-digit access code is: ${generatedOtp}`);
    startTimer();
  };

  // OTP Input Changes
  const handleOtpDigitChange = (index, value) => {
    const val = value.replace(/\D/g, '');
    const newOtp = [...enteredOtp];
    newOtp[index] = val.slice(-1);
    setEnteredOtp(newOtp);

    if (val && index < 5) {
      otpInputsRef.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !enteredOtp[index] && index > 0) {
      const newOtp = [...enteredOtp];
      newOtp[index - 1] = '';
      setEnteredOtp(newOtp);
      otpInputsRef.current[index - 1].focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasteData.length === 6) {
      const newOtp = pasteData.split('');
      setEnteredOtp(newOtp);
      otpInputsRef.current[5].focus();
    }
  };

  // Step 2: OTP Form Submit
  const handleOtpSubmit = (e) => {
    e.preventDefault();
    const entered = enteredOtp.join('');
    if (entered === otpCode) {
      setStep('password');
    } else {
      showError('Invalid code. Please try again.');
      if (otpInputsRef.current[0]) otpInputsRef.current[0].focus();
    }
  };

  // Step 3: Password Form Submit
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('secureBankUser'));
    if (user && password === user.password) {
      if (user.twoFactor) {
        setStep('twoFactor');
        setTimeout(() => {
          alert('[SecureBank 2FA] Your mock Authenticator code is: 123456');
        }, 500);
      } else {
        triggerLoginFlow(user);
      }
    } else {
      showError('Incorrect password. (Try "password" or your registered password)');
    }
  };

  // Step 4: 2FA Form Submit
  const handleTwoFactorSubmit = (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('secureBankUser'));
    if (twoFactorCode.trim() === '123456' || twoFactorCode.trim().length === 6) {
      triggerLoginFlow(user);
    } else {
      showError('Invalid code. Enter 6 digits (Mock: 123456)');
    }
  };

  const triggerLoginFlow = (user) => {
    setStep('loading');
    setTimeout(() => {
      login(user);
      navigate('/dashboard');
    }, 2000);
  };

  const showPasswordReset = () => {
    alert('Password reset link sent to your email!');
  };

  return (
    <div>
      <Navbar />
      <div className="login-container" style={{ marginTop: '4rem' }}>
        <div className="login-box glass-panel" style={{ border: '1px solid rgba(255,255,255,0.7)', boxShadow: '0 15px 35px rgba(30,60,114,0.05)' }}>
          <h2><i className="fas fa-sign-in-alt"></i> Secure Login</h2>
          <p className="login-subtitle">Enter your credentials to access your account</p>

          {/* Step 1: Email Input */}
          {step === 'email' && (
            <div className="auth-step active">
              <form onSubmit={handleEmailSubmit}>
                <div className="form-group" style={{ position: 'relative' }}>
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ width: '100%', paddingLeft: '2.5rem' }}
                  />
                  <i className="fas fa-envelope input-icon" style={{ position: 'absolute', left: '15px', top: '38px', color: '#aaa' }}></i>
                </div>
                <button type="submit" className="login-btn-large">
                  <i className="fas fa-arrow-right"></i> Continue
                </button>
              </form>
            </div>
          )}

          {/* Step 2: OTP Input */}
          {step === 'otp' && (
            <div className="auth-step active">
              <h3>Check your email</h3>
              <p>We've sent a 6-digit verification code to <strong style={{ color: 'var(--primary)' }}>{email}</strong></p>
              <p className="otp-timer">
                {timer > 0 ? `Resend code in ${timer}s` : 'Code expired'}
              </p>
              <form onSubmit={handleOtpSubmit}>
                <div className="otp-inputs">
                  {enteredOtp.map((digit, idx) => (
                    <input
                      key={idx}
                      type="text"
                      maxLength="1"
                      className="otp-digit"
                      value={digit}
                      onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      onPaste={handleOtpPaste}
                      ref={(el) => (otpInputsRef.current[idx] = el)}
                      required
                    />
                  ))}
                </div>
                <button type="submit" className="login-btn-large">
                  <i className="fas fa-check"></i> Verify & Login
                </button>
              </form>
              <div className="otp-help" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendDisabled}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: resendDisabled ? '#aaa' : 'var(--primary)',
                    cursor: resendDisabled ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    textDecoration: 'underline'
                  }}
                >
                  Didn't receive code? Resend
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Password Input */}
          {step === 'password' && (
            <div className="auth-step active">
              <form onSubmit={handlePasswordSubmit}>
                <div className="form-group" style={{ position: 'relative' }}>
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ width: '100%', paddingLeft: '2.5rem' }}
                  />
                  <i className="fas fa-lock input-icon" style={{ position: 'absolute', left: '15px', top: '38px', color: '#aaa' }}></i>
                </div>
                <div className="form-options" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem 0' }}>
                  <label className="remember-me" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem' }}>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    Remember me
                  </label>
                  <button
                    type="button"
                    className="forgot-password"
                    onClick={showPasswordReset}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.9rem' }}
                  >
                    Forgot Password?
                  </button>
                </div>
                <button type="submit" className="login-btn-large">
                  <i className="fas fa-sign-in-alt"></i> Login Securely
                </button>
              </form>
            </div>
          )}

          {/* Step 4: 2FA Authentication */}
          {step === 'twoFactor' && (
            <div className="auth-step active">
              <h3>Two-Factor Authentication</h3>
              <p>Enter the 6-digit verification code from your Google Authenticator app</p>
              <form onSubmit={handleTwoFactorSubmit} style={{ marginTop: '1.5rem' }}>
                <div className="form-group" style={{ position: 'relative', marginBottom: '1.5rem' }}>
                  <label htmlFor="twoFactorCode">Authenticator Code</label>
                  <input
                    type="text"
                    id="twoFactorCode"
                    placeholder="000 000"
                    maxLength="6"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                    style={{
                      textAlign: 'center',
                      fontSize: '1.5rem',
                      letterSpacing: '5px',
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '2px solid #e8ecf4'
                    }}
                    required
                  />
                  <i className="fas fa-key input-icon" style={{ position: 'absolute', left: '15px', top: '38px', color: '#aaa' }}></i>
                </div>
                <button type="submit" className="login-btn-large">
                  <i className="fas fa-shield-alt"></i> Verify & Access
                </button>
              </form>
            </div>
          )}

          {/* Success / Redirecting Step */}
          {step === 'loading' && (
            <div className="auth-step active" style={{ textAlign: 'center' }}>
              <div className="loading-spinner-large" style={{ fontSize: '3rem', color: 'var(--primary)', margin: '2rem 0' }}>
                <i className="fas fa-circle-notch fa-spin"></i>
              </div>
              <h3>Accessing Your Account</h3>
              <p>Redirecting to dashboard...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
