import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const SettingsPanel = () => {
  const {
    userData,
    setUserData
  } = useAuth();

  const { theme, toggleTheme } = useTheme();

  // Profile Details Form States
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileAddress, setProfileAddress] = useState('');

  // Preference Checkboxes
  const [twoFactor, setTwoFactor] = useState(false);
  const [prefMarketing, setPrefMarketing] = useState(true);
  const [prefTransactions, setPrefTransactions] = useState(true);
  const [prefSecurity, setPrefSecurity] = useState(true);

  // PIN Form States
  const [pinOld, setPinOld] = useState('');
  const [pinNew1, setPinNew1] = useState('');
  const [pinNew2, setPinNew2] = useState('');

  // Password Form States
  const [passOld, setPassOld] = useState('');
  const [passNew1, setPassNew1] = useState('');
  const [passNew2, setPassNew2] = useState('');

  // Initialize values from userData on load
  useEffect(() => {
    if (userData) {
      setProfileName(userData.name || '');
      setProfileEmail(userData.email || '');
      setProfilePhone(userData.phone || '');
      setProfileAddress(userData.address || '');
      setTwoFactor(userData.twoFactor || false);
      
      const prefs = userData.emailPreferences || { marketing: true, transactions: true, alerts: true };
      setPrefMarketing(prefs.marketing !== false);
      setPrefTransactions(prefs.transactions !== false);
      setPrefSecurity(prefs.alerts !== false);
    }
  }, [userData]);

  const getAvatarInitials = (name) => {
    if (!name) return 'SB';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  // Profile Photo Upload Handler
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setUserData(prev => ({
          ...prev,
          profilePhoto: evt.target.result
        }));
        alert('Profile photo updated successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  // Profile details form submit
  const handleProfileDetailsSubmit = (e) => {
    e.preventDefault();
    if (!profileName || !profileEmail || !profilePhone || !profileAddress) {
      alert('Please fill in all details');
      return;
    }
    setUserData(prev => ({
      ...prev,
      name: profileName,
      email: profileEmail,
      phone: profilePhone,
      address: profileAddress
    }));
    alert('Profile information updated successfully!');
  };

  // Preference Checkbox toggle saves
  const handleTwoFactorChange = (val) => {
    setTwoFactor(val);
    setUserData(prev => ({ ...prev, twoFactor: val }));
    alert(`2FA has been ${val ? 'enabled (code required on next signin)' : 'disabled'}.`);
  };

  const handlePreferenceSave = (marketingVal, transactionsVal, securityVal) => {
    setUserData(prev => ({
      ...prev,
      emailPreferences: {
        marketing: marketingVal,
        transactions: transactionsVal,
        alerts: securityVal
      }
    }));
  };

  // PIN change form submit
  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinOld !== userData.pin) {
      alert('Current security PIN is incorrect.');
      return;
    }
    if (pinNew1 !== pinNew2) {
      alert('New PIN confirmations do not match.');
      return;
    }
    if (pinNew1.length !== 4) {
      alert('PIN must be exactly 4 digits.');
      return;
    }
    setUserData(prev => ({ ...prev, pin: pinNew1 }));
    alert('Security Transaction PIN updated successfully!');
    setPinOld('');
    setPinNew1('');
    setPinNew2('');
  };

  // Password change form submit
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passOld !== userData.password) {
      alert('Current account password is incorrect.');
      return;
    }
    if (passNew1 !== passNew2) {
      alert('New password confirmations do not match.');
      return;
    }
    if (passNew1.length < 8) {
      alert('New password must be at least 8 characters long.');
      return;
    }
    setUserData(prev => ({ ...prev, password: passNew1 }));
    alert('Account password modified successfully!');
    setPassOld('');
    setPassNew1('');
    setPassNew2('');
  };

  const handleThemeChange = (newTheme) => {
    toggleTheme(newTheme);
    setUserData(prev => ({ ...prev, theme: newTheme }));
  };

  return (
    <section id="panel-settings-security" className="dashboard-panel active">
      <div className="settings-grid">
        
        {/* Profile Details & Preferences */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2>Account Preferences</h2>
          
          <form id="formProfilePhoto" style={{ marginTop: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>
            <div className="user-avatar" id="settingsAvatarDisplay" style={{ width: '85px', height: '85px', fontSize: '2rem', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {userData?.profilePhoto ? (
                <img src={userData.profilePhoto} alt="profile avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                getAvatarInitials(userData?.name)
              )}
            </div>
            <div className="form-group">
              <label style={{ cursor: 'pointer', display: 'inline-block', padding: '5px 15px', borderRadius: '20px', background: 'var(--primary)', color: 'white', fontSize: '0.8rem' }}>
                Upload Profile Photo
                <input type="file" id="profilePhotoInput" style={{ display: 'none' }} onChange={handlePhotoUpload} />
              </label>
            </div>
          </form>

          <form onSubmit={handleProfileDetailsSubmit} id="formProfileDetails" style={{ marginBottom: '2rem' }}>
            <h3>Profile Information</h3>
            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label>Full Name</label>
              <input
                type="text"
                id="profileName"
                className="form-control"
                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #ddd' }}
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label>Email Address</label>
              <input
                type="email"
                id="profileEmail"
                className="form-control"
                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #ddd' }}
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label>Phone Number</label>
              <input
                type="text"
                id="profilePhone"
                className="form-control"
                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #ddd' }}
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value)}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Billing Address</label>
              <input
                type="text"
                id="profileAddress"
                className="form-control"
                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #ddd' }}
                value={profileAddress}
                onChange={(e) => setProfileAddress(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.6rem', fontSize: '0.85rem' }}>Update Profile Details</button>
          </form>
          
          <hr style={{ border: 0, borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

          <form id="formPreferences">
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Two-Factor Authentication (2FA)</label>
              <div style={{ display: 'flex', alignItems: 'center', justifySpaceBetween: 'space-between', justifyContent: 'space-between', marginTop: '5px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Require Authenticator OTP Code on sign-in</span>
                <input
                  type="checkbox"
                  id="twoFactorToggle"
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  checked={twoFactor}
                  onChange={(e) => handleTwoFactorChange(e.target.checked)}
                />
              </div>
            </div>
            <hr style={{ border: 0, borderTop: '1px solid var(--border-color)', margin: '1rem 0' }} />
            
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Email Preferences</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Marketing Campaigns & Yield Updates</span>
                  <input
                    type="checkbox"
                    id="prefMarketing"
                    checked={prefMarketing}
                    onChange={(e) => {
                      setPrefMarketing(e.target.checked);
                      handlePreferenceSave(e.target.checked, prefTransactions, prefSecurity);
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Transaction Receipts</span>
                  <input
                    type="checkbox"
                    id="prefTransactions"
                    checked={prefTransactions}
                    onChange={(e) => {
                      setPrefTransactions(e.target.checked);
                      handlePreferenceSave(prefMarketing, e.target.checked, prefSecurity);
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Security Alert Warning Logs</span>
                  <input
                    type="checkbox"
                    id="prefSecurity"
                    checked={prefSecurity}
                    onChange={(e) => {
                      setPrefSecurity(e.target.checked);
                      handlePreferenceSave(prefMarketing, prefTransactions, e.target.checked);
                    }}
                  />
                </div>
              </div>
            </div>
            <hr style={{ border: 0, borderTop: '1px solid var(--border-color)', margin: '1rem 0' }} />
            
            <div className="form-group">
              <label>Aesthetic Theme Preference</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginTop: '10px' }}>
                <button type="button" className={`btn-secondary ${theme === 'light' ? 'active' : ''}`} style={{ padding: '0.5rem', fontSize: '0.8rem' }} onClick={() => handleThemeChange('light')}>
                  <i className="fas fa-sun"></i> Light
                </button>
                <button type="button" className={`btn-secondary ${theme === 'dark' ? 'active' : ''}`} style={{ padding: '0.5rem', fontSize: '0.8rem' }} onClick={() => handleThemeChange('dark')}>
                  <i className="fas fa-moon"></i> Dark
                </button>
                <button type="button" className={`btn-secondary ${theme === 'glass' ? 'active' : ''}`} style={{ padding: '0.5rem', fontSize: '0.8rem' }} onClick={() => handleThemeChange('glass')}>
                  <i className="fas fa-eye"></i> Glass
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Security Codes Column */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2>Security Settings</h2>
          
          {/* PIN Setup Form */}
          <form onSubmit={handlePinSubmit} id="formPinSetup" style={{ marginTop: '1.5rem' }}>
            <h3>Update Transaction PIN</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Required for wires, crypto swaps, and card requests.</p>
            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label>Old 4-Digit PIN</label>
              <input
                type="password"
                id="pinOld"
                placeholder="****"
                maxLength="4"
                className="form-control"
                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #ddd' }}
                value={pinOld}
                onChange={(e) => setPinOld(e.target.value.replace(/\D/g, ''))}
                required
              />
            </div>
            <div className="form-row-custom">
              <div className="form-group">
                <label>Create New PIN</label>
                <input
                  type="password"
                  id="pinNew1"
                  placeholder="****"
                  maxLength="4"
                  className="form-control"
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #ddd' }}
                  value={pinNew1}
                  onChange={(e) => setPinNew1(e.target.value.replace(/\D/g, ''))}
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm New PIN</label>
                <input
                  type="password"
                  id="pinNew2"
                  placeholder="****"
                  maxLength="4"
                  className="form-control"
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #ddd' }}
                  value={pinNew2}
                  onChange={(e) => setPinNew2(e.target.value.replace(/\D/g, ''))}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.6rem' }}>Change Security PIN</button>
          </form>

          <hr style={{ border: 0, borderTop: '1px solid var(--border-color)', margin: '2rem 0' }} />

          {/* Password Setup Form */}
          <form onSubmit={handlePasswordSubmit} id="formPassChange">
            <h3>Change Passwords</h3>
            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label>Current Account Password</label>
              <input
                type="password"
                id="passOld"
                placeholder="Enter current password"
                className="form-control"
                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #ddd' }}
                value={passOld}
                onChange={(e) => setPassOld(e.target.value)}
                required
              />
            </div>
            <div className="form-row-custom" style={{ marginBottom: '1.25rem' }}>
              <div className="form-group">
                <label>Create New Password</label>
                <input
                  type="password"
                  id="passNew1"
                  placeholder="Minimum 8 characters"
                  minLength="8"
                  className="form-control"
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #ddd' }}
                  value={passNew1}
                  onChange={(e) => setPassNew1(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  id="passNew2"
                  placeholder="Repeat password"
                  className="form-control"
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #ddd' }}
                  value={passNew2}
                  onChange={(e) => setPassNew2(e.target.value)}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.6rem' }}>Modify Account Password</button>
          </form>
        </div>

      </div>
    </section>
  );
};

export default SettingsPanel;
