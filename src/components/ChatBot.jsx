import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your SecureBank support chatbot. How can I assist you with your digital banking needs today?' }
  ]);
  
  const { userData } = useAuth();
  const bodyRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const postMessage = (text, sender) => {
    setMessages(prev => [...prev, { sender, text }]);
  };

  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;

    const query = inputVal.trim();
    postMessage(query, 'user');
    setInputVal('');

    setTimeout(() => {
      processBotResponse(query);
    }, 800);
  };

  const sendQuickReply = (text) => {
    postMessage(text, 'user');
    setTimeout(() => {
      processBotResponse(text);
    }, 800);
  };

  const processBotResponse = (query) => {
    const q = query.toLowerCase();
    let res = "I'm sorry, I didn't quite catch that. Can you ask about 'deposit method', 'virtual card', 'apply for loan' or 'crypto swap'?";

    if (q.includes('balance') || q.includes('net worth') || q.includes('how much money') || q.includes('checking') || q.includes('savings')) {
      if (userData) {
        res = `Your active SecureBank balances are:
Checking: $${userData.checkingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
Savings: $${userData.savingsBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
Crypto Value: BTC: ${userData.btcBalance} (~$${(userData.btcBalance * 64231).toLocaleString()}), ETH: ${userData.ethBalance} (~$${(userData.ethBalance * 3452).toLocaleString()})`;
      } else {
        res = "Please log in to check your account balances.";
      }
    } else if (q.includes('swap') || q.includes('crypto')) {
      res = "To swap crypto assets, navigate to the 'Crypto Wallet' tab in the sidebar, input the sell amount, choose buy asset type, and click 'Confirm Asset Swap'. Swaps are instant.";
    } else if (q.includes('freeze') || q.includes('card')) {
      res = "Go to 'Virtual Cards' in the sidebar menu. Select your card in the carousel, then click 'Freeze Card' to block online payments. You can reactivate it anytime.";
    } else if (q.includes('loan') || q.includes('borrow')) {
      res = "Loans can be requested in the 'Loans & Refer' tab. Input your desired principal and terms. SecureBank AI will auto-evaluate your limits and approve within 10 seconds.";
    } else if (q.includes('deposit') || q.includes('fund')) {
      res = "Navigate to the 'Deposits & Pay' panel. Choose bank wire or crypto, copy the account/address coordinates, input the amount, and submit a proof of payment screenshot.";
    } else if (q.includes('verify') || q.includes('kyc')) {
      res = "KYC documents can be loaded in the 'Account KYC' panel. Submit standard ID front and back photos to unlock large SWIFT wires.";
    } else if (q.includes('pin') || q.includes('security')) {
      res = "You can update your transaction PIN (4 digits) or toggle 2FA authentication screens under the 'Settings & Security' tab.";
    } else if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
      res = "Hello! Welcome to SecureBank Support. Type any questions about transfers, crypto, staking, virtual cards, or loans.";
    }

    postMessage(res, 'bot');
  };

  return (
    <div className={`chatbot-widget ${isOpen ? 'open' : ''}`} id="chatbotWidget">
      <button className="chatbot-toggle-btn" onClick={toggleChat}>
        {!isOpen ? <i className="fas fa-comments chat-icon"></i> : <i className="fas fa-times close-chat-icon"></i>}
      </button>
      <div className="chatbot-window">
        <div className="chatbot-header">
          <i className="fas fa-robot"></i>
          <div>
            <h4 style={{ margin: 0, fontWeight: 800, fontSize: '1.05rem' }}>SecureBank Assistant</h4>
            <small style={{ color: 'var(--gold)', fontSize: '0.75rem' }}>
              <span style={{ display: 'inline-block', width: '6px', height: '6px', background: '#00ff88', borderRadius: '50%', marginRight: '3px' }}></span> Online Support Bot
            </small>
          </div>
        </div>
        
        <div className="chatbot-body" id="chatbotBody" ref={bodyRef}>
          {messages.map((m, idx) => (
            <div key={idx} className={`chat-msg ${m.sender}`}>
              {m.text.split('\n').map((line, lIdx) => (
                <div key={lIdx}>{line}</div>
              ))}
            </div>
          ))}
        </div>
        
        <div className="chatbot-quick-replies">
          <button className="quick-reply-btn" onClick={() => sendQuickReply('How to Swap Crypto')}>Swap Crypto</button>
          <button className="quick-reply-btn" onClick={() => sendQuickReply('Freeze Card')}>Freeze Card</button>
          <button className="quick-reply-btn" onClick={() => sendQuickReply('Loan Requirements')}>Loan Requirements</button>
          <button className="quick-reply-btn" onClick={() => sendQuickReply('Check my balance')} style={{ background: 'rgba(40,167,69,0.12)', color: 'var(--success)', fontWeight: 800, borderColor: 'rgba(40,167,69,0.2)' }}>
            <i className="fas fa-bell"></i> Check Balance
          </button>
        </div>

        <form className="chatbot-footer" onSubmit={handleSend}>
          <input 
            type="text" 
            placeholder="Ask a support question..." 
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            required 
          />
          <button type="submit" className="chat-send-btn"><i class="fas fa-paper-plane"></i></button>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;
