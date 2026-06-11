import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const IrsPanel = () => {
  const {
    userData,
    setUserData,
    setTransactions,
    setNotifications
  } = useAuth();

  const [taxYear, setTaxYear] = useState('2025');
  const [ssn, setSsn] = useState('');
  const [wages, setWages] = useState('');
  const [withheld, setWithheld] = useState('');
  const [w2FileName, setW2FileName] = useState('');
  const [w2PreviewText, setW2PreviewText] = useState('No document loaded');
  const [w2PreviewStyle, setW2PreviewStyle] = useState({ color: 'inherit' });

  const refunds = userData?.irsRefunds || [];

  const handleSsnChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 9) value = value.slice(0, 9);
    
    let formatted = value;
    if (value.length > 5) {
      formatted = `${value.slice(0, 3)}-${value.slice(3, 5)}-${value.slice(5)}`;
    } else if (value.length > 3) {
      formatted = `${value.slice(0, 3)}-${value.slice(3)}`;
    }
    setSsn(formatted);
  };

  const handleW2Change = (e) => {
    const file = e.target.files[0];
    if (file) {
      setW2FileName(file.name);
      setW2PreviewText(`✅ Document loaded: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
      setW2PreviewStyle({ color: 'var(--success)', fontWeight: 'bold' });
    } else {
      setW2FileName('');
      setW2PreviewText('No document loaded');
      setW2PreviewStyle({ color: 'inherit' });
    }
  };

  const triggerSuccessfulAlert = (title, message) => {
    const alertEl = document.createElement('div');
    alertEl.style.cssText = 'position: fixed; top: 20px; right: 20px; background: linear-gradient(135deg, #00c6ff, #0072ff); z-index: 9999; padding: 1.5rem 2rem; border-radius: 16px; color: white; box-shadow: 0 15px 35px rgba(0,114,255,0.3); display: flex; flex-direction: column; gap: 5px; font-family: inherit;';
    alertEl.innerHTML = `<strong style="font-size:1.1rem;"><i class="fas fa-check-circle"></i> ${title}</strong><span>${message}</span>`;
    document.body.appendChild(alertEl);
    setTimeout(() => alertEl.remove(), 4000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanSsn = ssn.trim();
    const parsedWages = parseFloat(wages);
    const parsedWithheld = parseFloat(withheld);

    if (!cleanSsn || isNaN(parsedWages) || isNaN(parsedWithheld)) {
      alert('Please fill all required fields.');
      return;
    }

    if (parsedWithheld > parsedWages) {
      alert('Federal tax withheld cannot exceed gross wages.');
      return;
    }

    const refundAmt = parsedWithheld * 0.15;
    const filingId = 'IRS-' + taxYear + '-' + Math.floor(10000 + Math.random() * 90000);

    const refundRecord = {
      id: filingId,
      year: taxYear,
      ssn: cleanSsn,
      wages: parsedWages.toFixed(2),
      withheld: parsedWithheld.toFixed(2),
      refundAmt: refundAmt.toFixed(2),
      status: 'Submitted',
      date: new Date().toLocaleString()
    };

    // Update user state
    setUserData(prev => ({
      ...prev,
      irsRefunds: [refundRecord, ...(prev.irsRefunds || [])]
    }));

    triggerSuccessfulAlert('IRS Return Filed', `Filing ID: ${filingId} — Refund Est. $${refundAmt.toFixed(2)}`);
    
    // Reset Form
    setSsn('');
    setWages('');
    setWithheld('');
    setW2FileName('');
    setW2PreviewText('No document loaded');
    setW2PreviewStyle({ color: 'inherit' });

    // Trigger background progressions
    const progressions = [
      { status: 'Under Review', delay: 12000 },
      { status: 'Approved', delay: 28000 },
      { status: 'Paid & Deposited', delay: 48000 }
    ];

    progressions.forEach(p => {
      setTimeout(() => {
        setUserData(prev => {
          if (!prev) return prev;
          const currentRefunds = prev.irsRefunds || [];
          const idx = currentRefunds.findIndex(r => r.id === filingId);
          if (idx === -1) return prev;

          const updatedRefunds = [...currentRefunds];
          const updatedRecord = { ...updatedRefunds[idx], status: p.status };
          updatedRefunds[idx] = updatedRecord;

          let nextCheckingBalance = prev.checkingBalance;

          if (p.status === 'Paid & Deposited') {
            nextCheckingBalance += parseFloat(updatedRecord.refundAmt);

            // Append transaction history
            const newTxn = {
              type: 'deposit',
              recipient: `IRS Tax Refund (${filingId})`,
              amount: updatedRecord.refundAmt,
              account: prev.checkingLast4,
              txnId: 'IRS-DEP-' + Date.now().toString().slice(-6),
              time: new Date().toLocaleString(),
              status: 'completed'
            };
            setTransactions(old => [newTxn, ...old]);

            // Add notification
            const newNotif = {
              id: Date.now(),
              type: 'success',
              title: 'IRS Refund Deposited',
              message: `$${parseFloat(updatedRecord.refundAmt).toLocaleString()} has been credited to your Checking account.`,
              time: new Date().toLocaleString(),
              read: false
            };
            setNotifications(old => [newNotif, ...old]);

            // Successful Alert
            triggerSuccessfulAlert(
              'IRS Refund Received',
              `$${parseFloat(updatedRecord.refundAmt).toFixed(2)} deposited to Checking.`
            );
          }

          return {
            ...prev,
            checkingBalance: nextCheckingBalance,
            irsRefunds: updatedRefunds
          };
        });
      }, p.delay);
    });
  };

  const statusColors = {
    'Submitted': '#3b82f6',
    'Under Review': '#f59e0b',
    'Approved': '#8b5cf6',
    'Paid & Deposited': '#22c55e'
  };

  const statusSteps = ['Submitted', 'Under Review', 'Approved', 'Paid & Deposited'];

  // Current estimate calculation based on withheld state
  const estRefund = (parseFloat(withheld) || 0) * 0.15;

  return (
    <section id="panel-irs-refund" className="dashboard-panel active">
      <div className="settings-grid">
        {/* File Refund Claim Form */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2>File IRS Refund Claim</h2>
          <p style={{ fontSize: '0.88rem', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
            Federal Treasury direct-deposit filing integration. Submit wages, withheld tax, and document scans.
          </p>

          <form onSubmit={handleSubmit} id="formIrsRefund">
            <div className="form-row-custom">
              <div className="form-group">
                <label>Tax Filing Year</label>
                <select
                  id="irsTaxYear"
                  className="form-control"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}
                  value={taxYear}
                  onChange={(e) => setTaxYear(e.target.value)}
                >
                  <option value="2025">2025 Tax Year (Current)</option>
                  <option value="2024">2024 Tax Year (Prior)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Filer SSN / TIN</label>
                <input
                  type="text"
                  id="irsSsn"
                  placeholder="XXX-XX-XXXX"
                  className="form-control"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}
                  value={ssn}
                  onChange={handleSsnChange}
                  required
                />
              </div>
            </div>
            <div className="form-row-custom">
              <div className="form-group">
                <label>W-2 Gross Income ($)</label>
                <input
                  type="number"
                  id="irsWages"
                  placeholder="85000.00"
                  className="form-control"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}
                  value={wages}
                  onChange={(e) => setWages(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Federal Tax Withheld ($)</label>
                <input
                  type="number"
                  id="irsWithheld"
                  placeholder="12500.00"
                  className="form-control"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}
                  value={withheld}
                  onChange={(e) => setWithheld(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label>Upload IRS Form W-2 / 1099 PDF or Photo</label>
              <input
                type="file"
                id="irsW2File"
                className="form-control"
                style={{ width: '100%', padding: '0.5rem', borderRadius: '8px' }}
                onChange={handleW2Change}
              />
              <div id="irsW2Preview" className="upload-preview" style={{ ...w2PreviewStyle, marginTop: '0.5rem', minHeight: '30px', border: '1px dashed #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', fontSize: '0.85rem' }}>
                {w2PreviewText}
              </div>
            </div>
            <div
              className="fee-summary"
              style={{
                background: 'var(--light)',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                marginBottom: '1.5rem',
                borderLeft: '5px solid var(--primary)',
                textAlign: 'left'
              }}
            >
              Est. Refund Yield:{' '}
              <strong id="irsRefundEstimateText" style={{ color: 'var(--success)', fontSize: '1.1rem' }}>
                ${estRefund.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </strong>{' '}
              (Approx. 15% of Federal withholding)
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              Transmit IRS Tax Return
            </button>
          </form>
        </div>

        {/* Track Refund Status */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2>Track Refund Filings</h2>
          <p style={{ fontSize: '0.88rem', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
            Real-time review updates directly from the Internal Revenue Service API hook.
          </p>

          <div id="irsTrackersList" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {refunds.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#aaa' }}>
                <i className="fas fa-file-invoice-dollar" style={{ fontSize: '3rem', display: 'block', marginbottom: '1rem' }}></i>
                No refund filings yet. Submit a new IRS claim using the form.
              </div>
            ) : (
              refunds.map(r => {
                const stepIdx = statusSteps.indexOf(r.status);
                return (
                  <div
                    key={r.id}
                    style={{
                      background: 'white',
                      borderRadius: '14px',
                      padding: '1.75rem',
                      border: '1px solid rgba(30,60,114,0.06)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                      <div>
                        <strong style={{ fontSize: '1rem', color: 'var(--primary-dark)' }}>Filing #{r.id}</strong>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                          Tax Year {r.year} • SSN/TIN: ***-**-{r.ssn.slice(-4)} • Filed: {r.date}
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          background: `${statusColors[r.status] || '#cbd5e1'}18`,
                          color: statusColors[r.status] || '#64748b',
                          fontWeight: '700'
                        }}
                      >
                        {r.status}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                      <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '8px', flex: 1, minWidth: '100px' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                          W-2 Income
                        </div>
                        <strong style={{ color: 'var(--primary)' }}>
                          ${parseFloat(r.wages).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </strong>
                      </div>
                      <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '8px', flex: 1, minWidth: '100px' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                          Tax Withheld
                        </div>
                        <strong style={{ color: 'var(--danger)' }}>
                          ${parseFloat(r.withheld).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </strong>
                      </div>
                      <div style={{ background: '#f0fdf4', padding: '0.75rem 1rem', borderRadius: '8px', flex: 1, minWidth: '100px' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                          Est. Refund
                        </div>
                        <strong style={{ color: 'var(--success)' }}>
                          ${parseFloat(r.refundAmt).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      {statusSteps.map((s, i) => (
                        <div
                          key={s}
                          style={{
                            flex: 1,
                            height: '6px',
                            borderRadius: '3px',
                            background: i <= stepIdx ? statusColors[r.status] : '#e2e8f0'
                          }}
                        ></div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                      {statusSteps.map((s, i) => (
                        <span
                          key={s}
                          style={{
                            fontSize: '0.6rem',
                            color: i <= stepIdx ? statusColors[r.status] : '#94a3b8',
                            fontWeight: i === stepIdx ? '700' : '400'
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default IrsPanel;
