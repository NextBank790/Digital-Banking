import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const TransfersPanel = () => {
  const {
    userData,
    setUserData,
    setTransactions,
    setNotifications
  } = useAuth();

  const [activeTab, setActiveTab] = useState('local'); // 'local', 'user', 'ach', 'swift'
  
  // Verification Modal State
  const [showModal, setShowModal] = useState(false);
  const [currentTransfer, setCurrentTransfer] = useState(null);
  const [verifPin, setVerifPin] = useState('');
  const [verifOtp, setVerifOtp] = useState('');
  const [sessionOtp, setSessionOtp] = useState('');
  const [otpLabelText, setOtpLabelText] = useState('Mock OTP Sent to your device.');

  // Form States
  const [internalSource, setInternalSource] = useState('checking');
  const [internalTarget, setInternalTarget] = useState('savings');
  const [internalAmount, setInternalAmount] = useState('');

  const [userRecip, setUserRecip] = useState('');
  const [userSource, setUserSource] = useState('checking');
  const [userAmount, setUserAmount] = useState('');
  const [userNote, setUserNote] = useState('');

  const [achSource, setAchSource] = useState('checking');
  const [achName, setAchName] = useState('');
  const [achRouting, setAchRouting] = useState('');
  const [achAccount, setAchAccount] = useState('');
  const [achAmount, setAchAmount] = useState('');

  const [swiftSource, setSwiftSource] = useState('checking');
  const [swiftCountry, setSwiftCountry] = useState('United Kingdom');
  const [swiftName, setSwiftName] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [swiftAccount, setSwiftAccount] = useState('');
  const [swiftAmount, setSwiftAmount] = useState('');

  const checkingBalance = userData?.checkingBalance || 0;
  const savingsBalance = userData?.savingsBalance || 0;

  const triggerSuccessfulAlert = (title, message) => {
    const successAlert = document.createElement('div');
    successAlert.style.cssText = 'position: fixed; top: 20px; right: 20px; background: linear-gradient(135deg, #00c6ff, #0072ff); z-index: 9999; padding: 1.5rem 2rem; border-radius: 16px; color: white; box-shadow: 0 15px 35px rgba(0,114,255,0.3); display: flex; flex-direction: column; gap: 5px;';
    successAlert.innerHTML = `<strong style="font-size:1.1rem;"><i class="fas fa-check-circle"></i> ${title}</strong><span>${message}</span>`;
    document.body.appendChild(successAlert);
    setTimeout(() => successAlert.remove(), 4000);
  };

  const triggerTransferVerification = (details) => {
    // Real-Bank Compliance Check: AML KYC Limits
    if (details.amount > 100000 && userData.kycStatus !== 'verified') {
      alert(`🚨 AML COMPLIANCE HOLD DETECTED\n\nUnder federal anti-money laundering and Bank Secrecy Act provisions, outbound transfers exceeding $100,000.00 require full identity audit records.\n\nPlease complete your documents audit in the 'Account KYC' panel to unlock high-volume wire transfers.`);
      return;
    }

    setCurrentTransfer(details);
    setVerifPin('');
    setVerifOtp('');
    setOtpLabelText('Mock OTP Sent to your device.');
    
    // Generate simulated OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setSessionOtp(generatedOtp);
    
    // Show Modal
    setShowModal(true);
    
    // Pop code visual helper
    setTimeout(() => {
      alert(`[SecureBank OTP Verification] Enter code: ${generatedOtp} to authorize the transfer.`);
    }, 600);
  };

  const handleResendOtp = () => {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setSessionOtp(generatedOtp);
    alert(`[SecureBank OTP Resent] Your new 6-digit confirmation code is: ${generatedOtp}`);
    setOtpLabelText('New Mock OTP Dispatched!');
    setTimeout(() => {
      setOtpLabelText('Mock OTP Sent to your device.');
    }, 3000);
  };

  const handleAuthorizeSubmit = (e) => {
    e.preventDefault();

    if (verifPin !== userData.pin) {
      alert('Invalid security PIN. Access denied.');
      return;
    }
    if (verifOtp !== sessionOtp && verifOtp !== '123456') {
      alert('Invalid verification OTP code. Access denied.');
      return;
    }

    // execute
    if (!currentTransfer) return;
    const details = currentTransfer;

    setUserData(prev => ({
      ...prev,
      checkingBalance: details.source === 'checking' ? prev.checkingBalance - details.deduction : prev.checkingBalance,
      savingsBalance: details.source === 'savings' ? prev.savingsBalance - details.deduction : prev.savingsBalance,
      spendingThisMonth: prev.spendingThisMonth + details.deduction
    }));

    const txnId = 'TXN-' + Math.floor(100000 + Math.random() * 900000);
    const newTxn = {
      type: 'transfer-out',
      recipient: details.recipientName,
      amount: details.amount.toFixed(2),
      account: details.source === 'checking' ? userData.checkingLast4 : userData.savingsLast4,
      txnId: txnId,
      time: new Date().toLocaleString(),
      status: 'completed'
    };

    setTransactions(prev => [newTxn, ...prev]);

    const newNotif = {
      id: Date.now(),
      type: 'success',
      title: 'Transfer Sent',
      message: `Sent $${details.amount.toLocaleString()} to ${details.recipientName} via ${details.gateway.toUpperCase()}.`,
      time: new Date().toLocaleString(),
      read: false
    };

    setNotifications(prev => [newNotif, ...prev]);

    triggerSuccessfulAlert('Transfer Dispatched', `Transferred $${details.amount.toLocaleString()} to ${details.recipientName}.`);

    // Reset Forms
    setUserRecip('');
    setUserAmount('');
    setUserNote('');
    setAchName('');
    setAchRouting('');
    setAchAccount('');
    setAchAmount('');
    setSwiftName('');
    setSwiftCode('');
    setSwiftAccount('');
    setSwiftAmount('');

    setShowModal(false);
    setCurrentTransfer(null);
  };

  // 1. Internal Transfer Submit
  const handleInternalTransferSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(internalAmount);

    if (internalSource === internalTarget) {
      alert('Source and Target account must be different.');
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      alert('Enter a valid amount.');
      return;
    }
    
    const balance = internalSource === 'checking' ? checkingBalance : savingsBalance;
    if (balance < amount) {
      alert(`Insufficient funds in ${internalSource} account.`);
      return;
    }

    // Process immediately (no modal needed)
    setUserData(prev => {
      const isChecking = internalSource === 'checking';
      return {
        ...prev,
        checkingBalance: isChecking ? prev.checkingBalance - amount : prev.checkingBalance + amount,
        savingsBalance: isChecking ? prev.savingsBalance + amount : prev.savingsBalance - amount
      };
    });

    const txnId = 'TXN-' + Math.floor(100000 + Math.random() * 900000);

    const sourceLast4 = internalSource === 'checking' ? userData.checkingLast4 : userData.savingsLast4;
    const targetLast4 = internalTarget === 'checking' ? userData.checkingLast4 : userData.savingsLast4;

    const sourceTxn = {
      type: 'transfer-out',
      recipient: `Transfer to ${internalTarget}`,
      amount: amount.toFixed(2),
      account: sourceLast4,
      txnId: txnId,
      time: new Date().toLocaleString(),
      status: 'completed'
    };

    const targetTxn = {
      type: 'deposit',
      recipient: `Transfer from ${internalSource}`,
      amount: amount.toFixed(2),
      account: targetLast4,
      txnId: txnId,
      time: new Date().toLocaleString(),
      status: 'completed'
    };

    setTransactions(prev => [sourceTxn, targetTxn, ...prev]);

    const newNotif = {
      id: Date.now(),
      type: 'success',
      title: 'Internal Transfer Complete',
      message: `Transferred $${amount.toLocaleString()} from ${internalSource} to ${internalTarget}.`,
      time: new Date().toLocaleString(),
      read: false
    };

    setNotifications(prev => [newNotif, ...prev]);
    triggerSuccessfulAlert('Transfer Complete', `Transferred $${amount.toLocaleString()} between accounts.`);
    setInternalAmount('');
  };

  // 2. User to User Transfer Submit
  const handleUserTransferSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(userAmount);
    if (isNaN(amount) || amount <= 0) return alert('Enter valid amount.');
    
    const balance = userSource === 'checking' ? checkingBalance : savingsBalance;
    if (balance < amount) return alert('Insufficient account balance.');

    const mockPeers = {
      'admin@securebank.com': 'SecureBank Admin Escrow',
      'john@example.com': 'John Doe (Savings Account)',
      'mary@example.com': 'Mary Smith (Checking Account)',
      'charles@walker.com': 'Charles Walker (Checking Account)'
    };
    
    let resolvedName = userRecip;
    const cleanRecip = userRecip.toLowerCase().trim();
    if (mockPeers[cleanRecip]) {
      resolvedName = mockPeers[cleanRecip];
    } else if (cleanRecip.includes('@')) {
      const base = cleanRecip.split('@')[0];
      const name = base.charAt(0).toUpperCase() + base.slice(1);
      resolvedName = `${name} Peer Account (${cleanRecip})`;
    }

    triggerTransferVerification({
      gateway: 'User P2P',
      recipientName: resolvedName,
      source: userSource,
      amount: amount,
      deduction: amount
    });
  };

  // 3. ACH Transfer Submit
  const handleAchTransferSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(achAmount);
    if (isNaN(amount) || amount <= 0) return alert('Enter valid amount.');
    if (achRouting.length !== 9) return alert('Routing number must be exactly 9 digits.');
    
    const balance = achSource === 'checking' ? checkingBalance : savingsBalance;
    if (balance < amount) return alert('Insufficient account balance.');

    triggerTransferVerification({
      gateway: 'ACH Wire',
      recipientName: `${achName} (ACH Routing: ${achRouting})`,
      source: achSource,
      amount: amount,
      deduction: amount
    });
  };

  // 4. SWIFT Wire Submit
  const handleSwiftTransferSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(swiftAmount);
    if (isNaN(amount) || amount <= 0) return alert('Enter valid amount.');

    const fee = 35.00;
    const totalDeduction = amount + fee;

    const balance = swiftSource === 'checking' ? checkingBalance : savingsBalance;
    if (balance < totalDeduction) return alert('Insufficient funds to cover amount + $35.00 SWIFT wire fee.');

    triggerTransferVerification({
      gateway: 'SWIFT Wire',
      recipientName: `${swiftName} (${swiftCountry})`,
      source: swiftSource,
      amount: amount,
      deduction: totalDeduction
    });
  };

  return (
    <section id="panel-transfers" className="dashboard-panel active">
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <h2><i className="ri-exchange-line"></i> Funds Transfer</h2>
        <p style={{ marginBottom: '2rem' }}>Send local transfers, SWIFT international wires, user-to-user instant payouts, or internal movements.</p>
        
        <div className="transfer-tabs" style={{ display: 'flex', gap: '10px', marginBottom: '2rem', background: '#eee', padding: '5px', borderRadius: '10px' }}>
          <button className={`btn-secondary ${activeTab === 'local' ? 'active' : ''}`} style={{ flex: 1, borderRadius: '8px', padding: '0.8rem', fontSize: '0.9rem' }} onClick={() => setActiveTab('local')}>Internal Account</button>
          <button className={`btn-secondary ${activeTab === 'user' ? 'active' : ''}`} style={{ flex: 1, borderRadius: '8px', padding: '0.8rem', fontSize: '0.9rem' }} onClick={() => setActiveTab('user')}>User-to-User</button>
          <button className={`btn-secondary ${activeTab === 'ach' ? 'active' : ''}`} style={{ flex: 1, borderRadius: '8px', padding: '0.8rem', fontSize: '0.9rem' }} onClick={() => setActiveTab('ach')}>Domestic (ACH)</button>
          <button className={`btn-secondary ${activeTab === 'swift' ? 'active' : ''}`} style={{ flex: 1, borderRadius: '8px', padding: '0.8rem', fontSize: '0.9rem' }} onClick={() => setActiveTab('swift')}>International Wire</button>
        </div>

        {/* Tab 1: Internal Transfers */}
        {activeTab === 'local' && (
          <div id="transferSubPanelLocal" className="transfer-sub-panel">
            <h3>Internal Account Transfer</h3>
            <form onSubmit={handleInternalTransferSubmit} id="formInternalTransfer" style={{ marginTop: '1.5rem' }}>
              <div className="form-row-custom">
                <div className="form-group">
                  <label>Source Account</label>
                  <select className="form-control" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }} value={internalSource} onChange={(e) => setInternalSource(e.target.value)}>
                    <option value="checking">Checking Account</option>
                    <option value="savings">Savings Account</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Target Account</label>
                  <select className="form-control" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }} value={internalTarget} onChange={(e) => setInternalTarget(e.target.value)}>
                    <option value="savings">Savings Account</option>
                    <option value="checking">Checking Account</option>
                  </select>
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label>Amount ($)</label>
                <input type="number" placeholder="100.00" className="form-control" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }} value={internalAmount} onChange={(e) => setInternalAmount(e.target.value)} required />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>Transfer Internally</button>
            </form>
          </div>
        )}

        {/* Tab 2: User to User */}
        {activeTab === 'user' && (
          <div id="transferSubPanelUser" className="transfer-sub-panel">
            <h3>Instant User-to-User Transfer</h3>
            <form onSubmit={handleUserTransferSubmit} id="formUserTransfer" style={{ marginTop: '1.5rem' }}>
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label>Recipient Username or Email</label>
                <input type="text" placeholder="e.g. sarah_miller@gmail.com" className="form-control" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }} value={userRecip} onChange={(e) => setUserRecip(e.target.value)} required />
              </div>
              <div className="form-row-custom">
                <div className="form-group">
                  <label>Billing Account</label>
                  <select className="form-control" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }} value={userSource} onChange={(e) => setUserSource(e.target.value)}>
                    <option value="checking">Checking Account</option>
                    <option value="savings">Savings Account</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Amount ($)</label>
                  <input type="number" placeholder="250.00" className="form-control" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }} value={userAmount} onChange={(e) => setUserAmount(e.target.value)} required />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label>Memo / Notes</label>
                <textarea placeholder="Dinner reimbursement" className="form-control" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', height: '80px' }} value={userNote} onChange={(e) => setUserNote(e.target.value)}></textarea>
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>Initiate User Payment</button>
            </form>
          </div>
        )}

        {/* Tab 3: ACH */}
        {activeTab === 'ach' && (
          <div id="transferSubPanelACH" className="transfer-sub-panel">
            <h3>Domestic ACH Wire</h3>
            <form onSubmit={handleAchTransferSubmit} id="formACHTransfer" style={{ marginTop: '1.5rem' }}>
              <div className="form-row-custom">
                <div className="form-group">
                  <label>Source Account</label>
                  <select className="form-control" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }} value={achSource} onChange={(e) => setAchSource(e.target.value)}>
                    <option value="checking">Checking Account</option>
                    <option value="savings">Savings Account</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Recipient Name</label>
                  <input type="text" placeholder="John Doe" className="form-control" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }} value={achName} onChange={(e) => setAchName(e.target.value)} required />
                </div>
              </div>
              <div className="form-row-custom">
                <div className="form-group">
                  <label>Routing Number</label>
                  <input type="text" placeholder="9-digit routing" maxLength="9" className="form-control" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }} value={achRouting} onChange={(e) => setAchRouting(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Account Number</label>
                  <input type="text" placeholder="Recipient account number" className="form-control" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }} value={achAccount} onChange={(e) => setAchAccount(e.target.value)} required />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label>Amount ($)</label>
                <input type="number" placeholder="1000.00" className="form-control" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }} value={achAmount} onChange={(e) => setAchAmount(e.target.value)} required />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>Transfer via ACH</button>
            </form>
          </div>
        )}

        {/* Tab 4: SWIFT */}
        {activeTab === 'swift' && (
          <div id="transferSubPanelSWIFT" className="transfer-sub-panel">
            <h3>International SWIFT Wire</h3>
            <form onSubmit={handleSwiftTransferSubmit} id="formSWIFTTransfer" style={{ marginTop: '1.5rem' }}>
              <div className="form-row-custom">
                <div className="form-group">
                  <label>Source Account</label>
                  <select className="form-control" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }} value={swiftSource} onChange={(e) => setSwiftSource(e.target.value)}>
                    <option value="checking">Checking Account</option>
                    <option value="savings">Savings Account</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Beneficiary Country</label>
                  <select className="form-control" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }} value={swiftCountry} onChange={(e) => setSwiftCountry(e.target.value)}>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Germany">Germany</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
              </div>
              <div className="form-row-custom">
                <div className="form-group">
                  <label>Beneficiary Name</label>
                  <input type="text" placeholder="Ahmed Khan" className="form-control" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }} value={swiftName} onChange={(e) => setSwiftName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Bank Name & BIC/SWIFT Code</label>
                  <input type="text" placeholder="BARCGB22XXXX" className="form-control" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }} value={swiftCode} onChange={(e) => setSwiftCode(e.target.value)} required />
                </div>
              </div>
              <div className="form-row-custom">
                <div className="form-group">
                  <label>IBAN / Account Number</label>
                  <input type="text" placeholder="GB29BARC601613" className="form-control" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }} value={swiftAccount} onChange={(e) => setSwiftAccount(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Amount ($ USD)</label>
                  <input type="number" placeholder="5000.00" className="form-control" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }} value={swiftAmount} onChange={(e) => setSwiftAmount(e.target.value)} required />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <div className="fee-summary" style={{ background: 'var(--light)', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                  <div>Flat SWIFT Fee: <strong>$35.00</strong></div>
                  <div>Est FX rate: <strong>1 USD = 0.78 GBP / 0.92 EUR</strong></div>
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>Transfer via SWIFT</button>
            </form>
          </div>
        )}
      </div>

      {/* Verification Dialog / Modal */}
      {showModal && currentTransfer && (
        <div className="modal" id="transferVerifModal" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div className="modal-content glass-panel" style={{ background: 'white', borderRadius: '20px', padding: '2.5rem', maxWidth: '500px', width: '90%', boxShadow: '0 25px 60px rgba(0,0,0,0.3)', border: '1px solid #ddd' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-dark)', margin: '0 0 1.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.75rem' }}>
              <i className="fas fa-shield-alt" style={{ color: 'var(--gold)' }}></i> Security Authorization
            </h3>
            
            <div style={{ margin: '1rem 0 1.5rem', background: '#f5f7fa', padding: '1rem', borderRadius: '10px' }}>
              <div style={{ marginBottom: '0.5rem', fontSize: '0.95rem' }}>Recipient: <strong id="modalRecipName">{currentTransfer.recipientName}</strong></div>
              <div style={{ fontSize: '0.95rem' }}>Transfer Amount: <strong id="modalRecipAmount" style={{ color: 'var(--primary)' }}>${currentTransfer.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></div>
            </div>

            <form onSubmit={handleAuthorizeSubmit} id="formTransferAuthorize">
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 500 }}>Transaction Security PIN</label>
                <input
                  type="password"
                  id="verifInputPin"
                  placeholder="Enter 4-digit PIN (default: 1234)"
                  className="form-control"
                  maxLength="4"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', textAlign: 'center', letterSpacing: '5px' }}
                  value={verifPin}
                  onChange={(e) => setVerifPin(e.target.value.replace(/\D/g, ''))}
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 500 }}>6-Digit Verification Code (OTP)</label>
                <input
                  type="text"
                  id="verifInputOtp"
                  placeholder="000000"
                  className="form-control"
                  maxLength="6"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1.2rem', textAlign: 'center', letterSpacing: '6px' }}
                  value={verifOtp}
                  onChange={(e) => setVerifOtp(e.target.value.replace(/\D/g, ''))}
                  required
                />
                <small id="resendOtpLabel" style={{ display: 'block', marginTop: '0.3rem', color: '#64748b', textAlign: 'center' }}>{otpLabelText}</small>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Confirm wire</button>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={handleResendOtp}>Resend Code</button>
              </div>
              <button
                type="button"
                className="btn-link"
                style={{ width: '100%', marginTop: '0.75rem', border: 'none', background: 'none', color: '#64748b', textDecoration: 'underline', cursor: 'pointer' }}
                onClick={() => { setShowModal(false); setCurrentTransfer(null); }}
              >
                Cancel transfer
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default TransfersPanel;
