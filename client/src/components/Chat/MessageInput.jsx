import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, X, CornerDownLeft } from 'lucide-react';

const QUICK_PROMPTS = [
  { label: '💳 Refund Policy', text: 'How do I request a refund for my order?' },
  { label: '📦 Track Package', text: 'How can I check the delivery status of my package?' },
  { label: '🔑 Reset Password', text: 'How do I reset my password if I am locked out?' },
  { label: '🏷️ Pricing Plans', text: 'What are your available plans and pricing options?' },
  { label: '👨‍💼 Human Agent', text: 'Can I speak with a human support representative?' }
];

const MessageInput = ({ onSend, disabled, showSuggestions = true }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  // Auto-grow textarea up to 120px
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestionClick = (promptText) => {
    if (disabled) return;
    onSend(promptText);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4">
      {/* Quick Suggestion Pills */}
      {showSuggestions && (
        <div className="mb-2">
          <div className="flex items-center gap-1.5 mb-1.5 text-[11px] text-zinc-400 font-medium">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>Suggested questions (click to ask):</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {QUICK_PROMPTS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSuggestionClick(item.text)}
                disabled={disabled}
                className="whitespace-nowrap text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white px-3 py-1.5 rounded-full border border-zinc-800 hover:border-indigo-500/50 transition-all cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 active:scale-95"
              >
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Input Field */}
      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-2 bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all shadow-md"
      >
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about billing, orders, refunds, or troubleshooting..."
          disabled={disabled}
          className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-500 px-2 py-1 resize-none focus:outline-none max-h-32 disabled:opacity-50 leading-relaxed"
        />

        {text.trim() && (
          <button
            type="button"
            onClick={() => setText('')}
            className="p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors rounded"
            title="Clear text"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="submit"
          disabled={!text.trim() || disabled}
          className="p-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white rounded-lg transition-all cursor-pointer shadow-sm shrink-0"
          title="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Keyboard Shortcuts Hint */}
      <div className="flex justify-between items-center text-[10px] text-zinc-500 mt-1.5 px-1">
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-400 font-mono">Enter ↵</kbd>
          <span>to send</span>
          <span className="mx-1">•</span>
          <kbd className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-400 font-mono">Shift + Enter</kbd>
          <span>for new line</span>
        </span>
        <span className="hidden sm:inline text-zinc-500">
          User-scoped support session
        </span>
      </div>
    </div>
  );
};

export default MessageInput;
