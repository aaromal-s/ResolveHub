import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiX, FiSend, FiMinimize2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi there! I am the ResolveHub Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Handle suggested queries based on role and current page
  const getSuggestedQueries = () => {
    const path = location.pathname;
    
    // Not logged in or on auth pages
    if (!user || path === '/login' || path === '/register') {
      return ["I forgot my password", "How do I register as a citizen?", "Where do officers login?"];
    }
    
    if (user.role === 'admin') {
      if (path.includes('/dashboard')) {
        return ["How do I use the SLA metrics summary?", "What is the department breakdown?", "How do I export reports?"];
      } else if (path.includes('/complaint')) {
        return ["How do I reassign a complaint?", "Can you translate the citizen's feedback?", "How do I override a status?"];
      } else {
        return ["How do I broadcast a notification?", "How do I manage department heads?", "What is the analytics view?"];
      }
    } else if (user.role === 'officer') {
      if (path.includes('/dashboard')) {
        return ["How do I view my pending tickets?", "What does 'Active Pending' mean?", "How do I filter the unassigned pool?"];
      } else if (path.includes('/complaint')) {
        return ["How do I update a ticket status to resolved?", "How do I request more info?", "Translate this grievance"];
      } else {
        return ["Where can I view my resolution stats?", "What are SLA deadlines?", "How do I update my profile?"];
      }
    } else {
      // Citizen role
      if (path === '/' || path === '/dashboard') {
        return ["How do I check the status of my complaint?", "What is the typical resolution time?", "Can I edit a complaint after submitting?"];
      } else if (path.includes('/my-complaints') || path.includes('/complaint')) {
        return ["What does 'In Progress' mean?", "How do I add more evidence?", "Who is working on my complaint?"];
      } else if (path === '/new-complaint') {
        return ["What category is a water leak?", "Do I need to attach a photo?", "Will my personal details be private?"];
      } else {
        return ["How do I track my complaint status?", "How do I update my profile?", "How do I contact support?"];
      }
    }
  };
  
  const suggestedQueries = getSuggestedQueries();

  const handleSend = async (text) => {
    if (!text.trim()) return;

    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.post('/chat', {
        message: text,
        history: messages.filter(m => m.role !== 'system') // Send recent context
      });

      if (response.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: response.reply }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I am currently unavailable. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, y: [0, -10, 0] }}
            transition={{ y: { repeat: Infinity, duration: 2.5, ease: "easeInOut" } }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1, y: 0 }}
            whileTap={{ scale: 0.9 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-tr from-brand-600 to-tealbrand-500 rounded-full shadow-[0_0_20px_rgba(14,165,233,0.5)] flex items-center justify-center text-white z-50 border-2 border-white/20 hover:shadow-[0_0_30px_rgba(14,165,233,0.8)] transition-shadow"
          >
            <FiMessageSquare className="text-3xl" />
            
            {/* Tooltip on hover */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="absolute right-16 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs font-bold py-2 px-3 rounded-xl whitespace-nowrap shadow-xl border border-slate-700"
                >
                  Need help?
                  <div className="absolute top-1/2 -right-1 -translate-y-1/2 border-y-4 border-y-transparent border-l-4 border-l-slate-900"></div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-80 sm:w-96 h-[32rem] max-h-[85vh] bg-white dark:bg-slate-900 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] z-50 flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-600 to-tealbrand-600 p-4 text-white flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
              <div className="relative z-10">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <FiMessageSquare /> ResolveHub AI
                </h3>
                <p className="text-[10px] text-brand-100 uppercase tracking-widest font-semibold mt-0.5">
                  Multilingual Assistant
                </p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="relative z-10 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
              >
                <FiMinimize2 />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-slate-50/50 dark:bg-slate-950/50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                      msg.role === 'user' 
                        ? 'bg-brand-600 text-white rounded-br-none shadow-md shadow-brand-500/20' 
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-2xl rounded-bl-none flex items-center gap-1 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
              {/* Suggested Queries */}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {suggestedQueries.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(q)}
                      className="text-[10px] md:text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-900/30 dark:hover:text-brand-400 border border-slate-200 dark:border-slate-700 transition-colors text-left"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                  placeholder="Ask anything..."
                  className="w-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white text-sm rounded-xl pl-4 pr-12 py-3 outline-none focus:ring-2 focus:ring-brand-500/50 border border-transparent focus:border-brand-500 transition-all placeholder:text-slate-400"
                />
                <button
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 w-8 h-8 flex items-center justify-center rounded-lg bg-brand-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-700 transition-colors"
                >
                  <FiSend className="text-sm" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
