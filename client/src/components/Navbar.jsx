import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { MessageSquare, LogOut, Trash2 } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { clearHistory, messages } = useChat();

  return (
    <header className="h-14 border-b border-zinc-800 bg-zinc-900/90 backdrop-blur px-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
          <MessageSquare className="w-4 h-4" />
        </div>
        <div>
          <span className="font-semibold text-sm text-zinc-100">Support Desk AI</span>
          <span className="hidden sm:inline-block ml-2 text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.2 rounded">
            Online
          </span>
        </div>
      </div>

      {user && (
        <div className="flex items-center gap-3">
          {messages.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Clear conversation history?')) {
                  clearHistory();
                }
              }}
              className="text-xs text-zinc-400 hover:text-red-400 px-2 py-1 rounded transition-colors flex items-center gap-1"
              title="Clear chat"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear Chat</span>
            </button>
          )}

          <div className="h-4 w-[1px] bg-zinc-800 hidden sm:block" />

          <div className="text-right hidden sm:block">
            <p className="text-xs font-medium text-zinc-200">{user.name}</p>
            <p className="text-[11px] text-zinc-400">{user.email}</p>
          </div>

          <button
            onClick={logout}
            className="text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-2.5 py-1.5 rounded-md transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
