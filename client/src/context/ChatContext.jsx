import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { chatApi } from '../api/client';
import { useAuth } from './AuthContext';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);

  const loadHistory = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoadingHistory(true);
    setError(null);
    try {
      const data = await chatApi.getHistory();
      setMessages(data.messages || []);
    } catch (err) {
      console.error('Error fetching chat history:', err);
      setError(err.response?.data?.message || 'Failed to load conversation history');
    } finally {
      setIsLoadingHistory(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      loadHistory();
    } else {
      setMessages([]);
    }
  }, [isAuthenticated, loadHistory]);

  const sendMessage = async (content) => {
    const text = content.trim();
    if (!text || isTyping) return;

    setError(null);
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      _id: tempId,
      role: 'user',
      content: text,
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setIsTyping(true);

    try {
      const res = await chatApi.send(text);
      setMessages((prev) => {
        const withoutTemp = prev.filter((m) => m._id !== tempId);
        return [...withoutTemp, res.userMessage, res.assistantMessage];
      });
    } catch (err) {
      console.error('Failed to send message:', err);
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
      setMessages((prev) => prev.filter((m) => m._id !== tempId));
    } finally {
      setIsTyping(false);
    }
  };

  const clearHistory = async () => {
    try {
      await chatApi.clearHistory();
      setMessages([]);
    } catch (err) {
      console.error('Failed to clear history:', err);
      setError('Failed to clear history');
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        isTyping,
        isLoadingHistory,
        error,
        sendMessage,
        clearHistory,
        reloadHistory: loadHistory
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
