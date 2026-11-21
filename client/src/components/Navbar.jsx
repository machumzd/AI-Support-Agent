import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { MessageSquare, LogOut, Trash2 } from 'lucide-react';

const Navbar = ({ isSidebarOpen, onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { clearHistory, messages } = useChat();

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the conversation history?')) {
      clearHistory();
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <header className="h-14 border-b border-zinc-800 bg-zinc-900/90 backdrop-blur-sm px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          title="Toggle history"
          aria-label="Toggle history"
        >
          <MessageSquare className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-zinc-100">AI Customer Support</span>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-1.5 py-0.2 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online
              </span>
            </div>
          </div>
        </div>
      </div>

      {user && (
        <div className="flex items-center gap-3">
          {messages.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-zinc-400 hover:text-red-400 px-2 py-1 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer hover:bg-zinc-800"
              title="Clear chat"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear Chat</span>
            </button>
          )}

          <div className="h-4 w-px bg-zinc-800 hidden sm:block" />

          {/* User profile with initials avatar */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-xs font-semibold text-blue-400">
              {getInitials(user.name)}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-medium text-zinc-200 leading-tight">{user.name}</p>
              <p className="text-[11px] text-zinc-400 leading-tight max-w-[130px] truncate">{user.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-2.5 py-1.5 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ml-1"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
