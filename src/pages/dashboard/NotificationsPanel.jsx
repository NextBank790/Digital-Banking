import React from 'react';
import { useAuth } from '../../context/AuthContext';

const NotificationsPanel = () => {
  const {
    notifications,
    setNotifications
  } = useAuth();

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleDeleteNotif = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleMarkSingleRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <section id="panel-notifications" className="dashboard-panel active">
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '10px' }}>
          <h2><i className="fas fa-bell"></i> Notifications Center</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleMarkAllRead} className="btn-secondary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem', background: 'var(--primary)', color: 'white', border: 'none' }}>
              <i className="fas fa-check-double"></i> Mark All Read
            </button>
            <button onClick={handleClearAll} className="btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem', background: 'var(--danger)', border: 'none' }}>
              <i className="fas fa-trash"></i> Clear All
            </button>
          </div>
        </div>
        <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
          All system alerts, transaction receipts, and security notifications in one place.
        </p>

        <div id="notificationsFullList" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: '#aaa', fontSize: '0.9rem' }}>
              No notifications. You are all caught up!
            </div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                style={{
                  background: 'var(--light)',
                  padding: '1.25rem',
                  borderRadius: '12px',
                  borderLeft: `5px solid ${n.type === 'success' ? 'var(--success)' : n.type === 'warning' ? 'var(--warning)' : 'var(--primary)'}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
                  {/* Unread indicator */}
                  {!n.read && (
                    <span
                      style={{
                        display: 'inline-block',
                        width: '8px',
                        height: '8px',
                        background: 'var(--primary)',
                        borderRadius: '50%',
                        marginTop: '6px',
                        flexShrink: 0
                      }}
                    ></span>
                  )}
                  <div>
                    <h4 style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {n.title}
                    </h4>
                    <p style={{ margin: '5px 0 0', fontSize: '0.85rem', color: '#475569', lineHeight: '1.4' }}>{n.message}</p>
                    <small style={{ display: 'block', marginTop: '5px', fontSize: '0.75rem', color: '#94a3b8' }}>{n.time}</small>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '8px', marginLeft: '1rem' }}>
                  {!n.read && (
                    <button
                      onClick={() => handleMarkSingleRead(n.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Read
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteNotif(n.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default NotificationsPanel;
