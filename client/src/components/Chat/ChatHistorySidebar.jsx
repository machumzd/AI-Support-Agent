import React, { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { MessageSquare, Search, X } from 'lucide-react';

const ChatHistorySidebar = ({ isOpen, onClose }) => {
  const { messages, isLoadingHistory } = useChat();
  const [search, setSearch] = useState('');

  // Extract user queries as history items
  const userMessages = messages
    .filter((m) => m.role === 'user')
    .slice()
    .reverse();

  const filtered = userMessages.filter((m) =>
    m.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-14 bottom-0 left-0 z-40 w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-3 border-b border-zinc-800 flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-300">Past Questions</span>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white lg:hidden">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-2 border-b border-zinc-800">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search history..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 pl-8 py-1 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {isLoadingHistory ? (
            <p className="text-center text-xs text-zinc-500 py-6">Loading history...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-xs text-zinc-500 py-8">No previous questions</p>
          ) : (
            filtered.map((item, idx) => (
              <div
                key={item._id || item.id || idx}
                className="p-2 rounded hover:bg-zinc-800/80 transition-colors text-xs text-zinc-300 group cursor-default"
              >
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-zinc-200">{item.content}</p>
                    <span className="text-[10px] text-zinc-500">
                      {new Date(item.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-3 border-t border-zinc-800 text-[11px] text-zinc-500 flex justify-between">
          <span>Total messages:</span>
          <span className="text-zinc-300 font-mono">{messages.length}</span>
        </div>
      </aside>
    </>
  );
};

export default ChatHistorySidebar;
