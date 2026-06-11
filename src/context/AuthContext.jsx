import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [cards, setCards] = useState([]);
  const [loans, setLoans] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  const [tradingHistory, setTradingHistory] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize and load from localStorage
  useEffect(() => {
    const loggedInEmail = localStorage.getItem('loggedInUser');
    const user = JSON.parse(localStorage.getItem('secureBankUser'));
    
    if (loggedInEmail && user && user.email === loggedInEmail) {
      setUserData(user);
      setIsAuthenticated(true);
      
      setTransactions(JSON.parse(localStorage.getItem('bankTransactions')) || [
        { type: 'deposit', recipient: 'Initial Account Seed', amount: '3000000.00', account: user.checkingLast4, txnId: 'TXN-INIT', time: new Date().toLocaleString(), status: 'completed' }
      ]);
      
      setNotifications(JSON.parse(localStorage.getItem('bankNotifications')) || [
        { id: Date.now(), type: 'info', title: 'Welcome to SecureBank!', message: 'Complete your KYC identity verification to unlock wire capabilities.', time: new Date().toLocaleString(), read: false }
      ]);

      setCards(JSON.parse(localStorage.getItem('bankCards')) || [
        { 
          id: 'CARD-8849', 
          type: 'visa', 
          tier: 'platinum', 
          cardHolder: user.name.toUpperCase(), 
          number: '4112 7834 8923 ' + user.checkingLast4, 
          expiry: '12/29', 
          cvc: '453', 
          balance: 5000.00, 
          status: 'active',
          transactions: [
            { merchant: 'Netflix Subscription', amount: 15.49, date: '06/10/2026' },
            { merchant: 'AWS Cloud Services', amount: 89.12, date: '06/08/2026' },
            { merchant: 'Uber Eats Premium', amount: 32.40, date: '06/05/2026' }
          ]
        }
      ]);

      setLoans(JSON.parse(localStorage.getItem('bankLoans')) || []);
      setInvestments(JSON.parse(localStorage.getItem('bankInvestments')) || []);
      setSupportTickets(JSON.parse(localStorage.getItem('bankSupportTickets')) || []);
      setTradingHistory(JSON.parse(localStorage.getItem('bankTradingHistory')) || [
        { id: 'TRD-9084', symbol: 'EUR/USD', type: 'buy', entryPrice: '1.0824', closePrice: '1.0890', amount: '250.00', profit: '152.00', status: 'closed', time: new Date(Date.now() - 3600000 * 24).toLocaleString() },
        { id: 'TRD-8473', symbol: 'GBP/USD', type: 'sell', entryPrice: '1.2640', closePrice: '1.2590', amount: '300.00', profit: '118.50', status: 'closed', time: new Date(Date.now() - 3600000 * 48).toLocaleString() },
        { id: 'TRD-7281', symbol: 'BTC/USD', type: 'buy', entryPrice: '63820.00', closePrice: '64500.00', amount: '500.00', profit: '532.70', status: 'closed', time: new Date(Date.now() - 3600000 * 72).toLocaleString() }
      ]);
    }
  }, []);

  // Persist states to localStorage when they change
  useEffect(() => {
    if (userData) {
      localStorage.setItem('secureBankUser', JSON.stringify(userData));
    }
  }, [userData]);

  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem('bankTransactions', JSON.stringify(transactions));
    }
  }, [transactions]);

  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('bankNotifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  useEffect(() => {
    if (cards.length > 0) {
      localStorage.setItem('bankCards', JSON.stringify(cards));
    }
  }, [cards]);

  useEffect(() => {
    if (loans.length > 0) {
      localStorage.setItem('bankLoans', JSON.stringify(loans));
    }
  }, [loans]);

  useEffect(() => {
    if (investments.length > 0) {
      localStorage.setItem('bankInvestments', JSON.stringify(investments));
    }
  }, [investments]);

  useEffect(() => {
    if (supportTickets.length > 0) {
      localStorage.setItem('bankSupportTickets', JSON.stringify(supportTickets));
    }
  }, [supportTickets]);

  useEffect(() => {
    if (tradingHistory.length > 0) {
      localStorage.setItem('bankTradingHistory', JSON.stringify(tradingHistory));
    }
  }, [tradingHistory]);

  const login = (user) => {
    setUserData(user);
    setIsAuthenticated(true);
    localStorage.setItem('loggedInUser', user.email);
    
    // Load remaining tables
    setTransactions(JSON.parse(localStorage.getItem('bankTransactions')) || [
      { type: 'deposit', recipient: 'Initial Account Seed', amount: '3000000.00', account: user.checkingLast4, txnId: 'TXN-INIT', time: new Date().toLocaleString(), status: 'completed' }
    ]);
    setNotifications(JSON.parse(localStorage.getItem('bankNotifications')) || [
      { id: Date.now(), type: 'info', title: 'Welcome to SecureBank!', message: 'Complete your KYC identity verification to unlock wire capabilities.', time: new Date().toLocaleString(), read: false }
    ]);
    setCards(JSON.parse(localStorage.getItem('bankCards')) || [
      { 
        id: 'CARD-8849', 
        type: 'visa', 
        tier: 'platinum', 
        cardHolder: user.name.toUpperCase(), 
        number: '4112 7834 8923 ' + user.checkingLast4, 
        expiry: '12/29', 
        cvc: '453', 
        balance: 5000.00, 
        status: 'active',
        transactions: [
          { merchant: 'Netflix Subscription', amount: 15.49, date: '06/10/2026' },
          { merchant: 'AWS Cloud Services', amount: 89.12, date: '06/08/2026' },
          { merchant: 'Uber Eats Premium', amount: 32.40, date: '06/05/2026' }
        ]
      }
    ]);
    setLoans(JSON.parse(localStorage.getItem('bankLoans')) || []);
    setInvestments(JSON.parse(localStorage.getItem('bankInvestments')) || []);
    setSupportTickets(JSON.parse(localStorage.getItem('bankSupportTickets')) || []);
    setTradingHistory(JSON.parse(localStorage.getItem('bankTradingHistory')) || [
      { id: 'TRD-9084', symbol: 'EUR/USD', type: 'buy', entryPrice: '1.0824', closePrice: '1.0890', amount: '250.00', profit: '152.00', status: 'closed', time: new Date(Date.now() - 3600000 * 24).toLocaleString() },
      { id: 'TRD-8473', symbol: 'GBP/USD', type: 'sell', entryPrice: '1.2640', closePrice: '1.2590', amount: '300.00', profit: '118.50', status: 'closed', time: new Date(Date.now() - 3600000 * 48).toLocaleString() },
      { id: 'TRD-7281', symbol: 'BTC/USD', type: 'buy', entryPrice: '63820.00', closePrice: '64500.00', amount: '500.00', profit: '532.70', status: 'closed', time: new Date(Date.now() - 3600000 * 72).toLocaleString() }
    ]);
  };

  const logout = () => {
    setUserData(null);
    setIsAuthenticated(false);
    localStorage.removeItem('loggedInUser');
  };

  const playSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      gain1.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      osc1.start(audioCtx.currentTime);
      osc1.stop(audioCtx.currentTime + 0.5);
      
      setTimeout(() => {
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(880.00, audioCtx.currentTime); // A5
        gain2.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
        osc2.start(audioCtx.currentTime);
        osc2.stop(audioCtx.currentTime + 0.8);
      }, 120);
    } catch (e) {
      console.log('AudioContext blocked/unsupported:', e);
    }
  };

  const addTransaction = (txn) => {
    setTransactions(prev => [txn, ...prev]);
  };

  const addNotification = (notif) => {
    setNotifications(prev => [notif, ...prev]);
  };

  const handleDeposit = (gateway, amount) => {
    setUserData(prev => ({
      ...prev,
      checkingBalance: prev.checkingBalance + amount,
      incomeThisMonth: prev.incomeThisMonth + amount
    }));

    const txnId = 'DEP-' + Math.floor(100000 + Math.random() * 900000);
    addTransaction({
      type: 'deposit',
      recipient: `Deposit Gateway (${gateway.toUpperCase()})`,
      amount: amount.toFixed(2),
      account: userData.checkingLast4,
      txnId: txnId,
      time: new Date().toLocaleString(),
      status: 'completed'
    });

    addNotification({
      id: Date.now(),
      type: 'success',
      title: 'Deposit Received',
      message: `Credited $${amount.toLocaleString()} to Checking via ${gateway.toUpperCase()}.`,
      time: new Date().toLocaleString(),
      read: false
    });

    playSound();
  };

  const handleWithdrawal = (source, method, dest, amount) => {
    setUserData(prev => ({
      ...prev,
      checkingBalance: source === 'checking' ? prev.checkingBalance - amount : prev.checkingBalance,
      savingsBalance: source === 'savings' ? prev.savingsBalance - amount : prev.savingsBalance,
      spendingThisMonth: prev.spendingThisMonth + amount
    }));

    const txnId = 'WTH-' + Math.floor(100000 + Math.random() * 900000);
    addTransaction({
      type: 'withdrawal',
      recipient: `Withdrawal to ${method.toUpperCase()} (${dest.slice(0, 8)}...)`,
      amount: amount.toFixed(2),
      account: source === 'checking' ? userData.checkingLast4 : userData.savingsLast4,
      txnId: txnId,
      time: new Date().toLocaleString(),
      status: 'completed'
    });

    addNotification({
      id: Date.now(),
      type: 'warning',
      title: 'Withdrawal Processed',
      message: `Deducted $${amount.toLocaleString()} from ${source}.`,
      time: new Date().toLocaleString(),
      read: false
    });

    playSound();
  };

  const executeTransfer = (details) => {
    setUserData(prev => ({
      ...prev,
      checkingBalance: details.source === 'checking' ? prev.checkingBalance - details.deduction : prev.checkingBalance,
      savingsBalance: details.source === 'savings' ? prev.savingsBalance - details.deduction : prev.savingsBalance,
      spendingThisMonth: prev.spendingThisMonth + details.deduction
    }));

    const txnId = 'TXN-' + Math.floor(100000 + Math.random() * 900000);
    addTransaction({
      type: 'transfer-out',
      recipient: details.recipientName,
      amount: details.amount.toFixed(2),
      account: details.source === 'checking' ? userData.checkingLast4 : userData.savingsLast4,
      txnId: txnId,
      time: new Date().toLocaleString(),
      status: 'completed'
    });

    addNotification({
      id: Date.now(),
      type: 'success',
      title: 'Transfer Sent',
      message: `Sent $${details.amount.toLocaleString()} to ${details.recipientName} via ${details.gateway.toUpperCase()}.`,
      time: new Date().toLocaleString(),
      read: false
    });

    playSound();
  };

  const executeInternalTransfer = (source, target, amount) => {
    setUserData(prev => {
      const isChecking = source === 'checking';
      return {
        ...prev,
        checkingBalance: isChecking ? prev.checkingBalance - amount : prev.checkingBalance + amount,
        savingsBalance: isChecking ? prev.savingsBalance + amount : prev.savingsBalance - amount
      };
    });

    const txnId = 'TXN-' + Math.floor(100000 + Math.random() * 900000);
    
    // Credit record
    addTransaction({
      type: 'deposit',
      recipient: `Transfer to ${target}`,
      amount: amount.toFixed(2),
      account: target === 'checking' ? userData.checkingLast4 : userData.savingsLast4,
      txnId: txnId,
      time: new Date().toLocaleString(),
      status: 'completed'
    });

    // Debit record
    addTransaction({
      type: 'transfer-out',
      recipient: `Transfer from ${source}`,
      amount: amount.toFixed(2),
      account: source === 'checking' ? userData.checkingLast4 : userData.savingsLast4,
      txnId: txnId,
      time: new Date().toLocaleString(),
      status: 'completed'
    });

    addNotification({
      id: Date.now(),
      type: 'success',
      title: 'Internal Transfer Complete',
      message: `Transferred $${amount.toLocaleString()} from ${source} to ${target}.`,
      time: new Date().toLocaleString(),
      read: false
    });

    playSound();
  };

  const applyVirtualCard = (type, tier, limit) => {
    setUserData(prev => ({
      ...prev,
      checkingBalance: prev.checkingBalance - 10.00 // Card issuance fee
    }));

    const cardNum = (type === 'visa' ? '4112' : '5243') + ' ' +
                    Math.floor(1000 + Math.random()*9000) + ' ' +
                    Math.floor(1000 + Math.random()*9000) + ' ' +
                    userData.checkingLast4;

    const newCard = {
      id: 'CARD-' + Math.floor(1000 + Math.random()*9000),
      type: type,
      tier: tier,
      cardHolder: userData.name.toUpperCase(),
      number: cardNum,
      expiry: '06/30',
      cvc: Math.floor(100 + Math.random()*900).toString(),
      balance: limit,
      status: 'active',
      transactions: [
        { merchant: 'Card Provisioning Setup', amount: 0.00, date: new Date().toLocaleDateString() }
      ]
    };

    setCards(prev => [...prev, newCard]);

    const txnId = 'CRD-' + Math.floor(100000 + Math.random() * 900000);
    addTransaction({
      type: 'card-txn',
      recipient: `Virtual Card Generation (${tier.toUpperCase()})`,
      amount: '10.00',
      account: userData.checkingLast4,
      txnId: txnId,
      time: new Date().toLocaleString(),
      status: 'completed'
    });

    addNotification({
      id: Date.now(),
      type: 'success',
      title: 'Virtual Card Issued',
      message: `Your new virtual ${type} (${tier}) was activated successfully.`,
      time: new Date().toLocaleString(),
      read: false
    });

    playSound();
    return newCard.id;
  };

  const toggleFreezeCard = (cardId) => {
    setCards(prev => prev.map(c => {
      if (c.id === cardId) {
        const nextStatus = c.status === 'active' ? 'frozen' : 'active';
        addNotification({
          id: Date.now(),
          type: 'info',
          title: nextStatus === 'frozen' ? 'Card Frozen' : 'Card Unfrozen',
          message: `Virtual card ****${c.number.slice(-4)} has been ${nextStatus === 'frozen' ? 'blocked temporarily' : 'reactivated'}.`,
          time: new Date().toLocaleString(),
          read: false
        });
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  const toggleBlockCard = (cardId) => {
    setCards(prev => prev.map(c => {
      if (c.id === cardId) {
        const nextStatus = c.status === 'active' ? 'blocked' : 'active';
        addNotification({
          id: Date.now(),
          type: 'warning',
          title: nextStatus === 'blocked' ? 'Card Blocked' : 'Card Unblocked',
          message: `Virtual card ****${c.number.slice(-4)} has been ${nextStatus === 'blocked' ? 'restricted' : 'reactivated'}.`,
          time: new Date().toLocaleString(),
          read: false
        });
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  const deleteCard = (cardId) => {
    setCards(prev => prev.filter(c => c.id !== cardId));
    addNotification({
      id: Date.now(),
      type: 'warning',
      title: 'Card Deactivated',
      message: 'A virtual card was permanently destroyed.',
      time: new Date().toLocaleString(),
      read: false
    });
  };

  const applyLoan = (amount, term, purpose) => {
    const newLoan = {
      id: 'LOAN-' + Math.floor(1000 + Math.random()*9000),
      purpose: purpose,
      amount: amount,
      term: term,
      status: 'pending',
      dateApplied: new Date().toLocaleDateString()
    };

    setLoans(prev => [...prev, newLoan]);

    // Simulated Auto approval after 8 seconds
    setTimeout(() => {
      setLoans(prev => prev.map(l => {
        if (l.id === newLoan.id && l.status === 'pending') {
          setUserData(user => ({
            ...user,
            checkingBalance: user.checkingBalance + amount,
            incomeThisMonth: user.incomeThisMonth + amount
          }));

          const txnId = 'LN-' + Math.floor(100000 + Math.random()*900000);
          addTransaction({
            type: 'deposit',
            recipient: `Credit: Loan Principal (${l.id})`,
            amount: amount.toFixed(2),
            account: userData.checkingLast4,
            txnId: txnId,
            time: new Date().toLocaleString(),
            status: 'completed'
          });

          addNotification({
            id: Date.now(),
            type: 'success',
            title: 'Loan Approved!',
            message: `Collateral review approved $${amount.toLocaleString()} into checking.`,
            time: new Date().toLocaleString(),
            read: false
          });

          playSound();
          return { ...l, status: 'approved' };
        }
        return l;
      }));
    }, 8000);
  };

  const repayLoan = (loanId, amount) => {
    setUserData(prev => ({
      ...prev,
      checkingBalance: prev.checkingBalance - amount
    }));

    setLoans(prev => prev.map(l => {
      if (l.id === loanId) {
        return { ...l, status: 'repaid' };
      }
      return l;
    }));

    const txnId = 'LN-' + Math.floor(100000 + Math.random()*900000);
    addTransaction({
      type: 'withdrawal',
      recipient: `Debit: Repaid Loan (${loanId})`,
      amount: amount.toFixed(2),
      account: userData.checkingLast4,
      txnId: txnId,
      time: new Date().toLocaleString(),
      status: 'completed'
    });

    addNotification({
      id: Date.now(),
      type: 'success',
      title: 'Loan Repaid',
      message: `Fully settled loan reference ${loanId}.`,
      time: new Date().toLocaleString(),
      read: false
    });

    playSound();
  };

  const joinStakingPlan = (planName, amount, apr, days) => {
    setUserData(prev => ({
      ...prev,
      checkingBalance: prev.checkingBalance - amount
    }));

    const newStaking = {
      id: 'STK-' + Math.floor(1000 + Math.random()*9000),
      planName: planName,
      amount: amount,
      rate: apr,
      dateJoined: new Date().toLocaleDateString(),
      status: 'active'
    };

    setInvestments(prev => [...prev, newStaking]);

    const txnId = 'INV-' + Math.floor(100000 + Math.random() * 900000);
    addTransaction({
      type: 'investment',
      recipient: `Yield Staking: ${planName}`,
      amount: amount.toFixed(2),
      account: userData.checkingLast4,
      txnId: txnId,
      time: new Date().toLocaleString(),
      status: 'completed'
    });

    addNotification({
      id: Date.now(),
      type: 'success',
      title: 'Staking Plan Initiated',
      message: `Staked $${amount.toLocaleString()} in ${planName} at ${apr}% APR.`,
      time: new Date().toLocaleString(),
      read: false
    });

    playSound();
  };

  const cancelStakingPlan = (stakingId, amount, planName) => {
    const penalty = amount * 0.10;
    const refund = amount - penalty;

    setUserData(prev => ({
      ...prev,
      checkingBalance: prev.checkingBalance + refund
    }));

    setInvestments(prev => prev.map(i => {
      if (i.id === stakingId) {
        return { ...i, status: 'cancelled' };
      }
      return i;
    }));

    const txnId = 'INV-' + Math.floor(100000 + Math.random() * 900000);
    addTransaction({
      type: 'deposit',
      recipient: `Early Release: ${planName} (Refund)`,
      amount: refund.toFixed(2),
      account: userData.checkingLast4,
      txnId: txnId,
      time: new Date().toLocaleString(),
      status: 'completed'
    });

    addNotification({
      id: Date.now(),
      type: 'warning',
      title: 'Staking Released Early',
      message: `Refunded $${refund.toLocaleString()} (Charged penalty of $${penalty.toLocaleString()}).`,
      time: new Date().toLocaleString(),
      read: false
    });

    playSound();
  };

  const submitTicket = (category, subject, description, priority, email) => {
    const newTicket = {
      id: 'TKT-' + Math.floor(10000 + Math.random() * 90000),
      category,
      subject,
      description,
      priority,
      email,
      status: 'open',
      date: new Date().toLocaleString()
    };

    setSupportTickets(prev => [newTicket, ...prev]);

    addNotification({
      id: Date.now(),
      type: 'info',
      title: 'Support Ticket Submitted',
      message: `Ticket #${newTicket.id}: "${subject}" is open.`,
      time: new Date().toLocaleString(),
      read: false
    });

    playSound();

    // Auto update status after 20s
    setTimeout(() => {
      setSupportTickets(prev => prev.map(t => {
        if (t.id === newTicket.id) {
          return { ...t, status: 'in-progress' };
        }
        return t;
      }));
    }, 20000);
  };

  const renewSignals = () => {
    const fee = 49.00;
    setUserData(prev => ({
      ...prev,
      checkingBalance: prev.checkingBalance - fee,
      spendingThisMonth: prev.spendingThisMonth + fee
    }));

    const txnId = 'SIG-' + Math.floor(100000 + Math.random() * 900000);
    addTransaction({
      type: 'card-txn',
      recipient: 'Signal Group Auto-Renewal',
      amount: fee.toFixed(2),
      account: userData.checkingLast4,
      txnId: txnId,
      time: new Date().toLocaleString(),
      status: 'completed'
    });

    addNotification({
      id: Date.now(),
      type: 'success',
      title: 'Signals Renewed',
      message: `Signal subscription auto-renewed. Debited $${fee.toFixed(2)}.`,
      time: new Date().toLocaleString(),
      read: false
    });

    playSound();
  };

  const handleCryptoSwap = (from, to, amountFrom, amountTo, usdEquiv) => {
    setUserData(prev => {
      const getBalance = (asset) => {
        if (asset === 'usd') return prev.checkingBalance;
        if (asset === 'btc') return prev.btcBalance;
        if (asset === 'eth') return prev.ethBalance;
        if (asset === 'sol') return prev.solBalance;
        if (asset === 'usdt') return prev.usdtBalance;
        return 0;
      };

      const setBalance = (asset, val) => {
        const next = { ...prev };
        if (asset === 'usd') next.checkingBalance = val;
        if (asset === 'btc') next.btcBalance = val;
        if (asset === 'eth') next.ethBalance = val;
        if (asset === 'sol') next.solBalance = val;
        if (asset === 'usdt') next.usdtBalance = val;
        return next;
      };

      const step1 = setBalance(from, getBalance(from) - amountFrom);
      return setBalance(to, getBalance(to) + amountTo);
    });

    const txnId = 'SWP-' + Math.floor(100000 + Math.random() * 900000);
    addTransaction({
      type: 'crypto-swap',
      recipient: `Crypto Swap (${from.toUpperCase()} ➔ ${to.toUpperCase()})`,
      amount: usdEquiv.toFixed(2),
      account: userData.checkingLast4,
      txnId: txnId,
      time: new Date().toLocaleString(),
      status: 'completed'
    });

    addNotification({
      id: Date.now(),
      type: 'success',
      title: 'Crypto Swap Executed',
      message: `Exchanged ${amountFrom} ${from.toUpperCase()} for ${amountTo.toFixed(5)} ${to.toUpperCase()}.`,
      time: new Date().toLocaleString(),
      read: false
    });

    playSound();
  };

  return (
    <AuthContext.Provider value={{
      userData,
      setUserData,
      transactions,
      setTransactions,
      notifications,
      setNotifications,
      cards,
      loans,
      investments,
      supportTickets,
      tradingHistory,
      isAuthenticated,
      login,
      logout,
      handleDeposit,
      handleWithdrawal,
      executeTransfer,
      executeInternalTransfer,
      applyVirtualCard,
      toggleFreezeCard,
      toggleBlockCard,
      deleteCard,
      applyLoan,
      repayLoan,
      joinStakingPlan,
      cancelStakingPlan,
      submitTicket,
      renewSignals,
      handleCryptoSwap
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
