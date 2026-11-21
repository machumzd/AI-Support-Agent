import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Send, X, Sparkles } from 'lucide-react';

const MessageInput = ({ onSend, disabled, messages = [] }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  // Auto-grow textarea up to 120px
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  // Contextual follow-up suggestions based on the latest conversation topic
  const followUpSuggestions = useMemo(() => {
    if (!messages || messages.length === 0) return [];

    // Analyze the last message content
    const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';

    if (lastMsg.includes('refund') || lastMsg.includes('return') || lastMsg.includes('policy')) {
      return [
        'How long does the refund take to process?',
        'Can I exchange for another item instead?',
        'Where do I send the returned package?',
        'Can I speak with a human support agent?'
      ];
    }

    if (
      lastMsg.includes('track') ||
      lastMsg.includes('delivery') ||
      lastMsg.includes('ship') ||
      lastMsg.includes('package') ||
      lastMsg.includes('order')
    ) {
      return [
        'What should I do if my package is delayed?',
        'Can I change my delivery address?',
        'How do I contact the shipping carrier?',
        'Can I speak with a human support agent?'
      ];
    }

    if (
      lastMsg.includes('password') ||
      lastMsg.includes('account') ||
      lastMsg.includes('login') ||
      lastMsg.includes('lock')
    ) {
      return [
        "What if I didn't receive the reset email?",
        'How do I update my account email address?',
        'How do I enable two-factor authentication?',
        'Can I speak with a human support agent?'
      ];
    }

    if (
      lastMsg.includes('plan') ||
      lastMsg.includes('price') ||
      lastMsg.includes('pricing') ||
      lastMsg.includes('subscription')
    ) {
      return [
        'Is there an annual billing discount?',
        'Can I cancel my subscription anytime?',
        'Do you offer a free trial period?',
        'Can I speak with a human support agent?'
      ];
    }

    // Default general follow-ups
    return [
      'Can I speak with a human support agent?',
      'What are your customer support working hours?',
      'How do I download my invoice?'
    ];
  }, [messages]);

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

  const handleSuggestionClick = (suggestionText) => {
    if (disabled) return;
    onSend(suggestionText);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4">
      {/* Contextual Follow-up Suggestions */}
      {followUpSuggestions.length > 0 && !disabled && (
        <div className="mb-2">
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mb-1.5 px-0.5">
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span>Suggested next questions (click to ask):</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {followUpSuggestions.map((suggestion, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={disabled}
                className="whitespace-nowrap text-xs bg-zinc-900 hover:bg-zinc-850 active:bg-zinc-800 text-zinc-300 hover:text-white px-3 py-1.5 rounded-full border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer text-left shrink-0"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Input Form */}
      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-2 bg-zinc-900 border border-zinc-800 rounded-lg p-2 focus-within:border-blue-500 transition-colors shadow-sm"
      >
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your question here (e.g., refund status, order tracking)..."
          disabled={disabled}
          className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-500 px-2 py-1.5 resize-none focus:outline-none max-h-32 disabled:opacity-50 leading-relaxed"
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
          className="p-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-40 text-white rounded-md transition-colors cursor-pointer shrink-0"
          title="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      <div className="flex justify-between items-center text-[11px] text-zinc-500 mt-1 px-1">
        <span>Press <kbd className="px-1 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-400 font-mono text-[10px]">Enter ↵</kbd> to send, <kbd className="px-1 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-400 font-mono text-[10px]">Shift+Enter</kbd> for newline</span>
      </div>
    </div>
  );
};

export default MessageInput;
