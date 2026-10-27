import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import ChatInput from './components/ChatInput';
import { checkHealth, sendChatMessage } from './services/api';

const STORAGE_KEY = 'devbot_session_conversations_v1';

export default function App() {
  const [sessions, setSessions] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeSessionId, setActiveSessionId] = useState(() => {
    return Date.now().toString();
  });

  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [healthStatus, setHealthStatus] = useState('waking');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Poll backend health status with fast initial retries while cloud wakes up
  useEffect(() => {
    let isMounted = true;
    let timerId;

    const verifyHealth = async () => {
      const res = await checkHealth();
      if (!isMounted) return;

      if (res.isHealthy) {
        setHealthStatus('online');
        timerId = setTimeout(verifyHealth, 25000); // Poll normally when online
      } else {
        // If not healthy yet, retry every 5s to catch cloud wake-up
        setHealthStatus((prev) => (prev === 'online' ? 'offline' : 'waking'));
        timerId = setTimeout(verifyHealth, 5000);
      }
    };

    verifyHealth();

    return () => {
      isMounted = false;
      if (timerId) clearTimeout(timerId);
    };
  }, []);

  // Sync sessions with sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (e) {
      console.warn('Failed to save sessions to sessionStorage', e);
    }
  }, [sessions]);

  // Load active session messages
  useEffect(() => {
    const current = sessions.find((s) => s.id === activeSessionId);
    if (current) {
      setMessages(current.messages || []);
    } else {
      setMessages([]);
    }
  }, [activeSessionId, sessions]);

  const handleSendMessage = async (text) => {
    if (!text || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    // Prepare previous history for Gemini context (last 6 messages)
    const contextHistory = updatedMessages.slice(-6).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const reply = await sendChatMessage(text, contextHistory);

      const botMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);
      updateSession(activeSessionId, finalMessages, text);
    } catch (error) {
      const errorMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        isError: true,
        content: error.message || 'An error occurred while contacting the Gemini service.',
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      updateSession(activeSessionId, finalMessages, text);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSession = (sessId, newMessages, firstPrompt) => {
    setSessions((prev) => {
      const exists = prev.find((s) => s.id === sessId);
      if (exists) {
        return prev.map((s) =>
          s.id === sessId ? { ...s, messages: newMessages } : s
        );
      } else {
        const title = firstPrompt.length > 32 ? `${firstPrompt.substring(0, 32)}...` : firstPrompt;
        return [
          {
            id: sessId,
            title,
            messages: newMessages,
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ];
      }
    });
  };

  const handleNewChat = () => {
    const newId = Date.now().toString();
    setActiveSessionId(newId);
    setMessages([]);
    setIsSidebarOpen(false);
  };

  const handleSelectSession = (id) => {
    setActiveSessionId(id);
    setIsSidebarOpen(false);
  };

  const handleClearHistory = () => {
    setSessions([]);
    handleNewChat();
  };

  return (
    <div className="app-layout">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onClearHistory={handleClearHistory}
      />

      <main className="main-content">
        <Header
          healthStatus={healthStatus}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          onNewChat={handleNewChat}
        />

        <ChatArea
          messages={messages}
          isLoading={isLoading}
          onSelectPrompt={(prompt) => handleSendMessage(prompt)}
        />

        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}

