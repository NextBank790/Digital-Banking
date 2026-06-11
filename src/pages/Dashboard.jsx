import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ChatBot from '../components/ChatBot';
import '../assets/Digitalbanking.css';

// Panel imports
import OverviewPanel from './dashboard/OverviewPanel';
import TransfersPanel from './dashboard/TransfersPanel';
import DepositsWithdrawalsPanel from './dashboard/DepositsWithdrawalsPanel';
import HistoryPanel from './dashboard/HistoryPanel';
import CryptoPanel from './dashboard/CryptoPanel';
import CardsPanel from './dashboard/CardsPanel';
import WealthPanel from './dashboard/WealthPanel';
import LoansPanel from './dashboard/LoansPanel';
import KycPanel from './dashboard/KycPanel';
import NotificationsPanel from './dashboard/NotificationsPanel';
import SupportPanel from './dashboard/SupportPanel';
import SettingsPanel from './dashboard/SettingsPanel';
import AcademyPanel from './dashboard/AcademyPanel';
import IrsPanel from './dashboard/IrsPanel';

const Dashboard = () => {
  const {
    userData,
    logout,
    notifications,
    setNotifications,
    transactions,
    cards
  } = useAuth();
  
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [activePanel, setActivePanel] = useState('overview');
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  // Sync theme preference from context to local user preferences
  useEffect(() => {
    if (userData && userData.theme) {
      toggleTheme(userData.theme);
    }
  }, [userData]);

  const handleLogoutClick = (e) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };

  const unreadNotifications = notifications.filter(n => !n.read);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearAllNotifs = () => {
    setNotifications([]);
  };

  const getAvatarInitials = (name) => {
    if (!name) return 'SB';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const renderActivePanel = () => {
    switch (activePanel) {
      case 'overview':
        return <OverviewPanel setActivePanel={setActivePanel} />;
      case 'transfers':
        return <TransfersPanel />;
      case 'deposits-withdrawals':
        return <DepositsWithdrawalsPanel />;
      case 'history':
        return <HistoryPanel />;
      case 'crypto-hub':
        return <CryptoPanel />;
      case 'virtual-cards':
        return <CardsPanel />;
      case 'wealth-invest':
        return <WealthPanel />;
      case 'loans-referrals':
        return <LoansPanel />;
      case 'kyc-verification':
        return <KycPanel />;
      case 'notifications':
        return <NotificationsPanel />;
      case 'support':
        return <SupportPanel />;
      case 'settings-security':
        return <SettingsPanel />;
      case 'membership-courses':
        return <AcademyPanel />;
      case 'irs-refund':
        return <IrsPanel />;
      default:
        return <OverviewPanel setActivePanel={setActivePanel} />;
    }
  };

  return (
    <div>
      {/* scrolling top ticker */}
      <div className="market-ticker">
        <div className="ticker-content" id="tickerItems">
          <span>BTC: $64,231.50 <small style={{ color: '#00ff88' }}>+2.4%</small></span>
          <span>ETH: $3,452.12 <small style={{ color: '#00ff88' }}>+1.8%</small></span>
          <span>SOL: $142.05 <small style={{ color: '#ff3366' }}>-0.5%</small></span>
          <span>GOLD: $2,342.10 <small style={{ color: '#00ff88' }}>+0.2%</small></span>
          <span>XRP: $0.62 <small style={{ color: '#00ff88' }}>+1.1%</small></span>
          <span>EUR/USD: 1.08 <small style={{ color: '#ff3366' }}>-0.1%</small></span>
          {/* Duplicate for seamless scrolling */}
          <span>BTC: $64,231.50 <small style={{ color: '#00ff88' }}>+2.4%</small></span>
          <span>ETH: $3,452.12 <small style={{ color: '#00ff88' }}>+1.8%</small></span>
          <span>SOL: $142.05 <small style={{ color: '#ff3366' }}>-0.5%</small></span>
          <span>GOLD: $2,342.10 <small style={{ color: '#00ff88' }}>+0.2%</small></span>
          <span>XRP: $0.62 <small style={{ color: '#00ff88' }}>+1.1%</small></span>
          <span>EUR/USD: 1.08 <small style={{ color: '#ff3366' }}>-0.1%</small></span>
        </div>
      </div>

      {/* Dashboard Custom Navbar */}
      <nav className="navbar" style={{ position: 'fixed', width: '100%', top: 0, zIndex: 1000 }}>
        <div className="nav-container">
          <div className="logo" style={{ cursor: 'pointer' }} onClick={() => setActivePanel('overview')}>
            <i className="fas fa-university"></i> SecureBank
          </div>
          <ul className="nav-menu">
            <li>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setActivePanel('overview'); }}
                className={activePanel === 'overview' ? 'active' : ''}
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setActivePanel('transfers'); }}
                className={activePanel === 'transfers' ? 'active' : ''}
              >
                Transfers
              </a>
            </li>
          </ul>
          <div className="header-action" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {/* Notification Bell Dropdown */}
            <div
              className={`notification-bell ${showNotifDropdown ? 'active' : ''}`}
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              style={{ position: 'relative', cursor: 'pointer' }}
            >
              <i className="fas fa-bell"></i>
              {unreadNotifications.length > 0 && (
                <span className="notification-badge">{unreadNotifications.length}</span>
              )}
              
              {showNotifDropdown && (
                <div
                  className="notification-dropdown"
                  style={{
                    display: 'block',
                    position: 'absolute',
                    top: '40px',
                    right: 0,
                    width: '320px',
                    background: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '12px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                    padding: '1rem',
                    zIndex: 2000,
                    color: '#333'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 'bold' }}>Notifications</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={handleMarkAllRead} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}>Mark read</button>
                      <button onClick={handleClearAllNotifs} style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}>Clear all</button>
                    </div>
                  </div>
                  <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                      <p style={{ textAlign: 'center', color: '#888', margin: '1rem 0', fontSize: '0.9rem' }}>No notifications</p>
                    ) : (
                      notifications.slice(0, 5).map(n => (
                        <div key={n.id} style={{ borderBottom: '1px solid #f9f9f9', padding: '0.5rem 0', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: n.read ? 'normal' : 'bold' }}>
                            <span style={{ color: n.type === 'success' ? 'var(--success)' : n.type === 'warning' ? 'var(--warning)' : 'var(--primary)' }}>
                              {n.title}
                            </span>
                            <span style={{ color: '#aaa', fontSize: '0.7rem' }}>{n.time.split(',')[1] || n.time}</span>
                          </div>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: '#555', lineHeight: '1.3' }}>{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                  {notifications.length > 5 && (
                    <button
                      onClick={() => { setActivePanel('notifications'); setShowNotifDropdown(false); }}
                      style={{ width: '100%', marginTop: '0.5rem', border: 'none', background: '#f5f5f5', padding: '0.4rem', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      View All Notifications
                    </button>
                  )}
                </div>
              )}
            </div>

            <a href="#" className="login-btn" onClick={handleLogoutClick} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </a>
          </div>
        </div>
      </nav>

      {/* Master Header Welcome Block */}
      <div className="dashboard-header" style={{ maxWidth: '1400px', margin: '100px auto 1.5rem', width: '90%' }}>
        <div className="user-welcome">
          <div className="user-avatar" id="headerAvatar">
            {userData?.profilePhoto ? (
              <img src={userData.profilePhoto} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              getAvatarInitials(userData?.name)
            )}
          </div>
          <div>
            <h3>Welcome back, {userData?.name || 'User'}</h3>
            <p>
              Protected with bank-grade 256-bit encryption.
              <span
                className={`card-tier ${userData?.kycStatus === 'verified' ? 'success' : 'danger'}`}
                style={{
                  marginLeft: '10px',
                  textTransform: 'uppercase',
                  fontSize: '0.65rem',
                  background: userData?.kycStatus === 'verified' ? '#00ff8822' : '#ff336622',
                  color: userData?.kycStatus === 'verified' ? '#00cc66' : '#ff3366',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  fontWeight: 'bold'
                }}
              >
                {userData?.kycStatus || 'UNVERIFIED'}
              </span>
            </p>
          </div>
        </div>
        <div style={{ fontWeight: 'bold', fontSize: '0.95rem', color: 'var(--primary)' }}>
          <i className="fas fa-shield-alt"></i> Secure Session Active
        </div>
      </div>

      {/* Dynamic SPA Dashboard Workspace */}
      <div className="dashboard-container">
        {/* Sidebar Navigation */}
        <aside className="dashboard-sidebar">
          <ul className="sidebar-menu">
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); setActivePanel('overview'); }} className={`menu-item ${activePanel === 'overview' ? 'active' : ''}`} id="menu-overview">
                <i className="fas fa-chart-line"></i> Overview
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); setActivePanel('transfers'); }} className={`menu-item ${activePanel === 'transfers' ? 'active' : ''}`} id="menu-transfers">
                <i className="fas fa-exchange-alt"></i> Send Money
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); setActivePanel('deposits-withdrawals'); }} className={`menu-item ${activePanel === 'deposits-withdrawals' ? 'active' : ''}`} id="menu-deposits-withdrawals">
                <i className="fas fa-wallet"></i> Deposits & Pay
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); setActivePanel('history'); }} className={`menu-item ${activePanel === 'history' ? 'active' : ''}`} id="menu-history">
                <i className="fas fa-history"></i> Account History
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); setActivePanel('crypto-hub'); }} className={`menu-item ${activePanel === 'crypto-hub' ? 'active' : ''}`} id="menu-crypto-hub">
                <i className="fas fa-coins"></i> Crypto Wallet
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); setActivePanel('virtual-cards'); }} className={`menu-item ${activePanel === 'virtual-cards' ? 'active' : ''}`} id="menu-virtual-cards">
                <i className="fas fa-credit-card"></i> Virtual Cards
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); setActivePanel('wealth-invest'); }} className={`menu-item ${activePanel === 'wealth-invest' ? 'active' : ''}`} id="menu-wealth-invest">
                <i className="fas fa-chart-pie"></i> Wealth Yields
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); setActivePanel('loans-referrals'); }} className={`menu-item ${activePanel === 'loans-referrals' ? 'active' : ''}`} id="menu-loans-referrals">
                <i className="fas fa-hand-holding-usd"></i> Loans & Refer
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); setActivePanel('kyc-verification'); }} className={`menu-item ${activePanel === 'kyc-verification' ? 'active' : ''}`} id="menu-kyc-verification">
                <i className="fas fa-user-check"></i> Account KYC
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); setActivePanel('membership-courses'); }} className={`menu-item ${activePanel === 'membership-courses' ? 'active' : ''}`} id="menu-membership-courses">
                <i className="fas fa-graduation-cap"></i> Membership Academy
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); setActivePanel('irs-refund'); }} className={`menu-item ${activePanel === 'irs-refund' ? 'active' : ''}`} id="menu-irs-refund">
                <i className="fas fa-file-invoice-dollar"></i> IRS Tax Refunds
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); setActivePanel('notifications'); }} className={`menu-item ${activePanel === 'notifications' ? 'active' : ''}`} id="menu-notifications">
                <i className="fas fa-bell"></i> Notifications
                {unreadNotifications.length > 0 && (
                  <span
                    id="sidebarNotifBadge"
                    style={{
                      display: 'inline-block',
                      background: 'var(--danger)',
                      color: 'white',
                      borderRadius: '50%',
                      width: '18px',
                      height: '18px',
                      fontSize: '0.65rem',
                      textAlign: 'center',
                      lineHeight: '18px',
                      marginLeft: '6px',
                      fontWeight: 'bold'
                    }}
                  >
                    {unreadNotifications.length}
                  </span>
                )}
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); setActivePanel('support'); }} className={`menu-item ${activePanel === 'support' ? 'active' : ''}`} id="menu-support">
                <i className="fas fa-headset"></i> Support
              </a>
            </li>
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); setActivePanel('settings-security'); }} className={`menu-item ${activePanel === 'settings-security' ? 'active' : ''}`} id="menu-settings-security">
                <i className="fas fa-cog"></i> Settings & Security
              </a>
            </li>
          </ul>
        </aside>

        {/* Main Workspace panels */}
        <main className="dashboard-panels" style={{ flex: 1, padding: '0 0 4rem 2rem' }}>
          {renderActivePanel()}
        </main>
      </div>

      <ChatBot />
    </div>
  );
};

export default Dashboard;
