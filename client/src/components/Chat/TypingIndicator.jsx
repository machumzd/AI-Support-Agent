import React from 'react';
import { Bot } from 'lucide-react';

const TypingIndicator = () => {
  return (
    <div className="flex justify-start my-2.5">
      <div className="bg-zinc-800 border border-zinc-700/60 rounded-lg rounded-bl-none px-4 py-2.5 flex items-center gap-2 text-xs text-zinc-400">
        <Bot className="w-3.5 h-3.5 text-indigo-400" />
        <span className="text-[11px]">Assistant is typing</span>
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
