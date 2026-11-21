import React, { useRef, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import MessageInput from './MessageInput';
import { 
  MessageSquare, 
  Menu, 
  CreditCard, 
  Package, 
  KeyRound, 
  Coins, 
  Sparkles, 
  ArrowRight,
  Headphones
} from 'lucide-react';

const TOPIC_SUGGESTIONS = [
  {
    icon: CreditCard,
    title: 'Refund & Returns',
    desc: 'Learn about our 30-day money-back guarantee and how to request a refund.',
    prompt: 'How do I request a refund for my order?'
  },
  {
    icon: Package,
    title: 'Track an Order',
    desc: 'Check shipping timelines and how to track your package delivery.',
    prompt: 'How can I check the delivery status of my package?'
  },
  {
    icon: KeyRound,
    title: 'Password & Account',
    desc: 'Reset your password or resolve account login issues.',
    prompt: 'How do I reset my password if I am locked out?'
  },
  {
    icon: Coins,
    title: 'Plans & Pricing',
    desc: 'Explore available subscription tiers, features, and billing cycles.',
    prompt: 'What are your available plans and pricing options?'
  }
];

const ChatArea = ({ onToggleSidebar }) => {
  const { messages, sendMessage, isTyping, error } = useChat();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const isEmpty = messages.length === 0;

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] bg-zinc-950 relative">
      {/* Mobile top bar to toggle sidebar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/60 text-xs">
        <button
          onClick={onToggleSidebar}
          className="flex items-center gap-1.5 text-zinc-300 hover:text-white"
        >
          <Menu className="w-4 h-4" />
          <span>Past Questions</span>
        </button>
        <span className="text-[11px] text-emerald-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Agent Online
        </span>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {isEmpty ? (
          <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto px-4 py-6">
            {/* Header Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-800/60 text-indigo-400 text-xs font-medium mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Customer Support AI Assistant</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 text-center tracking-tight">
              What can we help you with today?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 text-center max-w-md">
              Choose a common topic below or type your question in the box.
            </p>

            {/* Interactive Topic Suggestion Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mt-6 text-left">
              {TOPIC_SUGGESTIONS.map((topic, idx) => {
                const IconComponent = topic.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => sendMessage(topic.prompt)}
                    className="p-3.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-850 border border-zinc-800 hover:border-indigo-500/60 transition-all text-left group cursor-pointer shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-medium text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                          Click to ask <ArrowRight className="w-3 h-3 ml-0.5" />
                        </span>
                      </div>
                      <h3 className="text-xs font-semibold text-zinc-200 group-hover:text-white">
                        {topic.title}
                      </h3>
                      <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                        {topic.desc}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-zinc-800/60 text-[10px] text-zinc-500 font-mono truncate">
                      "{topic.prompt}"
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-2">
            {messages.map((msg, idx) => (
              <MessageBubble key={msg._id || msg.id || idx} message={msg} />
            ))}

            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Error alert */}
      {error && (
        <div className="max-w-3xl mx-auto px-4 mb-2 w-full">
          <div className="bg-red-950/40 border border-red-800/60 text-red-300 text-xs px-3 py-2 rounded">
            {error}
          </div>
        </div>
      )}

      {/* Message input with interactive suggestions */}
      <MessageInput
        onSend={sendMessage}
        disabled={isTyping}
        showSuggestions={true}
      />
    </div>
  );
};

export default ChatArea;
