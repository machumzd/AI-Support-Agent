import React, { useRef, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import MessageInput from './MessageInput';
import { MessageSquare, Menu } from 'lucide-react';

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
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {isEmpty ? (
          <div className="h-full flex flex-col items-center justify-center max-w-lg mx-auto text-center px-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-semibold text-zinc-100">
              How can we help you today?
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-sm">
              Ask about return policies, track an order, reset your password, or inquire about pricing.
            </p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-1">
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

      {/* Message input */}
      <MessageInput
        onSend={sendMessage}
        disabled={isTyping}
        showSuggestions={isEmpty}
      />
    </div>
  );
};

export default ChatArea;
