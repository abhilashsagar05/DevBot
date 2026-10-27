import React, { useState } from 'react';
import { Bot, User, Copy, Check, AlertCircle } from 'lucide-react';

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  const isError = message.isError;
  const [copiedOverall, setCopiedOverall] = useState(false);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState(null);

  const handleCopyText = (text, isOverall = true, index = null) => {
    navigator.clipboard.writeText(text);
    if (isOverall) {
      setCopiedOverall(true);
      setTimeout(() => setCopiedOverall(false), 2000);
    } else {
      setCopiedCodeIndex(index);
      setTimeout(() => setCopiedCodeIndex(null), 2000);
    }
  };

  // Helper to parse content into text and code blocks
  const renderFormattedContent = (content) => {
    if (isUser || !content) return content;

    const parts = [];
    const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;
    let blockIndex = 0;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Preceding plain text
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`}>
            {renderInlineCode(content.substring(lastIndex, match.index))}
          </span>
        );
      }

      const lang = match[1] || 'code';
      const code = match[2];
      const currentIndex = blockIndex++;

      parts.push(
        <div key={`code-block-${currentIndex}`} className="code-block-container">
          <div className="code-block-header">
            <span>{lang}</span>
            <button
              className="code-copy-btn"
              onClick={() => handleCopyText(code, false, currentIndex)}
              title="Copy code to clipboard"
            >
              {copiedCodeIndex === currentIndex ? (
                <>
                  <Check size={12} color="#10b981" />
                  <span style={{ color: '#10b981' }}>Copied</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <pre>
            <code>{code}</code>
          </pre>
        </div>
      );

      lastIndex = match.index + match[0].length;
    }

    // Remaining text after last code block
    if (lastIndex < content.length) {
      parts.push(
        <span key={`text-${lastIndex}`}>
          {renderInlineCode(content.substring(lastIndex))}
        </span>
      );
    }

    return parts.length > 0 ? parts : renderInlineCode(content);
  };

  // Helper to parse `inline code`
  const renderInlineCode = (text) => {
    const inlineParts = [];
    const inlineRegex = /`([^`]+)`/g;
    let lastIdx = 0;
    let match;

    while ((match = inlineRegex.exec(text)) !== null) {
      if (match.index > lastIdx) {
        inlineParts.push(text.substring(lastIdx, match.index));
      }
      inlineParts.push(<code key={`inline-${match.index}`}>{match[1]}</code>);
      lastIdx = match.index + match[0].length;
    }

    if (lastIdx < text.length) {
      inlineParts.push(text.substring(lastIdx));
    }

    return inlineParts;
  };

  return (
    <div className={`message-wrapper ${isUser ? 'user' : ''}`}>
      <div className={`avatar ${isUser ? 'user' : 'bot'}`}>
        {isUser ? <User size={18} /> : <Bot size={18} />}
      </div>

      <div className="message-content-box">
        <div className={`message-bubble ${message.role} ${isError ? 'error' : ''}`}>
          {isError && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem', fontWeight: 600 }}>
              <AlertCircle size={15} />
              <span>DevBot Notice</span>
            </div>
          )}

          <div style={{ whiteSpace: 'pre-wrap' }}>
            {renderFormattedContent(message.content)}
          </div>

          {!isUser && !isError && message.content && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button
                onClick={() => handleCopyText(message.content, true)}
                className="code-copy-btn"
                title="Copy full response"
                style={{ fontSize: '0.7rem' }}
              >
                {copiedOverall ? (
                  <>
                    <Check size={12} color="#10b981" />
                    <span style={{ color: '#10b981' }}>Copied message</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy response</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <span className="message-time">
          {message.timestamp
            ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : ''}
        </span>
      </div>
    </div>
  );
}
