import React from 'react';
import { Menu, Plus, Bot, Sparkles, Activity } from 'lucide-react';

export default function Header({ isHealthy, onToggleSidebar, onNewChat }) {
  return (
    <header className="app-header">
      <div className="header-left">
        <button
          className="menu-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
            padding: '6px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Bot size={18} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1rem', fontWeight: '700', lineHeight: 1.2 }}>
              DevBot AI
            </h1>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Gemini-Powered DevOps Assistant
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div className="status-indicator" title={isHealthy ? 'Backend API connected' : 'Backend API disconnected'}>
          <span className={`status-dot ${isHealthy ? '' : 'offline'}`} />
          <span style={{ color: isHealthy ? '#a7f3d0' : '#fca5a5' }}>
            {isHealthy ? 'API Online' : 'API Offline'}
          </span>
        </div>

        <button
          onClick={onNewChat}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            padding: '0.45rem 0.75rem',
            borderRadius: '0.375rem',
            fontSize: '0.8rem',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            transition: 'background 0.15s ease'
          }}
          title="Start fresh conversation"
        >
          <Plus size={14} />
          <span>New Chat</span>
        </button>
      </div>
    </header>
  );
}

