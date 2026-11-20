import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, Bot } from 'lucide-react';

const formatTimestamp = (dateString) => {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
};

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const copyText = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex w-full my-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`relative max-w-[85%] sm:max-w-[75%] rounded-lg px-4 py-3 text-sm shadow-sm ${
          isUser
            ? 'bg-indigo-600 text-white rounded-br-none'
            : 'bg-zinc-800 text-zinc-100 border border-zinc-700/60 rounded-bl-none'
        }`}
      >
        {!isUser && (
          <div className="flex items-center gap-1.5 mb-1.5 text-[11px] font-medium text-indigo-400">
            <Bot className="w-3.5 h-3.5" />
            <span>Support Assistant</span>
          </div>
        )}

        <div className="leading-relaxed prose-chat">
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <ReactMarkdown>{message.content}</ReactMarkdown>
          )}
        </div>

        <div
          className={`flex items-center justify-between gap-3 mt-1.5 text-[10px] ${
            isUser ? 'text-indigo-200' : 'text-zinc-400'
          }`}
        >
          <span>{formatTimestamp(message.createdAt)}</span>

          {!isUser && (
            <button
              onClick={copyText}
              className="p-1 hover:text-zinc-200 rounded transition-colors"
              title="Copy response"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
