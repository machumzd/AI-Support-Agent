import React, { useRef, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import MessageInput from './MessageInput';
import { MessageSquare, AlertCircle, CreditCard, Package, KeyRound, Coins } from 'lucide-react';

const SUGGESTED_CARDS = [
  {
    icon: CreditCard,
    title: 'Refund Policy',
    desc: 'How do I request a refund for my order?'
  },
  {
    icon: Package,
    title: 'Track Package',
    desc: 'How can I check the delivery status of my package?'
  },
  {
    icon: KeyRound,
    title: 'Reset Password',
    desc: 'How do I reset my password if I am locked out?'
  },
  {
    icon: Coins,
    title: 'Pricing Plans',
    desc: 'What are your available plans and pricing options?'
  }
];

const ChatArea = ({ onToggleSidebar, highlightedId }) => {
  const { messages, sendMessage, isTyping, error } = useChat();
  const messagesEndRef = useRef(null);

  // Auto-scroll on new incoming message only if user didn't explicitly select a past message
  useEffect(() => {
    if (!highlightedId) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, highlightedId]);

  const isEmpty = messages.length === 0;

  return (
    <main className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] bg-zinc-950 relative overflow-hidden">
      {/* Messages Viewport */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {isEmpty ? (
          <div className="h-full flex flex-col items-center justify-center max-w-xl mx-auto px-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-500 flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-100">
              How can we help you today?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-md">
              Ask anything about your account, refunds, orders, or service. Or click a quick topic below to test.
            </p>

            {/* Quick test questions with clean vector icons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full mt-6 text-left">
              {SUGGESTED_CARDS.map((card, idx) => {
                const IconComp = card.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => sendMessage(card.desc)}
                    className="p-3.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 transition-colors text-left cursor-pointer group shadow-sm flex items-start gap-3"
                  >
                    <div className="w-7 h-7 rounded-md bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-0.5 group-hover:bg-blue-600/20">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-zinc-200 group-hover:text-white">{card.title}</p>
                      <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">{card.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-3">
            {messages.map((msg, idx) => {
              const msgId = msg._id || msg.id;
              return (
                <MessageBubble 
                  key={msgId || idx} 
                  message={msg}
                  isHighlighted={highlightedId === msgId}
                />
              );
            })}

            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Error alert */}
      {error && (
        <div className="max-w-3xl mx-auto px-4 mb-2 w-full">
          <div className="bg-red-950/40 border border-red-800/60 text-red-300 text-xs px-3 py-2 rounded flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p className="flex-1">{error}</p>
          </div>
        </div>
      )}

      {/* Input Form with contextual follow-up suggestions */}
      <MessageInput
        onSend={sendMessage}
        disabled={isTyping}
        messages={messages}
      />
    </main>
  );
};

export default ChatArea;
