import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const DepositsWithdrawalsPanel = () => {
  const {
    userData,
    handleDeposit,
    handleWithdrawal
  } = useAuth();

  const [depositGateway, setDepositGateway] = useState('wire');
  const [depositAmount, setDepositAmount] = useState('');
  const [receiptName, setReceiptName] = useState('No file selected');

  const [withdrawSource, setWithdrawSource] = useState('checking');
  const [withdrawMethod, setWithdrawMethod] = useState('wire');
  const [withdrawDestination, setWithdrawDestination] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawPin, setWithdrawPin] = useState('');

  const checkingBalance = userData?.checkingBalance || 0;
  const savingsBalance = userData?.savingsBalance || 0;

  const getDepositDirections = () => {
    switch (depositGateway) {
      case 'wire':
        return (
          <>
            <strong>Wire Coordinates:</strong><br />
            Bank Name: SecureBank Corp NY<br />
            Routing: 021000021<br />
            Account: 123456783456
          </>
        );
      case 'crypto_btc':
        return (
          <>
            <strong>BTC Wallet Address:</strong><br />
            Address: <code style={{ fontSize: '0.75rem' }}>bc1q7yqnd9357hdsjkgfskjfhsdkjghskdfj</code><br />
            Send Bitcoin and upload the TX hash screenshot below.
          </>
        );
      case 'crypto_usdt':
        return (
          <>
            <strong>USDT TRC20 Wallet Address:</strong><br />
            Address: <code style={{ fontSize: '0.75rem' }}>TX8537593hsdjgfksjfhsdkjghskdfj</code><br />
            Transfer USDT and upload confirmation file.
          </>
        );
      case 'card':
        return (
          <>
            <strong>Credit / Debit Card:</strong><br />
            Premium card gateway active. Flat fee of 2.5% processor charge applies.
          </>
        );
      default:
        return null;
    }
  };

  const getWithdrawalDetails = () => {
    switch (withdrawMethod) {
      case 'wire':
        return {
          label: 'Destination Routing & Account',
          placeholder: '021000021 / 987654321'
        };
      case 'crypto_btc':
        return {
          label: 'External BTC Wallet Address',
          placeholder: 'bc1q...'
        };
      case 'crypto_usdt':
        return {
          label: 'External USDT TRC20 Wallet Address',
          placeholder: 'T...'
        };
      default:
        return {
          label: 'Destination Account / Address',
          placeholder: ''
        };
    }
  };

  const handleReceiptChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setReceiptName(e.target.files[0].name);
    } else {
      setReceiptName('No file selected');
    }
  };

  const handleDepositSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Enter valid deposit amount.');
      return;
    }

    // execute
    handleDeposit(depositGateway, amount);

    // success alert
    const successAlert = document.createElement('div');
    successAlert.style.cssText = 'position: fixed; top: 20px; right: 20px; background: linear-gradient(135deg, #00c6ff, #0072ff); z-index: 9999; padding: 1.5rem 2rem; border-radius: 16px; color: white; box-shadow: 0 15px 35px rgba(0,114,255,0.3); display: flex; flex-direction: column; gap: 5px;';
    successAlert.innerHTML = `<strong style="font-size:1.1rem;"><i class="fas fa-check-circle"></i> Deposit Approved</strong><span>$${amount.toLocaleString()} has been added to Checking Account.</span>`;
    document.body.appendChild(successAlert);
    setTimeout(() => successAlert.remove(), 4000);

    // reset
    setDepositAmount('');
    setReceiptName('No file selected');
  };

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Enter valid amount.');
      return;
    }
    if (withdrawPin !== userData.pin) {
      alert('Invalid transaction PIN.');
      return;
    }

    const balance = withdrawSource === 'checking' ? checkingBalance : savingsBalance;
    if (balance < amount) {
      alert('Insufficient funds in selected account.');
      return;
    }

    // execute
    handleWithdrawal(withdrawSource, withdrawMethod, withdrawDestination, amount);

    // success alert
    const successAlert = document.createElement('div');
    successAlert.style.cssText = 'position: fixed; top: 20px; right: 20px; background: linear-gradient(135deg, #ff3366, #c82333); z-index: 9999; padding: 1.5rem 2rem; border-radius: 16px; color: white; box-shadow: 0 15px 35px rgba(220,53,69,0.3); display: flex; flex-direction: column; gap: 5px;';
    successAlert.innerHTML = `<strong style="font-size:1.1rem;"><i class="fas fa-check-circle"></i> Withdrawal Logged</strong><span>$${amount.toLocaleString()} has been deducted. Wire in progress.</span>`;
    document.body.appendChild(successAlert);
    setTimeout(() => successAlert.remove(), 4000);

    // reset
    setWithdrawDestination('');
    setWithdrawAmount('');
    setWithdrawPin('');
  };

  const currentWithdrawConfig = getWithdrawalDetails();

  return (
    <section id="panel-deposits-withdrawals" className="dashboard-panel active">
      <div className="settings-grid">
        
        {/* Deposit Column */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2>Account Deposit</h2>
          <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>Choose a gateway and submit your deposit credentials below.</p>
          
          <form onSubmit={handleDepositSubmit} id="formDeposit">
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Payment Method / Gateway</label>
              <select
                id="depositGateway"
                className="form-control"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}
                value={depositGateway}
                onChange={(e) => setDepositGateway(e.target.value)}
              >
                <option value="wire">Bank Wire Transfer</option>
                <option value="crypto_btc">Crypto (Bitcoin Wallet)</option>
                <option value="crypto_usdt">Crypto (Tether TRC20)</option>
                <option value="card">Credit / Debit Card</option>
              </select>
            </div>
            
            {/* Directions Box */}
            <div id="depositDirections" style={{ background: 'var(--light)', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem', lineHeight: '1.5' }}>
              {getDepositDirections()}
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Deposit Amount ($)</label>
              <input
                type="number"
                id="depositAmount"
                placeholder="500.00"
                className="form-control"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Upload Proof of Payment (Receipt)</label>
              <input
                type="file"
                id="depositReceiptFile"
                className="form-control"
                style={{ width: '100%', padding: '0.5rem', borderRadius: '8px' }}
                onChange={handleReceiptChange}
              />
              <div id="receiptPreviewBox" className="upload-preview" style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#f8fafc', borderRadius: '6px', fontSize: '0.8rem', border: '1px dashed #cbd5e1' }}>
                {receiptName}
              </div>
            </div>
            
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Submit Deposit</button>
          </form>
        </div>

        {/* Withdrawal Column */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2>Withdraw Funds</h2>
          <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>Deduct funds from your balance and send to an external wallet or account.</p>
          
          <form onSubmit={handleWithdrawSubmit} id="formWithdrawal">
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Source Account</label>
              <select
                id="withdrawSource"
                className="form-control"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}
                value={withdrawSource}
                onChange={(e) => setWithdrawSource(e.target.value)}
              >
                <option value="checking">Checking Account</option>
                <option value="savings">Savings Account</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Withdrawal Method</label>
              <select
                id="withdrawMethod"
                className="form-control"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}
                value={withdrawMethod}
                onChange={(e) => setWithdrawMethod(e.target.value)}
              >
                <option value="wire">External Bank Account</option>
                <option value="crypto_btc">BTC Wallet Address</option>
                <option value="crypto_usdt">USDT TRC20 Address</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label id="withdrawDestLabel">{currentWithdrawConfig.label}</label>
              <input
                type="text"
                id="withdrawDestination"
                placeholder={currentWithdrawConfig.placeholder}
                className="form-control"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}
                value={withdrawDestination}
                onChange={(e) => setWithdrawDestination(e.target.value)}
                required
              />
            </div>
            <div className="form-row-custom">
              <div className="form-group">
                <label>Amount ($)</label>
                <input
                  type="number"
                  id="withdrawAmount"
                  placeholder="1000.00"
                  className="form-control"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Transaction PIN</label>
                <input
                  type="password"
                  id="withdrawPin"
                  placeholder="****"
                  maxLength="4"
                  className="form-control"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}
                  value={withdrawPin}
                  onChange={(e) => setWithdrawPin(e.target.value.replace(/\D/g, ''))}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn-primary"
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, var(--danger) 0%, #c82333 100%)',
                border: 'none',
                boxShadow: '0 4px 15px rgba(220, 53, 69, 0.2)'
              }}
            >
              Withdraw Securely
            </button>
          </form>
        </div>

      </div>
    </section>
  );
};

export default DepositsWithdrawalsPanel;
