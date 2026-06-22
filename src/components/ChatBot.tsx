"use client";

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

interface Message {
  id: number;
  sender: 'user' | 'bot';
  text: string;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'bot', text: 'Hi! I am the HitAds Assistant. I can help you find items in our database, or guide you on how to use the site. How can I help?' }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const location = { pathname, search: searchParams ? "?" + searchParams.toString() : "", state: null };

  // Highlight URL context
  useEffect(() => {
    if (isOpen) {
      const currentPath = location.pathname;
      if (currentPath.includes('/post-ad') && messages.length === 1) {
        setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: "I see you're on the Post Ad page! Let me know if you need help choosing a category or pricing your item." }]);
      }
    }
  }, [isOpen, location.pathname]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;

    const userMessage = inputVal.trim();
    setInputVal('');
    
    const newUserMsg: Message = { id: Date.now(), sender: 'user', text: userMessage };
    setMessages(prev => [...prev, newUserMsg]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      const data = await response.json();
      
      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: data.text }]);
        setIsTyping(false);
      }, 600); // slight artificial delay for natural feel
    } catch (error) {
      console.error(error);
      setIsTyping(false);
      setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: "Sorry, I'm having trouble connecting to the server right now." }]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200]">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-fade-in-up origin-bottom-right" style={{ height: '500px' }}>
          {/* Header */}
          <div className="bg-primary p-4 text-white flex items-center justify-between shadow-md relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center border border-white/30">
                <span className="material-icons text-white">smart_toy</span>
              </div>
              <div>
                <h3 className="font-black text-sm leading-tight">HitAds AI</h3>
                <span className="text-[10px] text-primary-soft font-bold uppercase tracking-widest flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block"></span> Online
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors relative z-10">
              <span className="material-icons">close</span>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-grow p-4 overflow-y-auto bg-slate-50 space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${msg.sender === 'user' ? 'bg-primary text-white rounded-tr-sm shadow-md shadow-primary/20' : 'bg-white text-slate-700 rounded-tl-sm shadow-sm border border-slate-100 whitespace-pre-line'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm border border-slate-100 flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Header */}
          <div className="p-3 bg-white border-t border-slate-100 relative z-10">
            <form onSubmit={handleSend} className="relative flex items-center">
              <input 
                type="text" 
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                placeholder="Ask me anything..." 
                className="w-full bg-slate-50 border-none rounded-xl pl-4 pr-12 py-3 text-sm focus:ring-primary focus:bg-white transition-colors"
              />
              <button 
                type="submit" 
                disabled={!inputVal.trim() || isTyping}
                className="absolute right-2 w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-primary-hover disabled:opacity-50 disabled:bg-slate-300 transition-colors"
              >
                <span className="material-icons text-sm">send</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-primary hover:bg-primary-hover text-white rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 group relative"
        >
          <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
          <span className="material-icons text-3xl animate-pulse">support_agent</span>
          
          {/* Notification Dot */}
          <div className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
          </div>
        </button>
      )}
    </div>
  );
};

export default ChatBot;
