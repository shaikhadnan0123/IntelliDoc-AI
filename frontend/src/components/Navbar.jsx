import React from 'react';
import { Database, FileText, Upload, Activity, Sparkles, RefreshCw, LogIn, LogOut, User, Shield } from 'lucide-react';

export default function Navbar({
  isConnected,
  docCount,
  onOpenUpload,
  onRefreshDocs,
  selectedDoc,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenAdmin,
}) {
  const isAdmin = currentUser?.role === 'admin' || currentUser?.is_admin === true || currentUser?.email === 'admin@example.com';

  return (
    <header
      className="glass-panel"
      style={{
        height: '68px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        padding: '0 1.75rem',
        zIndex: 20,
        backgroundColor: 'rgba(11, 15, 25, 0.85)',
      }}
    >
      {/* Brand Logo & System Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '13px',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <Sparkles style={{ width: '22px', height: '22px', color: '#ffffff' }} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1
              style={{
                fontSize: '1.3rem',
                fontWeight: 800,
                background: 'linear-gradient(90deg, #ffffff 0%, #c7d2fe 60%, #818cf8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em',
              }}
            >
              IntelliDoc AI
            </h1>
            <span className="badge badge-indigo" style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem' }}>
              Vector RAG v1.0
            </span>
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Vector Search & Document Intelligence Engine
          </p>
        </div>
      </div>

      {/* Center Filter Scope Badge */}
      {selectedDoc ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.55rem',
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.35)',
            padding: '0.4rem 1rem',
            borderRadius: '20px',
            fontSize: '0.82rem',
            color: '#a5b4fc',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.15)',
          }}
        >
          <FileText style={{ width: '15px', height: '15px', color: 'var(--accent-primary)' }} />
          <span>Active Scope: <strong>{selectedDoc}</strong></span>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.55rem',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            padding: '0.4rem 1rem',
            borderRadius: '20px',
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
          }}
        >
          <Database style={{ width: '14px', height: '14px', color: 'var(--accent-cyan)' }} />
          <span>Scope: <strong>Global Vector Search ({docCount} PDFs)</strong></span>
        </div>
      )}

      {/* Header Actions & Auth Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Backend Connection Indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.55rem',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-color)',
            padding: '0.4rem 0.85rem',
            borderRadius: '9999px',
            fontSize: '0.78rem',
          }}
        >
          <span className={`status-dot ${isConnected ? 'online' : 'offline'}`} />
          <span style={{ color: isConnected ? '#6ee7b7' : '#fda4af', fontWeight: 600 }}>
            {isConnected ? 'FastAPI Online' : 'Offline'}
          </span>
        </div>

        {/* Sync / Refresh Button */}
        <button
          onClick={onRefreshDocs}
          className="btn-secondary"
          title="Refresh indexed documents list"
          style={{ padding: '0.45rem 0.75rem' }}
        >
          <RefreshCw style={{ width: '15px', height: '15px' }} />
        </button>

        {/* Upload PDF Button */}
        <button onClick={onOpenUpload} className="btn-primary" style={{ padding: '0.55rem 1.1rem' }}>
          <Upload style={{ width: '16px', height: '16px' }} />
          <span>Upload PDF</span>
        </button>

        {/* Admin Console Trigger */}
        <button
          onClick={onOpenAdmin}
          className="btn-secondary"
          style={{
            padding: '0.55rem 0.9rem',
            borderColor: isAdmin ? 'rgba(244, 63, 94, 0.4)' : 'var(--border-color)',
            color: isAdmin ? '#fda4af' : 'var(--text-muted)',
            backgroundColor: isAdmin ? 'rgba(244, 63, 94, 0.1)' : 'rgba(255, 255, 255, 0.04)',
          }}
          title={isAdmin ? 'Open Admin Console & Document Cleanup' : 'Admin Panel (Requires Admin Login)'}
        >
          <Shield style={{ width: '16px', height: '16px', color: isAdmin ? '#f43f5e' : 'var(--text-muted)' }} />
          <span>Admin</span>
        </button>

        {/* User Auth Profile Area */}
        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '0.85rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: isAdmin
                    ? 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)'
                    : 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#ffffff',
                }}
              >
                {currentUser.email.charAt(0).toUpperCase()}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ffffff', lineHeight: 1.1 }}>
                  {currentUser.email}
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                  Role: <strong style={{ color: isAdmin ? '#fda4af' : '#a5b4fc' }}>{isAdmin ? 'admin' : (currentUser.role || 'user')}</strong>
                </span>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="btn-secondary"
              title="Sign Out"
              style={{ padding: '0.45rem 0.65rem', color: '#fda4af' }}
            >
              <LogOut style={{ width: '15px', height: '15px' }} />
            </button>
          </div>
        ) : (
          <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '0.85rem' }}>
            <button
              onClick={() => onOpenAuth('login')}
              className="btn-secondary"
              style={{ padding: '0.5rem 0.95rem', borderColor: 'var(--accent-primary)', color: '#a5b4fc' }}
            >
              <LogIn style={{ width: '15px', height: '15px' }} />
              <span>Sign In</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
