"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface ChatItem {
  id: number;
  title: string;
  price: number;
  price_type?: string;
  location: string;
  category: string;
  image: string | null;
  url: string;
}

interface Message {
  id: number;
  sender: 'user' | 'bot';
  text: string;
  items?: ChatItem[];
  suggestions?: string[];
}

const INITIAL_MESSAGE: Message = {
  id: 1,
  sender: 'bot',
  text: "Hello! 👋 I'm **HitAds AI Assistant**.\n\nI can help you search live listings across Canada, guide you on posting free ads, explain pricing plans, or answer any questions about HitAds.ca!",
  suggestions: ["🚗 Find Cars", "🏠 Real Estate", "➕ How to Post an Ad", "💎 Pricing Plans", "🛡️ Safety Tips"]
};

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load chat from sessionStorage if available
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('hitads_chat_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch {
      // ignore parse error
    }
  }, []);

  // Save chat to sessionStorage
  useEffect(() => {
    if (messages.length > 1) {
      try {
        sessionStorage.setItem('hitads_chat_history', JSON.stringify(messages));
      } catch {
        // ignore
      }
    }
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = async (customMessage?: string) => {
    const textToSend = (customMessage || inputVal).trim();
    if (!textToSend) return;

    if (!customMessage) {
      setInputVal('');
    }

    const newUserMsg: Message = { id: Date.now(), sender: 'user', text: textToSend };
    setMessages(prev => [...prev, newUserMsg]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend })
      });
      const data = await response.json();

      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now(),
            sender: 'bot',
            text: data.text || "I'm here to help! What would you like to search or do?",
            items: data.items,
            suggestions: data.suggestions
          }
        ]);
        setIsTyping(false);
      }, 400);
    } catch (error) {
      console.error('Chat error:', error);
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          sender: 'bot',
          text: "Sorry, I had trouble connecting. You can search directly using the top search bar or browse categories!",
          suggestions: ["🚗 Find Cars", "🏠 Real Estate", "➕ Post an Ad"]
        }
      ]);
    }
  };

  const handleClearChat = () => {
    setMessages([INITIAL_MESSAGE]);
    sessionStorage.removeItem('hitads_chat_history');
  };

  // Helper to render markdown links and bold text
  const renderFormattedText = (text: string) => {
    if (!text) return null;

    // Split by markdown link pattern [label](url)
    const parts = [];
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const label = match[1];
      const url = match[2];
      parts.push(
        <Link
          key={match.index}
          href={url}
          onClick={() => {
            if (window.innerWidth < 768) setIsOpen(false);
          }}
          className="text-blue-600 hover:text-blue-700 underline font-bold transition-colors inline-flex items-center gap-0.5"
        >
          {label}
        </Link>
      );
      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return (
      <div className="space-y-1">
        {parts.map((part, i) => {
          if (typeof part === 'string') {
            // Format bold text **word**
            const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
            return (
              <span key={i}>
                {boldParts.map((bp, j) => {
                  if (bp.startsWith('**') && bp.endsWith('**')) {
                    return <strong key={j} className="font-bold text-slate-900">{bp.slice(2, -2)}</strong>;
                  }
                  return bp;
                })}
              </span>
            );
          }
          return part;
        })}
      </div>
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200]">
      {/* Chat Window */}
      {isOpen && (
        <div 
          className="absolute bottom-20 right-0 w-[92vw] sm:w-[400px] max-w-[420px] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-fade-in-up origin-bottom-right transition-all" 
          style={{ height: '560px', maxHeight: '80vh' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1774F5] via-[#1056c7] to-[#3b2885] p-4 text-white flex items-center justify-between shadow-md relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
            
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center border border-white/30 shadow-inner">
                <span className="material-icons text-white text-xl">smart_toy</span>
              </div>
              <div>
                <h3 className="font-black text-sm leading-tight flex items-center gap-1.5">
                  HitAds AI Assistant
                  <span className="text-[9px] bg-white/20 text-white font-bold px-1.5 py-0.5 rounded-full">Canada</span>
                </h3>
                <span className="text-[10px] text-blue-100 font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full inline-block animate-pulse"></span> Ready to help
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 relative z-10">
              {messages.length > 1 && (
                <button 
                  onClick={handleClearChat} 
                  title="Clear Chat History"
                  className="w-8 h-8 rounded-full hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <span className="material-icons text-sm">restart_alt</span>
                </button>
              )}
              <button 
                onClick={() => setIsOpen(false)} 
                title="Close"
                className="w-8 h-8 rounded-full hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="material-icons text-base">close</span>
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-grow p-4 overflow-y-auto bg-slate-50 space-y-4 text-sm">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                
                {/* Bubble */}
                <div 
                  className={`max-w-[88%] rounded-2xl p-3.5 leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-[#1774F5] text-white rounded-tr-xs shadow-md shadow-blue-500/20 font-medium' 
                      : 'bg-white text-slate-700 rounded-tl-xs shadow-xs border border-slate-100 whitespace-pre-line'
                  }`}
                >
                  {msg.sender === 'bot' ? renderFormattedText(msg.text) : msg.text}
                </div>

                {/* Attached Item Cards (if search returned listings) */}
                {msg.items && msg.items.length > 0 && (
                  <div className="w-full mt-2.5 space-y-2">
                    <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1">Featured Matches</p>
                    <div className="grid grid-cols-1 gap-2">
                      {msg.items.map((item) => (
                        <Link
                          key={item.id}
                          href={item.url}
                          onClick={() => {
                            if (window.innerWidth < 768) setIsOpen(false);
                          }}
                          className="flex items-center gap-3 p-2.5 bg-white hover:bg-blue-50/50 rounded-xl border border-slate-200 hover:border-blue-300 shadow-xs hover:shadow-md transition-all group cursor-pointer"
                        >
                          <div className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                            {item.image ? (
                              <img 
                                src={item.image} 
                                alt={item.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                              />
                            ) : (
                              <span className="material-icons text-slate-300 text-xl">image</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-black text-slate-900 truncate group-hover:text-[#1774F5] transition-colors">
                              {item.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs font-black text-[#16a34a]">
                                ${item.price > 0 ? item.price.toLocaleString() : 'Contact'}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium truncate">
                                • {item.location}
                              </span>
                            </div>
                          </div>
                          <span className="material-icons text-slate-400 group-hover:text-[#1774F5] text-sm shrink-0">
                            arrow_forward
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Interactive Suggestion Chips */}
                {msg.suggestions && msg.suggestions.length > 0 && msg.sender === 'bot' && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[95%]">
                    {msg.suggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(sug.replace(/^[^\w\s]+\s*/, ''))}
                        className="text-[11px] font-bold text-slate-600 bg-white hover:bg-[#1774F5] hover:text-white px-3 py-1.5 rounded-full border border-slate-200 hover:border-[#1774F5] shadow-2xs transition-all duration-150 active:scale-95 cursor-pointer flex items-center gap-1"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}

              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                <div className="bg-white rounded-2xl rounded-tl-xs p-3.5 shadow-xs border border-slate-100 flex gap-1.5 items-center">
                  <div className="w-2 h-2 bg-[#1774F5] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#1774F5] rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                  <div className="w-2 h-2 bg-[#1774F5] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
                <span>Searching HitAds...</span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-slate-100 relative z-10">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative flex items-center">
              <input 
                ref={inputRef}
                type="text" 
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                placeholder="Ask about listings, pricing, posting..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#1774F5] focus:border-[#1774F5] focus:bg-white transition-all outline-none"
              />
              <button 
                type="submit" 
                disabled={!inputVal.trim() || isTyping}
                className="absolute right-2 w-8 h-8 bg-[#1774F5] hover:bg-[#1056c7] text-white rounded-lg flex items-center justify-center transition-all disabled:opacity-40 disabled:hover:bg-[#1774F5] cursor-pointer shadow-xs active:scale-95"
                title="Send Message"
              >
                <span className="material-icons text-sm">send</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Launcher Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-gradient-to-tr from-[#1774F5] via-[#1565C0] to-[#3b2885] hover:opacity-95 text-white rounded-full shadow-2xl shadow-blue-500/40 flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 group relative cursor-pointer"
          title="Open HitAds AI Assistant"
        >
          <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
          <span className="material-icons text-3xl">support_agent</span>
          
          {/* Notification Glow Dot */}
          <div className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
          </div>
        </button>
      )}
    </div>
  );
};

export default ChatBot;
