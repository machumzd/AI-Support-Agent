import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

const SUGGESTIONS = [
  'What is your return policy?',
  'How do I reset my password?',
  'What payment methods do you accept?',
  'How do I track my order?'
];

const MessageInput = ({ onSend, disabled, showSuggestions = false }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

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

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4">
      {showSuggestions && (
        <div className="flex gap-2 overflow-x-auto pb-2 mb-2 scrollbar-none">
          {SUGGESTIONS.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSend(item)}
              disabled={disabled}
              className="whitespace-nowrap text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-full border border-zinc-700/60 transition-colors"
            >
              {item}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-2 bg-zinc-900 border border-zinc-800 rounded-xl p-2 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-colors"
      >
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about billing, orders, refunds..."
          disabled={disabled}
          className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-500 px-2 py-1.5 resize-none focus:outline-none max-h-32 disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={!text.trim() || disabled}
          className="p-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-40 text-white rounded-lg transition-colors cursor-pointer"
          title="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
      <p className="text-[11px] text-zinc-400 mt-1 px-1 text-right">
        Press <span className="font-mono text-zinc-400">Enter</span> to send, <span className="font-mono text-zinc-400">Shift+Enter</span> for new line
      </p>
    </div>
  );
};

export default MessageInput;
