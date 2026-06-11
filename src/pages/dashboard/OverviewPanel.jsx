import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const OverviewPanel = ({ setActivePanel }) => {
  const {
    userData,
    setUserData,
    transactions,
    setNotifications,
    transactions: bankTransactions,
    setTransactions
  } = useAuth();

  const [showQuickSend, setShowQuickSend] = useState(false);
  const [quickRecipient, setQuickRecipient] = useState('John Doe (checking)');
  const [quickAmount, setQuickAmount] = useState('');

  const checkingBalance = userData?.checkingBalance || 0;
  const savingsBalance = userData?.savingsBalance || 0;
  const totalBalance = checkingBalance + savingsBalance;

  const handleExportCSV = () => {
    if (bankTransactions.length === 0) {
      alert('No transaction data to export.');
      return;
    }
    
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Transaction ID,Type,Recipient,Amount,Billing Account,Date/Time,Status\n';
    
    bankTransactions.forEach(t => {
      csvContent += `"${t.txnId}","${t.type}","${t.recipient}","${t.amount}","****${t.account}","${t.time}","${t.status || 'completed'}"\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `securebank_statement_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleQuickSendSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(quickAmount);

    if (isNaN(amount) || amount <= 0) {
      alert('Enter a valid amount.');
      return;
    }
    if (checkingBalance < amount) {
      alert('Insufficient funds in Checking account.');
      return;
    }

    // execute
    setUserData(prev => ({
      ...prev,
      checkingBalance: prev.checkingBalance - amount,
      spendingThisMonth: prev.spendingThisMonth + amount
    }));

    const txnId = 'TXN-' + Math.floor(100000 + Math.random() * 900000);
    const newTxn = {
      type: 'transfer-out',
      recipient: quickRecipient,
      amount: amount.toFixed(2),
      account: userData.checkingLast4,
      txnId: txnId,
      time: new Date().toLocaleString(),
      status: 'completed'
    };

    setTransactions(prev => [newTxn, ...prev]);

    const newNotif = {
      id: Date.now(),
      type: 'success',
      title: 'Quick Send Sent',
      message: `Dispatched $${amount.toLocaleString()} to ${quickRecipient}.`,
      time: new Date().toLocaleString(),
      read: false
    };

    setNotifications(prev => [newNotif, ...prev]);

    // trigger success popup
    const successAlert = document.createElement('div');
    successAlert.style.cssText = 'position: fixed; top: 20px; right: 20px; background: linear-gradient(135deg, #00c6ff, #0072ff); z-index: 9999; padding: 1.5rem 2rem; border-radius: 16px; color: white; box-shadow: 0 15px 35px rgba(0,114,255,0.3); display: flex; flex-direction: column; gap: 5px;';
    successAlert.innerHTML = `<strong style="font-size:1.1rem;"><i class="fas fa-check-circle"></i> Transfer Dispatched</strong><span>Transferred $${amount.toLocaleString()} to ${quickRecipient}.</span>`;
    document.body.appendChild(successAlert);
    setTimeout(() => successAlert.remove(), 4000);

    // reset
    setQuickAmount('');
    setShowQuickSend(false);
  };

  return (
    <section id="panel-overview" className="dashboard-panel active">
      <div className="balance-card premium-card">
        <div className="card-brand">
          <span className="brand-name"><i className="fas fa-university"></i> SecureBank</span>
          <span className="card-tier" id="cardTierLabel">PLATINUM MEMBERSHIP</span>
        </div>
        <div className="card-middle">
          <svg className="card-chip" width="48" height="38" viewBox="0 0 48 38" fill="none" style={{ borderRadius: '6px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}>
            <rect width="48" height="38" rx="6" fill="url(#chipGold)" />
            <path d="M 0 12 H 14 M 0 19 H 14 M 0 26 H 14" stroke="#7a5c00" strokeWidth="1.2" />
            <path d="M 34 12 H 48 M 34 19 H 48 M 34 26 H 48" stroke="#7a5c00" strokeWidth="1.2" />
            <path d="M 14 0 V 38 M 34 0 V 38" stroke="#7a5c00" strokeWidth="1.2" />
            <rect x="18" y="10" width="12" height="18" rx="2" fill="#cca000" stroke="#7a5c00" strokeWidth="1.2" />
            <defs>
              <linearGradient id="chipGold" x1="0" y1="0" x2="48" y2="38" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ffe875" stopOpacity="1" />
                <stop offset="50%" stopColor="#ffd700" stopOpacity="1" />
                <stop offset="100%" stopColor="#cca000" stopOpacity="1" />
              </linearGradient>
            </defs>
          </svg>
          <i className="fas fa-wifi contactless-icon" style={{ transform: 'rotate(90deg)', color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem' }}></i>
        </div>
        <div className="card-main-balance">
          <span className="balance-lbl">TOTAL COMBINED BALANCE</span>
          <div className="balance-amount" id="totalNetWorthText">
            ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="card-footer-details">
          <div className="card-numbers">
            <div className="account-num-label">CHECKING</div>
            <div className="account-num-value" id="cardCheckingNumText">**** **** **** {userData?.checkingLast4 || '3456'}</div>
          </div>
          <div className="card-numbers">
            <div className="account-num-label">SAVINGS</div>
            <div className="account-num-value" id="cardSavingsNumText">**** **** **** {userData?.savingsLast4 || '7890'}</div>
          </div>
          <div className="card-logo">
            <div className="visa-circles">
              <span className="circle-blue"></span>
              <span className="circle-gold"></span>
            </div>
          </div>
        </div>
        <div className="balance-change-container">
          <div className="balance-change profit">
            <i className="ri-arrow-up-line"></i> +2.3% income growth
          </div>
        </div>
        <div className="balance-buttons">
          <button className="btn-primary" onClick={() => setActivePanel('transfers')}>Transfer Money <i className="fas fa-paper-plane"></i></button>
          <button className="btn-secondary" onClick={() => setShowQuickSend(true)}>Quick Send <i className="fas fa-bolt"></i></button>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="accounts-sidebar glass-panel">
          <div className="accounts-header">
            <h3>Your Accounts</h3>
          </div>
          <div className="account-item active">
            <div className="account-icon">
              <i className="ri-school-line"></i>
            </div>
            <div className="account-info">
              <h4>Checking Account</h4>
              <div className="account-number" id="checkingLast4ValText">**** {userData?.checkingLast4 || '3456'}</div>
              <div className="account-balance" id="checkingBalanceText">${checkingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            </div>
          </div>
          <div className="account-item">
            <div className="account-icon success">
              <i className="fas fa-piggy-bank"></i>
            </div>
            <div className="account-info">
              <h4>Savings Account</h4>
              <div className="account-number" id="savingsLast4ValText">**** {userData?.savingsLast4 || '7890'}</div>
              <div className="account-balance" id="savingsBalanceText">${savingsBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            </div>
          </div>
        </div>

        <div className="main-content">
          <div className="cards-grid">
            <div className="metric-card glass-panel">
              <div className="metric-icon"><i className="ri-arrow-up-line"></i></div>
              <div className="metric-value profit" id="incomeMetricText">${(userData?.incomeThisMonth || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
              <div className="metric-label">Monthly Income</div>
              <div className="chart-illustration">
                <div className="chart-bar" style={{ height: '40px' }}><span className="chart-bar-label">W1</span></div>
                <div className="chart-bar" style={{ height: '60px' }}><span className="chart-bar-label">W2</span></div>
                <div className="chart-bar" style={{ height: '80px' }}><span className="chart-bar-label">W3</span></div>
                <div className="chart-bar" style={{ height: '95px' }}><span className="chart-bar-label">W4</span></div>
              </div>
            </div>
            <div className="metric-card glass-panel">
              <div className="metric-icon"><i className="ri-arrow-down-line"></i></div>
              <div className="metric-value loss" id="spendingMetricText">${(userData?.spendingThisMonth || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
              <div className="metric-label">Monthly Outflow</div>
              <div className="chart-illustration">
                <div className="chart-bar spend" style={{ height: '70px' }}><span className="chart-bar-label">W1</span></div>
                <div className="chart-bar spend" style={{ height: '50px' }}><span className="chart-bar-label">W2</span></div>
                <div className="chart-bar spend" style={{ height: '30px' }}><span className="chart-bar-label">W3</span></div>
                <div className="chart-bar spend" style={{ height: '45px' }}><span className="chart-bar-label">W4</span></div>
              </div>
            </div>
          </div>

          <div className="recent-transactions glass-panel" style={{ marginTop: '2rem' }}>
            <div className="trans-header">
              <h3>Recent Transactions</h3>
              <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={handleExportCSV}>
                <i className="fas fa-file-download"></i> Export History
              </button>
            </div>
            <div className="trans-list" id="overviewTransList">
              {bankTransactions.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#888', padding: '1rem' }}>No transaction history.</p>
              ) : (
                bankTransactions.slice(0, 5).map((t, index) => {
                  const isLoss = ['transfer-out', 'withdrawal', 'crypto-swap', 'card-txn', 'investment'].includes(t.type);
                  const sign = isLoss ? '-' : '+';
                  const amtClass = isLoss ? 'loss' : 'profit';
                  
                  let iconName = 'ri-arrow-right-up-line';
                  if (t.type === 'deposit') iconName = 'ri-arrow-left-down-line';
                  else if (t.type === 'withdrawal') iconName = 'ri-arrow-right-up-line';
                  else if (t.type === 'crypto-swap') iconName = 'ri-swap-line';
                  else if (t.type === 'investment') iconName = 'ri-pie-chart-line';

                  return (
                    <div className="trans-item" key={t.txnId || index}>
                      <div className="trans-details">
                        <div
                          className="trans-icon"
                          style={{
                            background: isLoss ? 'var(--danger-glow)' : 'var(--success-glow)',
                            color: isLoss ? 'var(--danger)' : 'var(--success)'
                          }}
                        >
                          <i className={iconName}></i>
                        </div>
                        <div className="trans-info">
                          <h4>{t.recipient}</h4>
                          <p>{t.time} | Ref: {t.txnId}</p>
                        </div>
                      </div>
                      <div className={`trans-amount ${amtClass}`}>
                        {sign}${parseFloat(t.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Send Modal */}
      {showQuickSend && (
        <div className="modal" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div className="modal-content glass-panel" style={{ background: 'white', borderRadius: '20px', padding: '2.5rem', maxWidth: '500px', width: '90%', boxShadow: '0 25px 60px rgba(0,0,0,0.3)', border: '1px solid #ddd' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-dark)', margin: '0 0 1.5rem' }}>
              <i className="fas fa-bolt" style={{ color: 'var(--gold)' }}></i> Quick Transfer
            </h3>
            <form onSubmit={handleQuickSendSubmit} id="formQuickSend">
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Select Contact</label>
                <select
                  id="quickRecipientSelect"
                  className="form-control"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
                  value={quickRecipient}
                  onChange={(e) => setQuickRecipient(e.target.value)}
                >
                  <option value="John Doe (checking)">John Doe (Checking ****1234)</option>
                  <option value="Sarah Miller (savings)">Sarah Miller (Savings ****5678)</option>
                  <option value="Mike Johnson (checking)">Mike Johnson (Checking ****9012)</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Amount ($)</label>
                <input
                  type="number"
                  id="quickSendAmountInput"
                  placeholder="250.00"
                  className="form-control"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
                  value={quickAmount}
                  onChange={(e) => setQuickAmount(e.target.value)}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Send Payout</button>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowQuickSend(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default OverviewPanel;
