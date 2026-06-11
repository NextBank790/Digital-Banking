import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const KycPanel = () => {
  const {
    userData,
    setUserData,
    setNotifications
  } = useAuth();

  const [docType, setDocType] = useState('passport');
  const [frontPreview, setFrontPreview] = useState('');
  const [backPreview, setBackPreview] = useState('');
  const [kycLoading, setKycLoading] = useState(false);

  const kycStatus = userData?.kycStatus || 'unverified';
  const emailVerified = userData?.emailVerified || false;

  const handleFrontUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setFrontPreview(evt.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setBackPreview(evt.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKycSubmit = (e) => {
    e.preventDefault();
    if (kycStatus === 'verified') {
      alert('Account KYC is already verified.');
      return;
    }

    setUserData(prev => ({ ...prev, kycStatus: 'pending' }));
    alert('Identity files uploaded successfully. SecureBank Compliance Team has been notified.');

    // Simulated compliance audit review (takes 15 seconds)
    setTimeout(() => {
      setUserData(prev => {
        if (prev.kycStatus === 'pending') {
          // Push notification
          const newNotif = {
            id: Date.now(),
            type: 'success',
            title: 'Account Verified (KYC)',
            message: 'Your documents were audited. Full withdrawal limits unlocked.',
            time: new Date().toLocaleString(),
            read: false
          };
          setNotifications(old => [newNotif, ...old]);

          // Trigger visual alert
          const successAlert = document.createElement('div');
          successAlert.style.cssText = 'position: fixed; top: 20px; right: 20px; background: linear-gradient(135deg, #00c6ff, #0072ff); z-index: 9999; padding: 1.5rem 2rem; border-radius: 16px; color: white; box-shadow: 0 15px 35px rgba(0,114,255,0.3); display: flex; flex-direction: column; gap: 5px;';
          successAlert.innerHTML = `<strong style="font-size:1.1rem;"><i class="fas fa-check-circle"></i> KYC Confirmed</strong><span>Account KYC identity files verified.</span>`;
          document.body.appendChild(successAlert);
          setTimeout(() => successAlert.remove(), 4000);

          return { ...prev, kycStatus: 'verified' };
        }
        return prev;
      });
    }, 15000);
  };

  const handleEmailVerifyClick = () => {
    alert('A verification code has been dispatched to your email.');
    const code = prompt('Enter the 6-digit confirmation code:');
    if (code) {
      setUserData(prev => ({ ...prev, emailVerified: true }));
      alert('Email verification complete. Badge updated.');
    }
  };

  return (
    <section id="panel-kyc-verification" className="dashboard-panel active">
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <h2>KYC Identity Verification Center</h2>
        <p style={{ marginBottom: '2rem' }}>Federal banking regulations require document submissions to confirm identity before outbound wires are authorized.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          <div>
            <div style={{ padding: '1.5rem', borderRadius: '12px', background: 'var(--light)', marginBottom: '1.5rem' }}>
              <h4>Verification Status:{' '}
                <span
                  id="kycStatusValue"
                  style={{
                    color: kycStatus === 'verified' ? 'var(--success)' : kycStatus === 'pending' ? 'var(--warning)' : 'var(--danger)',
                    textTransform: 'uppercase',
                    fontWeight: 'bold'
                  }}
                >
                  {kycStatus}
                </span>
              </h4>
              <p style={{ fontSize: '0.85rem', marginTop: '5px', color: 'var(--text-muted)' }}>
                {kycStatus === 'verified'
                  ? 'Your identity has been fully verified. Wires limits unlocked.'
                  : kycStatus === 'pending'
                  ? 'Compliance staff is auditing your identity documents...'
                  : 'Please upload an official identity document (Passport, Driver\'s License or ID Card).'}
              </p>
            </div>
            
            {kycStatus !== 'verified' && (
              <form onSubmit={handleKycSubmit} id="formKYC">
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label>Document Type</label>
                  <select
                    id="kycDocType"
                    className="form-control"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                  >
                    <option value="passport">International Passport</option>
                    <option value="license">Driver's License</option>
                    <option value="id_card">National Identity Card</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label>Upload Document FRONT Image</label>
                  <input
                    type="file"
                    id="kycFrontInput"
                    className="form-control"
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '8px' }}
                    onChange={handleFrontUpload}
                    required
                  />
                  <div className="upload-preview" id="kycFrontPreview" style={{ marginTop: '0.5rem', minHeight: '60px', border: '1px dashed #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '6px' }}>
                    {frontPreview ? (
                      <img src={frontPreview} alt="Front Document Preview" style={{ width: '100%', height: 'auto', maxHeight: '180px', objectFit: 'contain' }} />
                    ) : (
                      'No image uploaded'
                    )}
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label>Upload Document BACK Image (Optional)</label>
                  <input
                    type="file"
                    id="kycBackInput"
                    className="form-control"
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '8px' }}
                    onChange={handleBackUpload}
                  />
                  <div className="upload-preview" id="kycBackPreview" style={{ marginTop: '0.5rem', minHeight: '60px', border: '1px dashed #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '6px' }}>
                    {backPreview ? (
                      <img src={backPreview} alt="Back Document Preview" style={{ width: '100%', height: 'auto', maxHeight: '180px', objectFit: 'contain' }} />
                    ) : (
                      'No image uploaded'
                    )}
                  </div>
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={kycStatus === 'pending'}>
                  {kycStatus === 'pending' ? 'Audit in Progress...' : 'Submit KYC Details'}
                </button>
              </form>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: 'var(--light)', padding: '1.5rem', borderRadius: '12px' }}>
              <h4>Email Verification</h4>
              <p style={{ fontSize: '0.85rem', marginTop: '5px', marginBottom: '1rem', color: 'var(--text-muted)' }}>
                Verify your contact address to receive digital receipts and security alerts.
              </p>
              <div
                id="emailVerifStatusBox"
                style={{
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  marginBottom: '10px',
                  color: emailVerified ? 'var(--success)' : 'var(--danger)'
                }}
              >
                Status: {emailVerified ? 'Verified ✅' : 'Unverified ❌'}
              </div>
              {!emailVerified && (
                <button
                  className="btn-primary"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                  id="btnEmailVerify"
                  onClick={handleEmailVerifyClick}
                >
                  Verify Email
                </button>
              )}
            </div>

            <div style={{ background: 'var(--light)', padding: '1.5rem', borderRadius: '12px' }}>
              <h4>Why is this required?</h4>
              <p style={{ fontSize: '0.85rem', marginTop: '5px', lineHeight: '1.6', color: 'var(--text-muted)' }}>
                Under Bank Secrecy Act and Know Your Customer provisions, financial hubs must document account owners. SecureBank keeps files encrypted and never distributes privacy records.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KycPanel;
