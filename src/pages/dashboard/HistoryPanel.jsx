import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const HistoryPanel = () => {
  const { transactions } = useAuth();

  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');

  const handleClearFilters = () => {
    setFilterType('all');
    setSortBy('newest');
    setSearchQuery('');
  };

  const handleExportCSV = () => {
    if (transactions.length === 0) {
      alert('No transaction data to export.');
      return;
    }
    
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Transaction ID,Type,Recipient,Amount,Billing Account,Date/Time,Status\n';
    
    transactions.forEach(t => {
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

  // 1. Filter and Sort logic
  let filtered = [...transactions];

  if (filterType !== 'all') {
    filtered = filtered.filter(t => t.type === filterType);
  }

  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(t =>
      (t.recipient && t.recipient.toLowerCase().includes(q)) ||
      (t.txnId && t.txnId.toLowerCase().includes(q))
    );
  }

  // Sorting
  if (sortBy === 'oldest') {
    // oldest first is simple reverse if originally sorted newest first
    filtered.reverse();
  } else if (sortBy === 'highest') {
    filtered.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
  } else if (sortBy === 'lowest') {
    filtered.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));
  }

  // 2. Summary calculations
  const totalIn = transactions
    .filter(t => t.type === 'deposit')
    .reduce((s, t) => s + parseFloat(t.amount || 0), 0);

  const totalOut = transactions
    .filter(t => ['withdrawal', 'transfer-out', 'crypto-swap', 'investment', 'card-txn'].includes(t.type))
    .reduce((s, t) => s + parseFloat(t.amount || 0), 0);

  return (
    <section id="panel-history" className="dashboard-panel active">
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '10px' }}>
          <h2><i className="fas fa-history"></i> Full Account History</h2>
          <button className="btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }} onClick={handleExportCSV}>
            <i className="fas fa-file-download"></i> Export CSV
          </button>
        </div>
        <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
          Complete ledger of all account activities. Use the filters to narrow down your statement.
        </p>

        {/* Filter Bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '1.5rem', alignItems: 'center', background: 'var(--light)', padding: '1rem', borderRadius: '12px' }}>
          <select
            id="historyFilterType"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontFamily: 'inherit', fontSize: '0.85rem' }}
          >
            <option value="all">All Transactions</option>
            <option value="deposit">Deposits Only</option>
            <option value="withdrawal">Withdrawals Only</option>
            <option value="transfer-out">Transfers Out</option>
            <option value="crypto-swap">Crypto Swaps</option>
            <option value="investment">Investments</option>
            <option value="card-txn">Card Transactions</option>
          </select>
          <select
            id="historyFilterSort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontFamily: 'inherit', fontSize: '0.85rem' }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>
          <input
            type="text"
            id="historySearch"
            placeholder="Search by recipient or TXN ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontFamily: 'inherit', fontSize: '0.85rem', flex: 1, minWidth: '200px' }}
          />
          <button
            onClick={handleClearFilters}
            className="btn-secondary"
            style={{ padding: '0.6rem 1rem', fontSize: '0.85rem', color: 'var(--primary)', background: 'white', border: '1px solid var(--primary)' }}
          >
            <i className="fas fa-times"></i> Clear
          </button>
        </div>

        {/* Summary Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }} id="historySummaryCards">
          <div style={{ background: 'var(--light)', padding: '1rem', borderRadius: '10px', borderLeft: '4px solid var(--primary)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              <i className="fas fa-list"></i> Total Records
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', marginTop: '0.25rem' }}>{transactions.length}</div>
          </div>
          <div style={{ background: 'var(--light)', padding: '1rem', borderRadius: '10px', borderLeft: '4px solid var(--success)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              <i className="fas fa-arrow-down"></i> Total In
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', marginTop: '0.25rem', color: 'var(--success)' }}>
              ${totalIn.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div style={{ background: 'var(--light)', padding: '1rem', borderRadius: '10px', borderLeft: '4px solid var(--danger)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              <i className="fas fa-arrow-up"></i> Total Out
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', marginTop: '0.25rem', color: 'var(--danger)' }}>
              ${totalOut.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div style={{ background: 'var(--light)', padding: '1rem', borderRadius: '10px', borderLeft: '4px solid var(--gold)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              <i className="fas fa-filter"></i> Filtered
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', marginTop: '0.25rem', color: 'var(--gold)' }}>
              {filtered.length} records
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div id="historyTransactionsList" style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {filtered.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>No matching transactions found.</p>
          ) : (
            filtered.map((t, index) => {
              const isLoss = ['withdrawal', 'transfer-out', 'crypto-swap', 'card-txn', 'investment'].includes(t.type);
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
                      <p>{t.time} | Ref: {t.txnId} | Account: ****{t.account}</p>
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
    </section>
  );
};

export default HistoryPanel;
