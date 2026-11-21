import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, Bot, ThumbsUp, ThumbsDown } from 'lucide-react';

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
  const [feedback, setFeedback] = useState(null); // 'like' | 'dislike' | null
  const msgKey = message._id || message.id;

  const copyText = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      id={msgKey ? `message-${msgKey}` : undefined}
      className={`flex w-full my-3 transition-all duration-300 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex gap-2.5 max-w-[90%] sm:max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Assistant Avatar */}
        {!isUser && (
          <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
            <Bot className="w-4 h-4" />
          </div>
        )}

        <div
          className={`relative rounded-xl px-4 py-3 text-sm shadow-sm transition-all duration-300 ${
            isHighlighted ? 'ring-2 ring-blue-400 scale-[1.01]' : ''
          } ${
            isUser
              ? 'bg-blue-600 text-white rounded-tr-xs'
              : 'bg-zinc-900 text-zinc-100 border border-zinc-800 rounded-tl-xs'
          }`}
        >
          {!isUser && (
            <div className="flex items-center justify-between gap-3 mb-1.5 pb-1 border-b border-zinc-800 text-[11px] text-zinc-400">
              <span className="font-semibold text-blue-400">Support Assistant</span>
              <button
                onClick={copyText}
                className="p-1 hover:text-zinc-200 rounded transition-colors flex items-center gap-1"
                title="Copy response"
              >
                {copied ? (
                  <span className="text-emerald-400 text-[10px] flex items-center gap-0.5">
                    <Check className="w-3 h-3" /> Copied
                  </span>
                ) : (
                  <span className="text-zinc-400 hover:text-zinc-200 text-[10px] flex items-center gap-1">
                    <Copy className="w-3 h-3" /> Copy
                  </span>
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

          <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-zinc-800/40 text-[10px] text-zinc-500">
            {!isUser ? (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setFeedback(feedback === 'like' ? null : 'like')}
                  className={`p-1 rounded hover:bg-zinc-800 transition-colors ${
                    feedback === 'like' ? 'text-emerald-400 font-medium' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                  title="Helpful"
                >
                  <ThumbsUp className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => setFeedback(feedback === 'dislike' ? null : 'dislike')}
                  className={`p-1 rounded hover:bg-zinc-800 transition-colors ${
                    feedback === 'dislike' ? 'text-rose-400 font-medium' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                  title="Not helpful"
                >
                  <ThumbsDown className="w-3 h-3" />
                </button>
                {feedback && (
                  <span className="text-[10px] text-zinc-400 ml-1">Feedback saved</span>
                )}
              </div>
            ) : <span />}

            <span className={isUser ? 'text-blue-100' : 'text-zinc-500'}>
              {formatTimestamp(message.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
