import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const DEFAULT_PLANS = [
  { id: 'yield_alpha', planName: 'Alpha Yield Staking', apr: 12.0, days: 30, details: 'USDT Staking pool locks capital for 30 days. Auto compounding interest.' },
  { id: 'stake_eth', planName: 'Ethereum Core Stake', apr: 8.5, days: 90, details: 'Locks ETH to validate transactions. Lower risk premium profile.' },
  { id: 'quant_titan', planName: 'Titan Quant AI Arbitrage', apr: 24.5, days: 180, details: 'Leverages high-frequency machine learning triggers. Risk capital lockup.' }
];

const WealthPanel = () => {
  const {
    userData,
    setUserData,
    investments,
    joinStakingPlan,
    cancelStakingPlan,
    renewSignals,
    tradingHistory
  } = useAuth();

  const [investmentPlans, setInvestmentPlans] = useState(DEFAULT_PLANS);
  const [investSort, setInvestSort] = useState('apr-desc');

  // MT4 States
  const [mt4Broker, setMt4Broker] = useState('');
  const [mt4Id, setMt4Id] = useState('');
  const [mt4Pass, setMt4Pass] = useState('');
  const [mt4SignalsCheck, setMt4SignalsCheck] = useState(true);
  const [mt4Connected, setMt4Connected] = useState(false);

  // Sync MT4 Setup from localStorage on mount
  useEffect(() => {
    const setup = JSON.parse(localStorage.getItem('bankMT4Setup'));
    if (setup) {
      setMt4Broker(setup.broker || '');
      setMt4Id(setup.id || '');
      setMt4Pass('********');
      setMt4Connected(true);
    }
  }, []);

  // Handle Sort
  const handleSortChange = (val) => {
    setInvestSort(val);
    const sorted = [...DEFAULT_PLANS];
    if (val === 'apr-desc') {
      sorted.sort((a, b) => b.apr - a.apr);
    } else if (val === 'apr-asc') {
      sorted.sort((a, b) => a.apr - b.apr);
    } else if (val === 'days-desc') {
      sorted.sort((a, b) => b.days - a.days);
    }
    setInvestmentPlans(sorted);
  };

  // MT4 API submit
  const handleMT4Submit = (e) => {
    e.preventDefault();
    if (!mt4Broker || !mt4Id || !mt4Pass) {
      alert('Please fill in MT4 credentials');
      return;
    }
    const setup = { broker: mt4Broker, id: mt4Id };
    localStorage.setItem('bankMT4Setup', JSON.stringify(setup));
    setMt4Pass('********');
    setMt4Connected(true);
    alert('MT4 API Bridge connection established successfully.');
  };

  const handleDeleteMT4 = () => {
    localStorage.removeItem('bankMT4Setup');
    setMt4Broker('');
    setMt4Id('');
    setMt4Pass('');
    setMt4Connected(false);
    alert('MT4 API Bridge configuration destroyed.');
  };

  // Staking actions
  const handleJoinStaking = (plan) => {
    const amountStr = prompt(`Enter investment principal for ${plan.planName} ($):`, '1000');
    if (amountStr === null) return;
    const amount = parseFloat(amountStr);

    if (isNaN(amount) || amount <= 0) {
      alert('Enter a valid amount.');
      return;
    }
    if ((userData?.checkingBalance || 0) < amount) {
      alert('Insufficient checking account funds.');
      return;
    }

    joinStakingPlan(plan.planName, amount, plan.apr, plan.days);
    alert(`Staked $${amount.toLocaleString()} in ${plan.planName} successfully!`);
  };

  const handleCancelStaking = (stakeId, amount, planName) => {
    if (window.confirm('Early release incurs a 10% penalty fee on principal lockups. Do you agree?')) {
      cancelStakingPlan(stakeId, amount, planName);
    }
  };

  const handleRenewSignals = () => {
    const fee = 49.00;
    if ((userData?.checkingBalance || 0) < fee) {
      alert('Insufficient checking balance to renew signal subscription.');
      return;
    }
    if (window.confirm(`Confirm renewing signal subscription for 30 days? A fee of $${fee.toFixed(2)} will be debited from checking.`)) {
      renewSignals();
      alert('Signals subscription auto-renewed successfully.');
    }
  };

  return (
    <section id="panel-wealth-invest" className="dashboard-panel active">
      <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
        <h2>Investment Plans & Staking</h2>
        <p style={{ marginBottom: '2rem' }}>Allocate idle funds to compounding portfolios or high-yield staking pools.</p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <h3>Browse Yield Packages</h3>
          <div>
            <select
              id="investSort"
              value={investSort}
              onChange={(e) => handleSortChange(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd' }}
            >
              <option value="apr-desc">Sort: Highest APR</option>
              <option value="apr-asc">Sort: Lowest APR</option>
              <option value="days-desc">Sort: Longest Lock</option>
            </select>
          </div>
        </div>
        
        <div className="investment-plans-grid" id="investmentPlansGrid" style={{ marginTop: '1.5rem' }}>
          {investmentPlans.map(p => (
            <div className="plan-card" key={p.id}>
              <div>
                <h4 style={{ margin: 0, fontWeight: 800, fontSize: '1.15rem', color: 'var(--primary)' }}>{p.planName}</h4>
                <div className="plan-apr">{p.apr}% APR</div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '1rem' }}>{p.details}</p>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '10px' }}>Lock Period: {p.days} Days</div>
                <button
                  className="btn-primary"
                  style={{ width: '100%', padding: '0.6rem', fontSize: '0.85rem' }}
                  onClick={() => handleJoinStaking(p)}
                >
                  Stake Funds
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="settings-grid">
        
        {/* Active Staked Pools */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3>My Staked Plans / Shares</h3>
          <div style={{ marginTop: '1.5rem' }} id="myInvestmentsList">
            {investments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: '#aaa', fontSize: '0.85rem' }}>No active investment portfolios.</div>
            ) : (
              investments.map(i => (
                <div
                  key={i.id}
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
                    <strong style={{ fontSize: '0.95rem' }}>{i.planName}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Principal: ${i.amount.toLocaleString()} | Rate: {i.rate}% APR
                    </div>
                    <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Joined: {i.dateJoined} • Status:{' '}
                      <span style={{ color: i.status === 'active' ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold' }}>
                        {i.status.toUpperCase()}
                      </span>
                    </small>
                  </div>
                  {i.status === 'active' && (
                    <button
                      className="btn-primary"
                      style={{ padding: '0.4rem 0.8rem', background: '#dc3545', border: 'none', fontSize: '0.75rem' }}
                      onClick={() => handleCancelStaking(i.id, i.amount, i.planName)}
                    >
                      Early Release
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* MT4 configuration */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3>MT4/5 Subscription Trading</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Configure external terminal signal hookups.</p>
          
          <form onSubmit={handleMT4Submit} id="formMT4">
            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label>Broker Server</label>
              <input
                type="text"
                id="mt4Broker"
                placeholder="e.g. IC Markets Live05"
                className="form-control"
                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #ddd' }}
                value={mt4Broker}
                onChange={(e) => setMt4Broker(e.target.value)}
                required
              />
            </div>
            <div className="form-row-custom" style={{ marginBottom: '0.75rem' }}>
              <div className="form-group">
                <label>Account ID</label>
                <input
                  type="text"
                  id="mt4Id"
                  placeholder="48593495"
                  className="form-control"
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #ddd' }}
                  value={mt4Id}
                  onChange={(e) => setMt4Id(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Trade Password</label>
                <input
                  type="password"
                  id="mt4Pass"
                  placeholder="******"
                  className="form-control"
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #ddd' }}
                  value={mt4Pass}
                  onChange={(e) => setMt4Pass(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-row-custom" style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input
                  type="checkbox"
                  id="mt4SignalsCheck"
                  checked={mt4SignalsCheck}
                  onChange={(e) => setMt4SignalsCheck(e.target.checked)}
                />
                <label style={{ fontSize: '0.8rem', cursor: 'pointer' }} htmlFor="mt4SignalsCheck">Autotrade Signals</label>
              </div>
              <div
                id="mt4StatusIndicator"
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  color: mt4Connected ? 'var(--success)' : 'var(--text-muted)'
                }}
              >
                Status: {mt4Connected ? 'Connected 🟢' : 'Offline'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn-primary" style={{ flex: 1, padding: '0.6rem' }}>Connect API</button>
              <button
                type="button"
                className="btn-secondary"
                style={{ flex: 1, padding: '0.6rem', background: '#dc3545', color: 'white', border: 'none' }}
                onClick={handleDeleteMT4}
              >
                Delete MT4
              </button>
            </div>
          </form>
        </div>

      </div>
      
      {/* Trade Signals Grid */}
      <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem' }}>
        <h3>Trade Signals & Subscriptions</h3>
        <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          <div style={{ background: 'var(--light)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--success)' }}>
            <strong>⚡ FX Signal: BUY EUR/USD</strong>
            <div style={{ fontSize: '0.85rem', marginTop: '5px' }}>Entry: 1.0850 • Target: 1.0920 • Stop: 1.0800</div>
            <small style={{ color: 'var(--text-muted)' }}>Sent: 2 mins ago</small>
          </div>
          <div style={{ background: 'var(--light)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--danger)' }}>
            <strong>⚡ CRYPTO Signal: SELL ETH/USD</strong>
            <div style={{ fontSize: '0.85rem', marginTop: '5px' }}>Entry: $3,460 • Target: $3,350 • Stop: $3,520</div>
            <small style={{ color: 'var(--text-muted)' }}>Sent: 15 mins ago</small>
          </div>
          <div style={{ background: 'var(--light)', padding: '1rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <strong style={{ fontSize: '0.95rem' }}>Signal Access Status: <span style={{ color: 'var(--success)' }}>Active</span></strong>
            <button className="btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.75rem', marginTop: '10px' }} onClick={handleRenewSignals}>
              Renew Signals ($49.00)
            </button>
          </div>
        </div>
      </div>

      {/* Trading History */}
      <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem' }}>
        <h3>MT4 & Signal Trading History</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Logs of closed positions executed via MT4 API Bridge or Trade Signals.</p>
        <div style={{ maxHeight: '250px', overflowY: 'auto' }} id="tradingHistoryList">
          {tradingHistory.length === 0 ? (
            <div style={{ padding: '1.5rem', textAlign: 'center', color: '#aaa', fontSize: '0.85rem' }}>No trading activity logs found.</div>
          ) : (
            tradingHistory.map(t => {
              const isProfit = parseFloat(t.profit) >= 0;
              return (
                <div
                  key={t.id}
                  style={{
                    padding: '0.75rem',
                    borderBottom: '1px solid var(--border-color)',
                    fontSize: '0.85rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <strong>⚡ {t.symbol} ({t.type.toUpperCase()})</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Entry: {t.entryPrice} &rarr; Close: {t.closePrice} • Vol: ${parseFloat(t.amount).toLocaleString()}
                    </div>
                    <small style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t.time}</small>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={isProfit ? 'profit' : 'loss'} style={{ fontWeight: 'bold' }}>
                      {isProfit ? '+' : ''}${parseFloat(t.profit).toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default WealthPanel;
