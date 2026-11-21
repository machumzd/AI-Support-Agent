import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import Navbar from './components/Navbar';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import ChatArea from './components/Chat/ChatArea';
import ChatHistorySidebar from './components/Chat/ChatHistorySidebar';
import { Loader2 } from 'lucide-react';

function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [highlightedId, setHighlightedId] = useState(null);

  const handleSelectMessage = (messageId) => {
    if (!messageId) return;
    const targetEl = document.getElementById(`message-${messageId}`);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedId(messageId);
      setTimeout(() => {
        setHighlightedId(null);
      }, 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        {authMode === 'login' ? (
          <Login onSwitchToSignup={() => setAuthMode('signup')} />
        ) : (
          <Signup onSwitchToLogin={() => setAuthMode('login')} />
        )}
      </main>
    );
  }

  return (
    <ChatProvider>
      <div className="min-h-screen bg-zinc-950 flex flex-col text-zinc-100">
        <Navbar 
          isSidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)} 
        />
        <div className="flex-1 flex overflow-hidden">
          <ChatHistorySidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onSelectMessage={handleSelectMessage}
          />
          <ChatArea 
            onToggleSidebar={() => setSidebarOpen((prev) => !prev)} 
            highlightedId={highlightedId}
          />
        </div>
      </div>
    </ChatProvider>
  );
}

export default App;
