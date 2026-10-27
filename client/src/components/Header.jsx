import React from 'react';
import { Menu, Plus, Bot, Sparkles, Activity } from 'lucide-react';

export default function Header({ healthStatus, onToggleSidebar, onNewChat }) {
  const isOnline = healthStatus === 'online';
  const isWaking = healthStatus === 'waking';

  const dotClass = isOnline ? '' : (isWaking ? 'waking' : 'offline');
  const labelText = isOnline ? 'API Online' : (isWaking ? 'Server Waking Up (~30s)...' : 'API Offline');
  const labelColor = isOnline ? '#a7f3d0' : (isWaking ? '#fde68a' : '#fca5a5');

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
        <div className="status-indicator" title={labelText}>
          <span className={`status-dot ${dotClass}`} />
          <span style={{ color: labelColor }}>
            {labelText}
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

