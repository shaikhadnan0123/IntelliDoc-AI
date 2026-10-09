import React from 'react';
import { Heart, Sparkles, ShieldCheck, Code2 } from 'lucide-react';

export default function Footer({ compact = false }) {
  return (
    <footer
      className="footer-container glass-panel animate-fade-in"
      style={{
        padding: compact ? '0.5rem 0.85rem' : '0.75rem 1.25rem',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        backgroundColor: 'var(--bg-card)',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <Code2 style={{ width: '14px', height: '14px', color: 'var(--accent-primary)' }} />
        <span>Developed with</span>
        <Heart style={{ width: '13px', height: '13px', color: 'var(--accent-rose)', fill: 'var(--accent-rose)' }} className="animate-pulse" />
        <span>by</span>
        <span
          className="author-name-gradient"
          style={{
            fontWeight: 800,
            fontSize: compact ? '0.8rem' : '0.85rem',
            background: 'linear-gradient(90deg, var(--accent-primary) 0%, var(--accent-secondary) 50%, var(--accent-cyan) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.02em',
          }}
        >
          Shaikh Adnan
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <ShieldCheck style={{ width: '13px', height: '13px', color: 'var(--accent-emerald)' }} />
          <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
            All rights reserved
          </span>
        </div>
        <span style={{ color: 'var(--text-dim)' }}>•</span>
        <span style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>
          © {new Date().getFullYear()} IntelliDoc AI
        </span>
      </div>
    </footer>
  );
}
