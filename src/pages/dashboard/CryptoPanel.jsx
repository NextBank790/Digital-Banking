import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const CryptoPanel = () => {
  const {
    userData,
    handleCryptoSwap,
    transactions
  } = useAuth();

  // Live Rates State (fluctuating)
  const [rates, setRates] = useState({
    usd: 1.0,
    btc: 64231.50,
    eth: 3452.12,
    sol: 142.05,
    usdt: 1.0001
  });

  const [fromAsset, setFromAsset] = useState('usd');
  const [toAsset, setToAsset] = useState('btc');
  const [amountFrom, setAmountFrom] = useState('');
  const [amountTo, setAmountTo] = useState('');

  // 1. Simulate live rate fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setRates(prev => ({
        ...prev,
        btc: prev.btc + (Math.random() - 0.5) * 80,
        eth: prev.eth + (Math.random() - 0.5) * 6,
        sol: prev.sol + (Math.random() - 0.5) * 0.4
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const getAssetBalanceValue = (asset) => {
    if (asset === 'usd') return userData?.checkingBalance || 0;
    if (asset === 'btc') return userData?.btcBalance || 0;
    if (asset === 'eth') return userData?.ethBalance || 0;
    if (asset === 'sol') return userData?.solBalance || 0;
    if (asset === 'usdt') return userData?.usdtBalance || 0;
    return 0;
  };

  const getAssetUnit = (asset) => {
    switch (asset) {
      case 'usd': return 'USD';
      case 'btc': return 'BTC';
      case 'eth': return 'ETH';
      case 'sol': return 'SOL';
      case 'usdt': return 'USDT';
      default: return '';
    }
  };

  // 2. Perform conversions
  const handleAmountFromChange = (val) => {
    setAmountFrom(val);
    const num = parseFloat(val);
    if (isNaN(num) || num <= 0) {
      setAmountTo('');
      return;
    }
    const valInUsd = num * rates[fromAsset];
    const targetVal = valInUsd / rates[toAsset];
    setAmountTo(targetVal.toFixed(6));
  };

  const handleFromAssetChange = (asset) => {
    setFromAsset(asset);
    // ensure they are not identical
    let nextTo = toAsset;
    if (asset === toAsset) {
      nextTo = asset === 'usd' ? 'btc' : 'usd';
      setToAsset(nextTo);
    }
    
    // recalculate
    const num = parseFloat(amountFrom);
    if (!isNaN(num) && num > 0) {
      const valInUsd = num * rates[asset];
      const targetVal = valInUsd / rates[nextTo];
      setAmountTo(targetVal.toFixed(6));
    }
  };

  const handleToAssetChange = (asset) => {
    setToAsset(asset);
    // ensure they are not identical
    let nextFrom = fromAsset;
    if (asset === fromAsset) {
      nextFrom = asset === 'usd' ? 'btc' : 'usd';
      setFromAsset(nextFrom);
    }

    // recalculate
    const num = parseFloat(amountFrom);
    if (!isNaN(num) && num > 0) {
      const valInUsd = num * rates[nextFrom];
      const targetVal = valInUsd / rates[asset];
      setAmountTo(targetVal.toFixed(6));
    }
  };

  const handleReverseDirection = () => {
    const prevFrom = fromAsset;
    const prevTo = toAsset;
    setFromAsset(prevTo);
    setToAsset(prevFrom);

    const num = parseFloat(amountFrom);
    if (!isNaN(num) && num > 0) {
      const valInUsd = num * rates[prevTo];
      const targetVal = valInUsd / rates[prevFrom];
      setAmountTo(targetVal.toFixed(6));
    }
  };

  const handleSubmitSwap = (e) => {
    e.preventDefault();
    const numFrom = parseFloat(amountFrom);
    const numTo = parseFloat(amountTo);

    if (isNaN(numFrom) || numFrom <= 0) {
      alert('Enter valid swap amount.');
      return;
    }

    const maxFrom = getAssetBalanceValue(fromAsset);
    if (maxFrom < numFrom) {
      alert('Insufficient asset balance.');
      return;
    }

    const usdEquiv = numFrom * rates[fromAsset];
    
    // execute
    handleCryptoSwap(fromAsset, toAsset, numFrom, numTo, usdEquiv);

    // reset forms
    setAmountFrom('');
    setAmountTo('');
  };

  // Calculate swap rate string
  const currentSwapRate = rates[fromAsset] / rates[toAsset];

  // Filter swap ledger records
  const swapHistory = transactions.filter(t => t.type === 'crypto-swap');

  return (
    <section id="panel-crypto-hub" className="dashboard-panel active">
      <div className="crypto-grid">
        
        {/* Balances & Feeds Column */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2>Crypto Assets Wallet</h2>
          <p style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>Balances of your decentralized asset accounts.</p>
          
          <div className="crypto-assets-list">
            <div className="crypto-asset-card">
              <div className="crypto-asset-info">
                <div className="crypto-icon btc"><i className="fab fa-bitcoin"></i></div>
                <div>
                  <h4>Bitcoin (BTC)</h4>
                  <small id="btcAssetVol">{(userData?.btcBalance || 0).toFixed(4)} BTC</small>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h4 id="btcAssetVal">${((userData?.btcBalance || 0) * rates.btc).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
                <small style={{ color: '#00ff88' }}>+2.4%</small>
              </div>
            </div>
            <div className="crypto-asset-card">
              <div className="crypto-asset-info">
                <div className="crypto-icon eth"><i className="fab fa-ethereum"></i></div>
                <div>
                  <h4>Ethereum (ETH)</h4>
                  <small id="ethAssetVol">{(userData?.ethBalance || 0).toFixed(4)} ETH</small>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h4 id="ethAssetVal">${((userData?.ethBalance || 0) * rates.eth).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
                <small style={{ color: '#00ff88' }}>+1.8%</small>
              </div>
            </div>
            <div className="crypto-asset-card">
              <div className="crypto-asset-info">
                <div className="crypto-icon sol"><i className="ri-copper-coin-line"></i></div>
                <div>
                  <h4>Solana (SOL)</h4>
                  <small id="solAssetVol">{(userData?.solBalance || 0).toFixed(4)} SOL</small>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h4 id="solAssetVal">${((userData?.solBalance || 0) * rates.sol).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
                <small style={{ color: '#ff3366' }}>-0.5%</small>
              </div>
            </div>
            <div className="crypto-asset-card">
              <div className="crypto-asset-info">
                <div className="crypto-icon usdt"><i className="fas fa-dollar-sign"></i></div>
                <div>
                  <h4>Tether (USDT)</h4>
                  <small id="usdtAssetVol">{(userData?.usdtBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} USDT</small>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h4 id="usdtAssetVal">${(userData?.usdtBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
                <small>Stablecoin</small>
              </div>
            </div>
          </div>

          {/* Live Lookup rates */}
          <div style={{ background: 'var(--light)', padding: '1rem', borderRadius: '10px', marginTop: '2rem' }}>
            <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.95rem' }}><i className="fas fa-chart-line"></i> Live Feed Price Lookup</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.85rem' }}>
              <div>BTC/USD: <strong id="liveFeedBtc">${rates.btc.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></div>
              <div>ETH/USD: <strong id="liveFeedEth">${rates.eth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></div>
              <div>SOL/USD: <strong id="liveFeedSol">${rates.sol.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></div>
              <div>USDT/USD: <strong>$1.0001</strong></div>
            </div>
          </div>

          {/* Swap History Ledger */}
          <div style={{ background: 'var(--light)', padding: '1rem', borderRadius: '10px', marginTop: '2rem' }}>
            <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.95rem' }}><i className="fas fa-history"></i> Swap History Ledger</h4>
            <div style={{ marginTop: '0.75rem', maxHeight: '180px', overflowY: 'auto', fontSize: '0.82rem' }} id="cryptoSwapLedgerList">
              {swapHistory.length === 0 ? (
                <p style={{ color: '#888', fontStyle: 'italic', margin: '0.5rem 0' }}>No swap transactions recorded.</p>
              ) : (
                swapHistory.map((t, index) => (
                  <div key={t.txnId || index} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', padding: '0.4rem 0' }}>
                    <div>
                      <strong>{t.recipient}</strong>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{t.time}</div>
                    </div>
                    <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                      ${parseFloat(t.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Swap Form Column */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2>Instant Crypto Swap</h2>
          <p style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>Swap USD checking directly to Crypto, or exchange between coins.</p>
          
          <form onSubmit={handleSubmitSwap} id="formCryptoSwap">
            
            {/* Sell Form Block */}
            <div className="swap-input-group">
              <div className="swap-input-hdr" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                <span>From / Sell</span>
                <span>
                  Balance: <span id="swapBalanceFromLabel">
                    {fromAsset === 'usd' 
                      ? `$${getAssetBalanceValue(fromAsset).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                      : `${getAssetBalanceValue(fromAsset).toFixed(4)} ${getAssetUnit(fromAsset)}`
                    }
                  </span>
                </span>
              </div>
              <div className="swap-fields" style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="number"
                  id="swapAmountFrom"
                  placeholder="0.00"
                  step="any"
                  style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
                  value={amountFrom}
                  onChange={(e) => handleAmountFromChange(e.target.value)}
                  required
                />
                <select
                  id="swapAssetFrom"
                  style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
                  value={fromAsset}
                  onChange={(e) => handleFromAssetChange(e.target.value)}
                >
                  <option value="usd">USD ($)</option>
                  <option value="btc">BTC (₿)</option>
                  <option value="eth">ETH (Ξ)</option>
                  <option value="sol">SOL</option>
                  <option value="usdt">USDT</option>
                </select>
              </div>
            </div>
            
            {/* Reverse Direction Icon */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '0.75rem 0' }}>
              <button
                type="button"
                className="swap-icon-btn"
                onClick={handleReverseDirection}
                style={{
                  background: 'var(--light)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <i className="fas fa-exchange-alt" style={{ transform: 'rotate(90deg)', color: 'var(--primary)' }}></i>
              </button>
            </div>

            {/* Buy Form Block */}
            <div className="swap-input-group" style={{ marginBottom: '1.25rem' }}>
              <div className="swap-input-hdr" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                <span>To / Buy</span>
                <span>
                  Balance: <span id="swapBalanceToLabel">
                    {toAsset === 'usd' 
                      ? `$${getAssetBalanceValue(toAsset).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                      : `${getAssetBalanceValue(toAsset).toFixed(4)} ${getAssetUnit(toAsset)}`
                    }
                  </span>
                </span>
              </div>
              <div className="swap-fields" style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="number"
                  id="swapAmountTo"
                  placeholder="0.00"
                  step="any"
                  style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', background: '#f8fafc' }}
                  value={amountTo}
                  readOnly
                />
                <select
                  id="swapAssetTo"
                  style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
                  value={toAsset}
                  onChange={(e) => handleToAssetChange(e.target.value)}
                >
                  <option value="btc">BTC (₿)</option>
                  <option value="usd">USD ($)</option>
                  <option value="eth">ETH (Ξ)</option>
                  <option value="sol">SOL</option>
                  <option value="usdt">USDT</option>
                </select>
              </div>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>Exchange Rate:</span>
              <span id="swapExchangeRateText">
                1 {getAssetUnit(fromAsset)} = {currentSwapRate.toFixed(6)} {getAssetUnit(toAsset)}
              </span>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Confirm Asset Swap</button>
          </form>
        </div>

      </div>
    </section>
  );
};

export default CryptoPanel;
