import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const ACADEMY_COURSES = [
  {
    id: 'course-001',
    title: 'Wealth Management Foundations',
    price: 250.00,
    icon: 'fa-piggy-bank',
    color: '#1e3c72',
    duration: '4 Lessons • 3 hrs',
    level: 'Beginner',
    description: 'Core principles of personal finance, compound interest, net-worth building, and portfolio diversification.',
    lessons: [
      { id: 'L1', title: 'Budgeting & Cash Flow Mastery', body: 'Learn how to design a zero-based budget, track cash flow, and eliminate financial leaks using proven frameworks used by CFPs.' },
      { id: 'L2', title: 'Compound Interest & Time Value of Money', body: 'Understand how compound interest works across savings, debt, and investments – and why starting early is critical for wealth accumulation.' },
      { id: 'L3', title: 'Portfolio Diversification Strategies', body: 'Explore asset allocation models (60/40, three-fund, income-focused) and how to select funds that match your risk tolerance and goals.' },
      { id: 'L4', title: 'Net Worth Tracking & Milestone Goals', body: 'Build a personal balance sheet, set SMART financial goals, and learn the 4% safe-withdrawal rule for retirement planning.' }
    ]
  },
  {
    id: 'course-002',
    title: 'Advanced DeFi & Crypto Staking',
    price: 450.00,
    icon: 'fa-coins',
    color: '#6f42c1',
    duration: '6 Lessons • 5 hrs',
    level: 'Advanced',
    description: 'Master decentralized finance protocols, liquidity pools, yield farming, and high-APY staking strategies.',
    lessons: [
      { id: 'L1', title: 'DeFi Protocol Architecture', body: 'Deep dive into smart contract mechanics, AMMs (Automated Market Makers), and how protocols like Uniswap, Curve, and Aave operate.' },
      { id: 'L2', title: 'Yield Farming & Liquidity Mining', body: 'Learn how to deploy capital into liquidity pools to earn swap fees, governance tokens, and compounding yield – with impermanent loss analysis.' },
      { id: 'L3', title: 'Proof-of-Stake & Validator Economics', body: 'Understand PoS consensus, validator requirements for ETH, SOL, and Cosmos chains, and projected staking ROI under different market conditions.' },
      { id: 'L4', title: 'Stablecoin Strategies & USD Pegging', body: 'Evaluate algorithmic vs. fiat-backed stablecoins, assess de-peg risks, and learn where to deploy USDT/USDC for max safe yield.' },
      { id: 'L5', title: 'Crypto Tax Obligations & Reporting', body: 'Understand IRS guidance on crypto as property, short vs. long-term capital gains, DeFi taxation nuances, and Form 8949 generation.' },
      { id: 'L6', title: 'Bridging & Cross-Chain Asset Flows', body: 'Explore bridge protocols, wrapped tokens, and multi-chain portfolio management to maximize yield across Layer-1 and Layer-2 ecosystems.' }
    ]
  },
  {
    id: 'course-003',
    title: 'Risk Assessment & Options Hedging',
    price: 199.99,
    icon: 'fa-shield-alt',
    color: '#28a745',
    duration: '5 Lessons • 4 hrs',
    level: 'Intermediate',
    description: 'Master options Greeks, protective puts, covered calls, and portfolio hedging strategies used by institutional traders.',
    lessons: [
      { id: 'L1', title: 'Understanding Options Mechanics', body: 'Learn calls vs. puts, intrinsic vs. time value, in-the-money / out-of-the-money dynamics, and options chain reading techniques.' },
      { id: 'L2', title: 'The Greeks: Delta, Gamma, Theta, Vega', body: 'Understand how each Greek drives option price sensitivity and how to use Greeks to model risk exposure and hedge effectively.' },
      { id: 'L3', title: 'Protective Puts & Portfolio Insurance', body: 'Learn how to use long puts as insurance against portfolio drawdowns and how to calculate breakeven protection costs.' },
      { id: 'L4', title: 'Covered Calls for Passive Income', body: 'Implement covered call strategies to generate monthly income on stock/crypto holdings while managing upside cap risk.' },
      { id: 'L5', title: 'Iron Condor & Spread Strategies', body: 'Construct multi-leg options spreads to profit in sideways markets with defined risk, and manage positions through expiration cycles.' }
    ]
  }
];

