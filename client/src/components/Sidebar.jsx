import React from 'react';
import { Bot, Plus, MessageSquare, Trash2, X, Terminal, Cpu } from 'lucide-react';

export default function Sidebar({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onClearHistory
}) {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-title">
          <Bot size={22} />
          <span>DevBot AI</span>
        </div>
        <button
          onClick={onClose}
          className="menu-toggle"
          aria-label="Close sidebar"
          style={{ display: 'flex' }}
        >
          <X size={18} />
        </button>
      </div>

      <button className="new-chat-btn" onClick={onNewChat}>
        <Plus size={16} />
        <span>New Conversation</span>
      </button>

      <div className="history-container">
        <div className="history-label">Session Conversations</div>

        {sessions.length === 0 ? (
          <div style={{ padding: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            No recent conversations yet. Ask a question to get started!
          </div>
        ) : (
          sessions.map((sess) => (
            <div
              key={sess.id}
              className={`history-item ${sess.id === activeSessionId ? 'active' : ''}`}
              onClick={() => onSelectSession(sess.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                <MessageSquare size={14} style={{ flexShrink: 0 }} />
                <span className="history-text">{sess.title || 'Conversation'}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="sidebar-footer">
        {sessions.length > 0 && (
          <button
            onClick={onClearHistory}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
              padding: '0.45rem',
              borderRadius: '0.375rem',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              cursor: 'pointer'
            }}
          >
            <Trash2 size={13} />
            <span>Clear Session History</span>
          </button>
        )}

        <div className="badge-devops">
          <Terminal size={12} />
          <span>Docker & Jenkins CI/CD</span>
        </div>

        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Cpu size={12} />
          <span>Google Gemini API</span>
        </div>
      </div>
    </aside>
  );
}

