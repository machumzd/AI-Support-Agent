import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check } from 'lucide-react';

const formatTimestamp = (dateString) => {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
};

const MessageBubble = ({ message, isHighlighted = false }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const msgKey = message._id || message.id;

  const copyText = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      id={msgKey ? `message-${msgKey}` : undefined}
      className={`flex w-full my-2.5 transition-all duration-300 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`relative max-w-[85%] sm:max-w-[75%] rounded-lg px-4 py-3 text-sm shadow-sm transition-all duration-300 ${
          isHighlighted ? 'ring-2 ring-blue-400 scale-[1.01]' : ''
        } ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-zinc-900 text-zinc-100 border border-zinc-800 rounded-bl-none'
        }`}
      >
        {!isUser && (
          <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-zinc-800 text-[11px] text-zinc-400">
            <span className="font-medium text-blue-400">AI Assistant</span>
            <button
              onClick={copyText}
              className="p-1 hover:text-zinc-200 rounded transition-colors"
              title="Copy response"
            >
              {copied ? (
                <span className="text-emerald-400 text-[10px] flex items-center gap-0.5">
                  <Check className="w-3 h-3" /> Copied
                </span>
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
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
          className={`text-[10px] mt-1.5 text-right ${
            isUser ? 'text-blue-100' : 'text-zinc-500'
          }`}
        >
          {formatTimestamp(message.createdAt)}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
