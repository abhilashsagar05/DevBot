import React, { useEffect, useRef } from 'react';
import { Bot, Sparkles, Terminal, ShieldCheck, GitBranch, Layers } from 'lucide-react';
import MessageBubble from './MessageBubble';

const SUGGESTED_PROMPTS = [
  {
    title: 'Explain CI/CD Automation',
    desc: 'How does a commit trigger automated build, test & deploy?',
    icon: GitBranch,
    prompt: 'Can you explain how a modern CI/CD pipeline automates testing, Docker image building, and cloud deployment in simple terms?'
  },
  {
    title: 'Docker Multi-Stage Builds',
    desc: 'Why do multi-stage builds create smaller and safer images?',
    icon: Layers,
    prompt: 'Explain what Docker multi-stage builds are and why they are best practice for deploying React and Node.js applications.'
  },
  {
    title: 'Jenkins Pipeline Concepts',
    desc: 'Understanding Jenkinsfile, stages, agents, and steps',
    icon: Terminal,
    prompt: 'Break down how a declarative Jenkinsfile works, explaining stages, agents, steps, and post actions.'
  },
  {
    title: 'DevOps Security Best Practices',
    desc: 'Secret management, least privilege, and container security',
    icon: ShieldCheck,
    prompt: 'What are the top security rules for managing API keys, Docker containers, and CI/CD pipelines in production?'
  }
];

export default function ChatArea({ messages, isLoading, onSelectPrompt }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (messages.length === 0) {
    return (
      <div className="chat-messages">
        <div className="welcome-container">
          <div className="welcome-icon">
            <Bot size={34} />
          </div>
          <h2 className="welcome-title">Welcome to DevBot AI</h2>
          <p className="welcome-desc">
            Your intelligent assistant for software development, cloud infrastructure, and automated DevOps workflows. Ask questions or pick a suggested topic below:
          </p>

          <div className="prompt-suggestions">
            {SUGGESTED_PROMPTS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="prompt-card"
                  onClick={() => onSelectPrompt(item.prompt)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="prompt-card-title">
                    <Icon size={16} color="var(--accent-primary)" />
                    <span>{item.title}</span>
                  </div>
                  <div className="prompt-card-desc">{item.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-messages">
      <div className="messages-container">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isLoading && (
          <div className="message-wrapper">
            <div className="avatar bot">
              <Bot size={18} />
            </div>
            <div className="message-content-box">
              <div className="message-bubble assistant">
                <div className="typing-indicator">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}

