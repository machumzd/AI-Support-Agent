import React from 'react';
import { Bot } from 'lucide-react';

const TypingIndicator = () => {
  return (
    <div className="flex justify-start my-2.5">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg rounded-bl-none px-3.5 py-2.5 flex items-center gap-2 text-xs text-zinc-400">
        <Bot className="w-3.5 h-3.5 text-blue-400" />
        <span className="text-[11px]">AI assistant is typing</span>
        <div className="flex items-center gap-1 ml-1">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
