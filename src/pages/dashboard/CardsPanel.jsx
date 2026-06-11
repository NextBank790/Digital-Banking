import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const CardsPanel = () => {
  const {
    userData,
    cards,
    applyVirtualCard,
    toggleFreezeCard,
    toggleBlockCard,
    deleteCard
  } = useAuth();

  const [activeCardId, setActiveCardId] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [cardType, setCardType] = useState('visa');
  const [cardTier, setCardTier] = useState('platinum');
  const [cardLimit, setCardLimit] = useState('');

  // Auto-select first card if activeCardId is empty or not in cards list
  useEffect(() => {
    if (cards.length > 0) {
      const exists = cards.some(c => c.id === activeCardId);
      if (!exists) {
        setActiveCardId(cards[0].id);
      }
    } else {
      setActiveCardId('');
    }
  }, [cards, activeCardId]);

  const activeCard = cards.find(c => c.id === activeCardId);

  const handleApplyCardSubmit = (e) => {
    e.preventDefault();
    const limit = parseFloat(cardLimit);

    if (isNaN(limit) || limit <= 0) {
      alert('Enter valid limit.');
      return;
    }
    if ((userData?.checkingBalance || 0) < 10.00) {
      alert('Virtual card generation fee is $10.00. Checking balance too low.');
      return;
    }

    const newCardId = applyVirtualCard(cardType, cardTier, limit);
    setActiveCardId(newCardId);

    // Reset
    setCardLimit('');
    setShowApplyModal(false);
  };

  const handleFreezeToggle = () => {
    if (activeCardId) {
      toggleFreezeCard(activeCardId);
    }
  };

  const handleBlockToggle = () => {
    if (activeCardId) {
      toggleBlockCard(activeCardId);
    }
  };

  const handleDeleteCard = () => {
    if (activeCardId && window.confirm('Are you sure you want to permanently delete this card?')) {
      deleteCard(activeCardId);
    }
  };

  return (
    <section id="panel-virtual-cards" className="dashboard-panel active">
      <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '10px' }}>
          <h2>Virtual Cards Management</h2>
          <button className="btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }} onClick={() => setShowApplyModal(true)}>
            <i className="fas fa-plus"></i> Apply for Card
          </button>
        </div>
        <p style={{ marginBottom: '2rem' }}>Instantly issue Visa/Mastercard virtual cards for secure online subscriptions and transactions.</p>
        
        {/* Carousel Slider */}
        <div className="cards-carousel" id="cardsContainer" style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
          {cards.length === 0 ? (
            <p style={{ color: '#888', fontStyle: 'italic', padding: '1rem 0' }}>No active virtual cards. Click Apply for Card to issue one.</p>
          ) : (
            cards.map(c => {
              const isActive = activeCardId === c.id;
              return (
                <div
                  key={c.id}
                  className={`virtual-card-item ${c.tier} ${c.type}`}
                  onClick={() => setActiveCardId(c.id)}
                  style={{
                    cursor: 'pointer',
                    position: 'relative',
                    border: isActive ? '3px solid var(--gold)' : '1px solid rgba(255,255,255,0.1)',
                    flexShrink: 0
                  }}
                >
                  {/* Freeze Overlay */}
                  {c.status === 'frozen' && (
                    <div className="card-frozen-overlay" style={{ display: 'flex', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(30,60,114,0.9)', zIndex: 10, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px', color: 'white', borderRadius: '12px' }}>
                      <i className="fas fa-lock" style={{ fontSize: '1.5rem' }}></i>
                      <strong>CARD FROZEN</strong>
                    </div>
                  )}

                  {/* Block Overlay */}
                  {c.status === 'blocked' && (
                    <div className="card-blocked-overlay" style={{ display: 'flex', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(220,53,69,0.95)', zIndex: 10, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px', color: 'white', borderRadius: '12px' }}>
                      <i className="fas fa-ban" style={{ fontSize: '1.5rem' }}></i>
                      <strong>CARD BLOCKED</strong>
                    </div>
                  )}

                  <div className="card-item-top" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem' }}><i className="fas fa-university"></i> SECUREBANK</span>
                    <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>{c.tier}</span>
                  </div>
                  <div className="card-item-number" style={{ fontSize: '1.2rem', fontFamily: 'Courier New, monospace', margin: '1.5rem 0', letterSpacing: '2px' }}>{c.number}</div>
                  <div className="card-item-bottom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
                    <div>
                      <div style={{ fontSize: '0.6rem', opacity: 0.6 }}>CARD HOLDER</div>
                      <div style={{ fontSize: '0.85rem', fontSpread: 'bold', fontWeight: 'bold' }}>{c.cardHolder}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.6rem', opacity: 0.6 }}>EXPIRES</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{c.expiry}</div>
                    </div>
                    <div>
                      <i className={`fab fa-cc-${c.type}`} style={{ fontSize: '2rem', opacity: 0.9 }}></i>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Card Details and Limits controls */}
      {activeCard && (
        <div className="settings-grid" id="cardActionsGrid" style={{ display: 'grid' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3>Card Controls (****{activeCard.number.slice(-4)})</h3>
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>Freeze Virtual Card</strong>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Temporarily block new activities</p>
                </div>
                <button
                  className="btn-secondary"
                  style={{ padding: '0.5rem 1rem', borderRadius: '20px' }}
                  id="freezeToggleBtn"
                  onClick={handleFreezeToggle}
                >
                  {activeCard.status === 'frozen' ? 'Unfreeze' : 'Freeze'}
                </button>
              </div>
              <hr style={{ border: 0, borderTop: '1px solid var(--border-color)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>Block Card Security Lock</strong>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Restrict or unrestrict virtual card usage</p>
                </div>
                <button
                  className="btn-secondary"
                  style={{ padding: '0.5rem 1rem', borderRadius: '20px', background: activeCard.status === 'blocked' ? '#1e3c72' : 'var(--warning)', border: 'none', color: activeCard.status === 'blocked' ? 'white' : 'black' }}
                  id="blockToggleBtn"
                  onClick={handleBlockToggle}
                >
                  {activeCard.status === 'blocked' ? 'Unblock' : 'Block'}
                </button>
              </div>
              <hr style={{ border: 0, borderTop: '1px solid var(--border-color)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: 'var(--danger)' }}>Deactivate / Delete Card</strong>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Permanently close and delete this card</p>
                </div>
                <button
                  className="btn-primary"
                  style={{ padding: '0.5rem 1rem', background: '#dc3545', border: 'none' }}
                  onClick={handleDeleteCard}
                >
                  Delete Card
                </button>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3>Card Log / History</h3>
            <div style={{ marginTop: '1rem', maxHeight: '200px', overflowY: 'auto' }} id="cardTxnHistoryList">
              {(!activeCard.transactions || activeCard.transactions.length === 0) ? (
                <p style={{ color: '#888', fontStyle: 'italic', padding: '1rem 0' }}>No transactions recorded for this card.</p>
              ) : (
                activeCard.transactions.map((t, index) => {
                  const isZero = t.amount === 0;
                  return (
                    <div key={index} style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-color)', fontSize: '0.85rem', display: 'flex', justify: 'space-between', justifyContent: 'space-between' }}>
                      <span>{t.merchant}</span>
                      <strong className={isZero ? '' : 'loss'}>
                        {isZero ? '' : '-'}${t.amount.toFixed(2)}
                      </strong>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Apply Card Modal */}
      {showApplyModal && (
        <div className="modal" id="applyCardModal" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div className="modal-content glass-panel" style={{ background: 'white', borderRadius: '20px', padding: '2.5rem', maxWidth: '500px', width: '90%', boxShadow: '0 25px 60px rgba(0,0,0,0.3)', border: '1px solid #ddd' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-dark)', margin: '0 0 1.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.75rem' }}>
              <i className="fas fa-credit-card" style={{ color: 'var(--gold)' }}></i> Apply for Virtual Card
            </h3>
            
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem' }}>A virtual card setup fee of <strong>$10.00</strong> will be debited from your checking account.</p>

            <form onSubmit={handleApplyCardSubmit} id="formApplyCard">
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 500 }}>Card Brand / Network</label>
                <select
                  id="cardTypeSelect"
                  className="form-control"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
                  value={cardType}
                  onChange={(e) => setCardType(e.target.value)}
                >
                  <option value="visa">Visa Network</option>
                  <option value="mastercard">Mastercard Network</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 500 }}>Card Tier</label>
                <select
                  id="cardTierSelect"
                  className="form-control"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
                  value={cardTier}
                  onChange={(e) => setCardTier(e.target.value)}
                >
                  <option value="platinum">Platinum Card</option>
                  <option value="gold">Gold Card</option>
                  <option value="black">Black Card (Exclusive)</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 500 }}>Spending Limit / Balance ($)</label>
                <input
                  type="number"
                  id="cardLimitInput"
                  placeholder="5000.00"
                  className="form-control"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
                  value={cardLimit}
                  onChange={(e) => setCardLimit(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Issue Card</button>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowApplyModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default CardsPanel;
