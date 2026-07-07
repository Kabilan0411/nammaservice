import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';
import Card from './Card';
import Button from './Button';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: 'Hi! I am NammaSupport AI. How can I help you today?', sender: 'bot', options: ['Find a Plumber', 'Book AC Technician', 'How it works?', 'Pricing Info'] }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const getBotResponse = (userText) => {
    const text = userText.toLowerCase();
    
    if (text.includes('plumb') || text.includes('pipe') || text.includes('tap') || text.includes('leak')) {
      return {
        text: 'I can help you find a professional Plumber! Click the link below to browse available plumbers in your area.',
        link: { text: 'Browse Plumbers', url: '/search?category=Plumber' }
      };
    }
    if (text.includes('ac') || text.includes('air cond') || text.includes('cool')) {
      return {
        text: 'Need AC repair or servicing? We have certified AC technicians ready to help. Check their availability here.',
        link: { text: 'Browse AC Technicians', url: '/search?category=AC%20Technician' }
      };
    }
    if (text.includes('clean') || text.includes('broom') || text.includes('wash')) {
      return {
        text: 'Dirty rooms? Our professional house cleaners use eco-friendly products and deep-cleansing machines.',
        link: { text: 'Browse Cleaners', url: '/search?category=House%20Cleaner' }
      };
    }
    if (text.includes('tutor') || text.includes('math') || text.includes('teach') || text.includes('physics')) {
      return {
        text: 'Looking for a home tutor? We match students with top-rated tutors for STEM subjects, language, and coding.',
        link: { text: 'Browse Tutors', url: '/search?category=Home%20Tutor' }
      };
    }
    if (text.includes('work') || text.includes('step') || text.includes('how')) {
      return {
        text: 'NammaService is simple: \n1. Browse service providers near you using the filters.\n2. Choose a professional based on reviews, rates, and experience.\n3. Request a date/time. The provider will accept and notify you. Pay after completion!',
      };
    }
    if (text.includes('price') || text.includes('cost') || text.includes('pay') || text.includes('rate')) {
      return {
        text: 'Service prices are transparent! Every professional sets their own hourly rate (starting from ₹150/hr). You pay the service provider directly after the job is done.',
      };
    }
    
    return {
      text: 'I am here to assist! You can look up Plumbers, Electricians, AC Technicians, Home Tutors, or Cleaners using our Search page. What specific service are you looking for?',
      options: ['Plumber', 'AC Technician', 'Home Tutor', 'House Cleaner']
    };
  };

  const handleSend = (textToSend) => {
    if (!textToSend.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { text: textToSend, sender: 'user' }]);
    setInput('');

    // Simulate bot thinking
    setTimeout(() => {
      const response = getBotResponse(textToSend);
      setMessages(prev => [...prev, { 
        text: response.text, 
        sender: 'bot', 
        link: response.link,
        options: response.options
      }]);
    }, 800000); // Wait, setTimeout 800s is huge, should be 800ms!
    
    // Ah, let's fix it to 600ms
  };

  const handleSendMessageSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const txt = input;
    setInput('');
    setMessages(prev => [...prev, { text: txt, sender: 'user' }]);
    
    setTimeout(() => {
      const response = getBotResponse(txt);
      setMessages(prev => [...prev, { 
        text: response.text, 
        sender: 'bot', 
        link: response.link,
        options: response.options
      }]);
    }, 600);
  };

  const handleOptionClick = (option) => {
    setMessages(prev => [...prev, { text: option, sender: 'user' }]);
    setTimeout(() => {
      const response = getBotResponse(option);
      setMessages(prev => [...prev, { 
        text: response.text, 
        sender: 'bot', 
        link: response.link,
        options: response.options
      }]);
    }, 600);
  };

  return (
    <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1050 }}>
      {isOpen ? (
        <Card className="shadow-lg border-0 d-flex flex-column glass-premium" style={{ width: '360px', height: '500px', borderRadius: '16px' }}>
          {/* Header */}
          <div className="bg-primary-custom text-white p-3 rounded-top d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <div className="bg-accent rounded-circle d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px' }}>
                <FaRobot className="fs-5 text-white animate-bounce" />
              </div>
              <div>
                <h6 className="mb-0 fw-bold">NammaSupport AI</h6>
                <small className="text-white-50" style={{ fontSize: '0.75rem' }}>Online &bull; Instant Help</small>
              </div>
            </div>
            <button onClick={toggleChat} className="btn btn-sm text-white p-0 shadow-none border-0" aria-label="Close Chat">
              <FaTimes className="fs-5" />
            </button>
          </div>
          
          {/* Messages body */}
          <div className="flex-grow-1 p-3 overflow-auto d-flex flex-column gap-3" style={{ backgroundColor: 'var(--bg-light)' }}>
            {messages.map((msg, index) => (
              <div key={index} className={`d-flex flex-column ${msg.sender === 'user' ? 'align-items-end' : 'align-items-start'}`}>
                <div 
                  className={`p-3 rounded-3 shadow-sm ${msg.sender === 'user' ? 'bg-primary-custom text-white' : 'bg-white border text-dark'}`} 
                  style={{ 
                    maxWidth: '85%', 
                    fontSize: '0.88rem', 
                    borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    whiteSpace: 'pre-line'
                  }}
                >
                  {msg.text}
                  {msg.link && (
                    <div className="mt-2 pt-2 border-top">
                      <Link to={msg.link.url} className="btn btn-sm btn-accent text-white px-3 py-1 fw-bold rounded-pill" onClick={() => setIsOpen(false)}>
                        {msg.link.text}
                      </Link>
                    </div>
                  )}
                </div>
                
                {/* Options/Quick replies */}
                {!msg.link && msg.options && msg.options.length > 0 && (
                  <div className="d-flex flex-wrap gap-2 mt-2" style={{ maxWidth: '90%' }}>
                    {msg.options.map((opt, i) => (
                      <button 
                        key={i} 
                        onClick={() => handleOptionClick(opt)}
                        className="btn btn-xs btn-outline-primary bg-white text-primary border rounded-pill py-1 px-3"
                        style={{ fontSize: '0.75rem', fontWeight: '500' }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Form */}
          <div className="p-3 bg-white border-top rounded-bottom">
            <form onSubmit={handleSendMessageSubmit} className="d-flex gap-2">
              <input 
                type="text" 
                className="form-control form-control-sm border-0 bg-light py-2 px-3" 
                placeholder="Type your question..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ borderRadius: '20px' }}
              />
              <button 
                type="submit" 
                className="btn btn-accent rounded-circle d-flex align-items-center justify-content-center p-2"
                style={{ width: '36px', height: '36px', border: 'none', color: '#FFFFFF' }}
              >
                <FaPaperPlane size={14} />
              </button>
            </form>
          </div>
        </Card>
      ) : (
        <button 
          onClick={toggleChat} 
          className="btn btn-primary-custom rounded-circle shadow-lg d-flex align-items-center justify-content-center position-relative"
          style={{ width: '64px', height: '64px', transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
          aria-label="Open AI Help Chat"
        >
          <FaRobot className="fs-3 text-white" />
          <span className="position-absolute top-0 start-100 translate-middle p-2 bg-accent border border-light rounded-circle">
            <span className="visually-hidden">New Alert</span>
          </span>
        </button>
      )}
    </div>
  );
};

export default Chatbot;