const AcademyPanel = () => {
  const {
    userData,
    setUserData,
    setTransactions,
    setNotifications
  } = useAuth();

  const [activeTab, setActiveTab] = useState('browse'); // 'browse', 'my'
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [activeLessonId, setActiveLessonId] = useState(null);

  const purchasedCourses = userData?.purchasedCourses || [];
  const completedLessons = userData?.completedLessons || [];

  const handleEnroll = (course) => {
    if (purchasedCourses.includes(course.id)) return;
    
    if ((userData?.checkingBalance || 0) < course.price) {
      alert('Insufficient checking balance to purchase this course.');
      return;
    }

    if (!window.confirm(`Confirm purchase of "${course.title}" for $${course.price.toFixed(2)} from your Checking account?`)) return;

    setUserData(prev => ({
      ...prev,
      checkingBalance: prev.checkingBalance - course.price,
      purchasedCourses: [...(prev.purchasedCourses || []), course.id]
    }));

    const txnId = 'ACAD-' + Math.floor(100000 + Math.random() * 900000);
    const newTxn = {
      type: 'membership',
      recipient: course.title,
      amount: course.price.toFixed(2),
      account: userData.checkingLast4,
      txnId: txnId,
      time: new Date().toLocaleString(),
      status: 'completed'
    };

    setTransactions(prev => [newTxn, ...prev]);

    const newNotif = {
      id: Date.now(),
      type: 'success',
      title: 'Course Enrolled!',
      message: `You successfully enrolled in "${course.title}". Start learning now.`,
      time: new Date().toLocaleString(),
      read: false
    };

    setNotifications(prev => [newNotif, ...prev]);
    alert(`Enrolled in "${course.title}" successfully!`);
  };

  const handleOpenPlayer = (courseId) => {
    const course = ACADEMY_COURSES.find(c => c.id === courseId);
    if (course) {
      setActiveCourseId(courseId);
      // Auto-load first lesson
      if (course.lessons.length > 0) {
        setActiveLessonId(course.lessons[0].id);
      } else {
        setActiveLessonId(null);
      }
      
      // Scroll to player panel after mount
      setTimeout(() => {
        const el = document.getElementById('lessonPlayerPanel');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const activeCourse = ACADEMY_COURSES.find(c => c.id === activeCourseId);
  const activeLesson = activeCourse?.lessons.find(l => l.id === activeLessonId);

  const doneLessonsInActiveCourse = activeCourse
    ? activeCourse.lessons.filter(l => completedLessons.includes(activeCourse.id + ':' + l.id)).length
    : 0;

  const activeCourseProgressPct = activeCourse
    ? Math.round((doneLessonsInActiveCourse / activeCourse.lessons.length) * 100)
    : 0;

  const handleToggleLessonCompletion = () => {
    if (!activeCourseId || !activeLessonId) return;
    const key = activeCourseId + ':' + activeLessonId;
    
    setUserData(prev => {
      const currentCompleted = [...(prev.completedLessons || [])];
      const idx = currentCompleted.indexOf(key);
      if (idx === -1) {
        currentCompleted.push(key);
      } else {
        currentCompleted.splice(idx, 1);
      }
      return { ...prev, completedLessons: currentCompleted };
    });
  };

  const handlePlayNextLesson = () => {
    if (!activeCourse) return;
    const currIdx = activeCourse.lessons.findIndex(l => l.id === activeLessonId);
    if (currIdx < activeCourse.lessons.length - 1) {
      setActiveLessonId(activeCourse.lessons[currIdx + 1].id);
    } else {
      // trigger success alert
      const successAlert = document.createElement('div');
      successAlert.style.cssText = 'position: fixed; top: 20px; right: 20px; background: linear-gradient(135deg, #00c6ff, #0072ff); z-index: 9999; padding: 1.5rem 2rem; border-radius: 16px; color: white; box-shadow: 0 15px 35px rgba(0,114,255,0.3); display: flex; flex-direction: column; gap: 5px;';
      successAlert.innerHTML = `<strong style="font-size:1.1rem;"><i class="fas fa-check-circle"></i> Course Complete!</strong><span>You have finished all lessons in this course!</span>`;
      document.body.appendChild(successAlert);
      setTimeout(() => successAlert.remove(), 4000);
    }
  };

  const handleClosePlayer = () => {
    setActiveCourseId(null);
    setActiveLessonId(null);
  };

  const myCourses = ACADEMY_COURSES.filter(c => purchasedCourses.includes(c.id));

  return (
    <section id="panel-membership-courses" className="dashboard-panel active">
      <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
        <h2>Membership & Financial Academy</h2>
        <p style={{ marginBottom: '2rem' }}>Upgrade your financial credentials and trading proficiency. Purchased courses are linked to your account forever.</p>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem', background: '#eee', padding: '5px', borderRadius: '10px', maxWidth: '500px' }}>
          <button
            className={`btn-secondary ${activeTab === 'browse' ? 'active' : ''}`}
            style={{ flex: 1, borderRadius: '8px', padding: '0.8rem', fontSize: '0.9rem' }}
            onClick={() => setActiveTab('browse')}
          >
            Browse Courses
          </button>
          <button
            className={`btn-secondary ${activeTab === 'my' ? 'active' : ''}`}
            style={{ flex: 1, borderRadius: '8px', padding: '0.8rem', fontSize: '0.9rem' }}
            onClick={() => setActiveTab('my')}
          >
            My Courses ({myCourses.length})
          </button>
        </div>

        {/* Tab 1: Browse Academy */}
        {activeTab === 'browse' && (
          <div id="academyBrowseSubPanel">
            <h3>Available Courses</h3>
            <div className="investment-plans-grid" id="academyBrowseCoursesGrid" style={{ marginTop: '1.5rem' }}>
              {ACADEMY_COURSES.map(c => {
                const owned = purchasedCourses.includes(c.id);
                return (
                  <div
                    key={c.id}
                    style={{
                      background: 'white',
                      borderRadius: '16px',
                      padding: '2rem',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                      border: '1px solid rgba(30,60,114,0.06)',
                      transition: 'transform 0.3s',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-6px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <div>
                      <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: `${c.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                        <i className={`fas ${c.icon}`} style={{ fontSize: '1.6rem', color: c.color }}></i>
                      </div>
                      <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>{c.title}</h3>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: '20px', background: `${c.color}18`, color: c.color, fontWeight: 700 }}>{c.level}</span>
                        <span style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: '20px', background: '#f1f5f9', color: '#64748b' }}>{c.duration}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>{c.description}</p>
                    </div>
                    {owned ? (
                      <button className="btn-primary" style={{ width: '100%', padding: '0.65rem' }} onClick={() => handleOpenPlayer(c.id)}>
                        <i className="fas fa-play"></i> Continue Learning
                      </button>
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>${c.price.toFixed(2)}</strong>
                        <button className="btn-primary" style={{ padding: '0.6rem 1.4rem', fontSize: '0.85rem' }} onClick={() => handleEnroll(c)}>
                          <i className="fas fa-shopping-cart"></i> Enroll
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: My Courses */}
        {activeTab === 'my' && (
          <div id="academyMySubPanel">
            <h3>My Enrolled Courses</h3>
            <div className="investment-plans-grid" id="academyMyCoursesGrid" style={{ marginTop: '1.5rem' }}>
              {myCourses.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 1rem', color: '#888', fontStyle: 'italic' }}>
                  You haven't enrolled in any courses yet. Go to "Browse Courses" to enroll.
                </div>
              ) : (
                myCourses.map(c => {
                  const doneCount = c.lessons.filter(l => completedLessons.includes(c.id + ':' + l.id)).length;
                  const pct = Math.round((doneCount / c.lessons.length) * 100);
                  return (
                    <div
                      key={c.id}
                      style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '2rem',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                        border: '1px solid rgba(30,60,114,0.06)',
                        transition: 'transform 0.3s',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-6px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <div>
                        <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: `${c.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                          <i className={`fas ${c.icon}`} style={{ fontSize: '1.6rem', color: c.color }}></i>
                        </div>
                        <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>{c.title}</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b' }}>
                            <span>Progress: {doneCount} of {c.lessons.length} lessons</span>
                            <strong>{pct}%</strong>
                          </div>
                          <div className="progress-bar" style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                            <div className="progress-fill" style={{ width: `${pct}%`, height: '100%', background: c.color, borderRadius: '3px' }}></div>
                          </div>
                        </div>
                      </div>
                      <button className="btn-primary" style={{ width: '100%', padding: '0.65rem' }} onClick={() => handleOpenPlayer(c.id)}>
                        <i className="fas fa-play"></i> Resume Class
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Course Detail & Lesson Player Viewer */}
      {activeCourse && (
        <div className="glass-panel" id="lessonPlayerPanel" style={{ padding: '2.5rem', display: 'block' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '10px' }}>
            <h3 id="playerCourseTitle" style={{ margin: 0 }}>{activeCourse.title}</h3>
            <button className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }} onClick={handleClosePlayer}>Close Player</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {/* Lessons List sidebar */}
            <div style={{ borderRight: window.innerWidth > 768 ? '1px solid var(--border-color)' : 'none', paddingRight: '1.5rem' }}>
              <h4>Course Outline</h4>
              <div style={{ fontSize: '0.8rem', margin: '5px 0 15px', color: 'var(--text-muted)' }} id="playerProgressLabel">
                {doneLessonsInActiveCourse} of {activeCourse.lessons.length} Completed
              </div>
              <div className="progress-bar" style={{ marginBottom: '1.5rem', height: '6px' }}>
                <div className="progress-fill" id="playerProgressFill" style={{ width: `${activeCourseProgressPct}%` }}></div>
              </div>
              <div id="playerLessonsList" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activeCourse.lessons.map((l, idx) => {
                  const done = completedLessons.includes(activeCourse.id + ':' + l.id);
                  const isCurrent = activeLessonId === l.id;
                  return (
                    <button
                      key={l.id}
                      onClick={() => setActiveLessonId(l.id)}
                      style={{
                        textAlign: 'left',
                        padding: '0.6rem 0.75rem',
                        borderRadius: '8px',
                        border: `1px solid ${isCurrent ? 'var(--primary)' : 'var(--border-color)'}`,
                        background: isCurrent ? 'rgba(30,60,114,0.06)' : 'white',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontFamily: 'inherit',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: 'var(--text-color)'
                      }}
                    >
                      <i className={`fas fa-${done ? 'check-circle' : 'circle'}`} style={{ color: done ? 'var(--success)' : '#ccc' }}></i>
                      <span>{idx + 1}. {l.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lesson Main content */}
            <div>
              {activeLesson ? (
                <>
                  <h4 id="playerLessonTitle" style={{ color: 'var(--primary)', fontSize: '1.25rem', margin: 0 }}>{activeLesson.title}</h4>
                  <div id="playerLessonBody" style={{ margin: '1.5rem 0', fontSize: '0.92rem', lineHeight: '1.7', color: 'var(--text-color)' }}>
                    <p>{activeLesson.body}</p>
                    <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'rgba(30,60,114,0.04)', borderRadius: '10px', borderLeft: '4px solid var(--primary)' }}>
                      <strong style={{ fontSize: '0.85rem', color: 'var(--primary)' }}><i className="fas fa-lightbulb"></i> Key Takeaway</strong>
                      <p style={{ margin: '8px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Apply this concept immediately: review your current financial statements and annotate where this lesson applies to your situation.
                      </p>
                    </div>
                  </div>
                  <div id="playerControls" style={{ display: 'flex', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', align_items: 'center', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="checkbox"
                        id="chkCompleteLesson"
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        checked={completedLessons.includes(activeCourse.id + ':' + activeLesson.id)}
                        onChange={handleToggleLessonCompletion}
                      />
                      <label htmlFor="chkCompleteLesson" style={{ fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600 }}>Mark lesson as completed</label>
                    </div>
                    <button className="btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }} id="btnNextLesson" onClick={handlePlayNextLesson}>
                      Next Lesson <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <h4 id="playerLessonTitle" style={{ color: 'var(--primary)', fontSize: '1.25rem', margin: 0 }}>Select a lesson to begin</h4>
                  <p id="playerLessonBody" style={{ margin: '1.5rem 0', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
                    Please choose any lesson from the outline to load video transcriptions and guides.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AcademyPanel;
