import React, { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { MessageSquare, Search, X, Plus } from 'lucide-react';

const ChatHistorySidebar = ({ isOpen, onClose, onSelectMessage }) => {
  const { messages, isLoadingHistory, clearHistory } = useChat();
  const [search, setSearch] = useState('');

  // Extract past user queries from the loaded conversation history
  const userMessages = messages
    .filter((m) => m.role === 'user')
    .slice()
    .reverse();

  const filtered = userMessages.filter((m) =>
    m.content.toLowerCase().includes(search.toLowerCase())
  );

  const handleItemClick = (messageId) => {
    if (onSelectMessage && messageId) {
      onSelectMessage(messageId);
    }
    if (window.innerWidth < 1024 && onClose) {
      onClose();
    }
  };

  const handleNewChat = () => {
    if (messages.length > 0) {
      if (window.confirm('Start a new chat? This will clear active messages.')) {
        clearHistory();
      }
    }
    if (window.innerWidth < 1024 && onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-14 bottom-0 left-0 z-40 w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header & New Chat Button */}
        <div className="p-3 border-b border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-200">Past Conversations</span>
            <button 
              type="button"
              onClick={onClose} 
              className="p-1 text-zinc-400 hover:text-white lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-medium transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Search */}
        <div className="p-2 border-b border-zinc-800">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search history..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 pl-8 pr-6 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                aria-label="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* List of past questions */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {isLoadingHistory ? (
            <p className="text-center text-xs text-zinc-500 py-6">Loading history...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-xs text-zinc-500 py-6">
              {search ? 'No matching questions' : 'No previous questions'}
            </p>
          ) : (
            filtered.map((item, idx) => {
              const msgId = item._id || item.id;
              return (
                <button
                  key={msgId || idx}
                  type="button"
                  onClick={() => handleItemClick(msgId)}
                  className="w-full text-left p-2 rounded hover:bg-zinc-800 transition-colors text-xs text-zinc-300 group cursor-pointer focus:outline-none focus:bg-zinc-800"
                  title="Click to scroll to this message in chat"
                >
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0 group-hover:text-blue-300" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-zinc-200 group-hover:text-white">{item.content}</p>
                      <span className="text-[10px] text-zinc-500">
                        {new Date(item.createdAt || Date.now()).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Total message count */}
        <div className="p-3 border-t border-zinc-800 text-[11px] text-zinc-400 flex justify-between">
          <span>Saved messages:</span>
          <span className="text-zinc-200 font-medium">{messages.length}</span>
        </div>
      </aside>
    </>
  );
};

export default ChatHistorySidebar;
