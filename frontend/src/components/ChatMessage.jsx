import React, { useState } from 'react';
import { Bot, User, Copy, Check, FileText, ChevronDown, ChevronUp, Sparkles, Layers } from 'lucide-react';
import EvaluationCard from './EvaluationCard';

export default function ChatMessage({ message, onToggleSources }) {
  const [copied, setCopied] = useState(false);
  const [showEvaluation, setShowEvaluation] = useState(true);

  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        display: 'flex',
        gap: '1rem',
        padding: '1.25rem 1.5rem',
        backgroundColor: isUser ? 'rgba(255, 255, 255, 0.015)' : 'rgba(17, 24, 39, 0.5)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
      }}
    >
      {/* Avatar Icon */}
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: isUser
            ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
            : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: isUser ? '0 0 10px rgba(59, 130, 246, 0.3)' : '0 0 10px rgba(99, 102, 241, 0.3)',
        }}
      >
        {isUser ? (
          <User style={{ width: '18px', height: '18px', color: '#ffffff' }} />
        ) : (
          <Bot style={{ width: '18px', height: '18px', color: '#ffffff' }} />
        )}
      </div>

      {/* Message Main Body */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Author Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>
              {isUser ? 'You' : 'IntelliDoc Assistant'}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              {message.timestamp || 'Just now'}
            </span>
          </div>

          {/* Action buttons */}
          {!isUser && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={handleCopy}
                className="btn-secondary"
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                title="Copy Answer"
              >
                {copied ? <Check style={{ width: '14px', height: '14px', color: '#6ee7b7' }} /> : <Copy style={{ width: '14px', height: '14px' }} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Text Content */}
        <div
          style={{
            fontSize: '0.92rem',
            lineHeight: '1.65',
            color: isUser ? '#e5e7eb' : '#f3f4f6',
            whiteSpace: 'pre-wrap',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {message.content}
        </div>

        {/* Assistant Specific Metadata: Sources & Evaluation */}
        {!isUser && (
          <div style={{ marginTop: '0.85rem' }}>
            {/* Quick Action Badges Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              {message.sources && message.sources.length > 0 && (
                <button
                  onClick={() => onToggleSources(message.sources)}
                  className="badge badge-indigo"
                  style={{ cursor: 'pointer', border: '1px solid rgba(99, 102, 241, 0.4)', padding: '0.3rem 0.75rem' }}
                >
                  <Layers style={{ width: '13px', height: '13px' }} />
                  <span>{message.sources.length} Sources Retrieved</span>
                </button>
              )}

              {message.evaluation && (
                <button
                  onClick={() => setShowEvaluation(!showEvaluation)}
                  className="badge badge-emerald"
                  style={{ cursor: 'pointer', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '0.3rem 0.75rem' }}
                >
                  <Sparkles style={{ width: '13px', height: '13px' }} />
                  <span>Faithfulness: {message.evaluation.faithfulness_score}%</span>
                  {showEvaluation ? <ChevronUp style={{ width: '13px', height: '13px' }} /> : <ChevronDown style={{ width: '13px', height: '13px' }} />}
                </button>
              )}
            </div>

            {/* RAG Evaluation Section */}
            {message.evaluation && showEvaluation && (
              <EvaluationCard evaluation={message.evaluation} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
