import React, { useState } from 'react';
import {
  Database,
  FileText,
  Upload,
  Sparkles,
  RefreshCw,
  LogIn,
  LogOut,
  Shield,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  MoreVertical,
} from 'lucide-react';

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
  isSidebarOpen,
  onToggleSidebar,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdmin =
    currentUser?.role === 'admin' ||
    currentUser?.is_admin === true ||
    currentUser?.email === 'admin@example.com';

  return (
    <header
      className="glass-panel"
      style={{
        height: '68px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1rem',
        zIndex: 30,
        backgroundColor: 'rgba(11, 15, 25, 0.9)',
        position: 'relative',
      }}
    >
      {/* Brand Logo & Sidebar Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        {/* Toggle Sidebar Button for Mobile & Desktop */}
        <button
          onClick={onToggleSidebar}
          className="btn-secondary"
          title={isSidebarOpen ? 'Close Document Library Tab' : 'Open Document Library Tab'}
          style={{ padding: '0.45rem', borderRadius: 'var(--radius-sm)' }}
        >
          {isSidebarOpen ? (
            <PanelLeftClose style={{ width: '18px', height: '18px', color: 'var(--accent-primary)' }} />
          ) : (
            <PanelLeftOpen style={{ width: '18px', height: '18px', color: 'var(--accent-primary)' }} />
          )}
        </button>

        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '11px',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            flexShrink: 0,
          }}
        >
          <Sparkles style={{ width: '20px', height: '20px', color: '#ffffff' }} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h1
              style={{
                fontSize: '1.15rem',
                fontWeight: 800,
                background: 'linear-gradient(90deg, #ffffff 0%, #c7d2fe 60%, #818cf8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em',
                whiteSpace: 'nowrap',
              }}
            >
              IntelliDoc AI
            </h1>
            <span
              className="badge badge-indigo desktop-only"
              style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}
            >
              Vector RAG
            </span>
          </div>
          <p
            className="desktop-only"
            style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}
          >
            Vector Search & Intelligence Engine
          </p>
        </div>
      </div>

      {/* Center Filter Scope Badge (Desktop view) */}
      <div className="desktop-only">
        {selectedDoc ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.35)',
              padding: '0.35rem 0.85rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              color: '#a5b4fc',
              boxShadow: '0 0 15px rgba(99, 102, 241, 0.15)',
              maxWidth: '300px',
            }}
          >
            <FileText style={{ width: '14px', height: '14px', color: 'var(--accent-primary)', flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Active Scope: <strong>{selectedDoc}</strong>
            </span>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              padding: '0.35rem 0.85rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
            }}
          >
            <Database style={{ width: '14px', height: '14px', color: 'var(--accent-cyan)' }} />
            <span>Scope: <strong>Global Search ({docCount} PDFs)</strong></span>
          </div>
        )}
      </div>

      {/* Header Actions - Desktop View */}
      <div className="desktop-only" style={{ alignItems: 'center', gap: '0.75rem' }}>
        {/* Backend Connection Indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-color)',
            padding: '0.35rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
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
          <RefreshCw style={{ width: '14px', height: '14px' }} />
        </button>

        {/* Upload PDF Button */}
        <button onClick={onOpenUpload} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
          <Upload style={{ width: '15px', height: '15px' }} />
          <span>Upload PDF</span>
        </button>

        {/* Admin Console Trigger */}
        <button
          onClick={onOpenAdmin}
          className="btn-secondary"
          style={{
            padding: '0.5rem 0.85rem',
            borderColor: isAdmin ? 'rgba(244, 63, 94, 0.4)' : 'var(--border-color)',
            color: isAdmin ? '#fda4af' : 'var(--text-muted)',
            backgroundColor: isAdmin ? 'rgba(244, 63, 94, 0.1)' : 'rgba(255, 255, 255, 0.04)',
            fontSize: '0.85rem',
          }}
          title={isAdmin ? 'Open Admin Console & Document Cleanup' : 'Admin Panel'}
        >
          <Shield style={{ width: '15px', height: '15px', color: isAdmin ? '#f43f5e' : 'var(--text-muted)' }} />
          <span>Admin</span>
        </button>

        {/* User Auth Profile Area */}
        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '0.75rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: isAdmin
                    ? 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)'
                    : 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#ffffff',
                }}
              >
                {currentUser.email.charAt(0).toUpperCase()}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#ffffff', lineHeight: 1.1 }}>
                  {currentUser.email}
                </span>
                <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>
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
              <LogOut style={{ width: '14px', height: '14px' }} />
            </button>
          </div>
        ) : (
          <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '0.75rem' }}>
            <button
              onClick={() => onOpenAuth('login')}
              className="btn-secondary"
              style={{ padding: '0.45rem 0.85rem', borderColor: 'var(--accent-primary)', color: '#a5b4fc', fontSize: '0.85rem' }}
            >
              <LogIn style={{ width: '14px', height: '14px' }} />
              <span>Sign In</span>
            </button>
          </div>
        )}
      </div>

      {/* Header Actions - Mobile View (Always show Sign In button + Mobile Menu button) */}
      <div className="mobile-only" style={{ alignItems: 'center', gap: '0.5rem' }}>
        {/* Sign In / Profile Quick Button on Mobile */}
        {currentUser ? (
          <div
            onClick={onLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              cursor: 'pointer',
            }}
            title="Click to Sign Out"
          >
            <div
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: isAdmin ? '#f43f5e' : '#6366f1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#ffffff',
              }}
            >
              {currentUser.email.charAt(0).toUpperCase()}
            </div>
            <LogOut style={{ width: '13px', height: '13px', color: '#fda4af' }} />
          </div>
        ) : (
          <button
            onClick={() => onOpenAuth('login')}
            className="btn-primary"
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem', gap: '0.35rem' }}
          >
            <LogIn style={{ width: '14px', height: '14px' }} />
            <span>Sign In</span>
          </button>
        )}

        {/* Mobile Header Menu Trigger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="btn-secondary"
          style={{ padding: '0.45rem', borderRadius: 'var(--radius-sm)' }}
          title="Open Menu"
        >
          {isMobileMenuOpen ? (
            <X style={{ width: '18px', height: '18px', color: '#ffffff' }} />
          ) : (
            <MoreVertical style={{ width: '18px', height: '18px', color: 'var(--text-muted)' }} />
          )}
        </button>
      </div>

      {/* Mobile Drawer Dropdown Panel */}
      {isMobileMenuOpen && (
        <div
          className="glass-panel animate-fade-in"
          style={{
            position: 'absolute',
            top: '68px',
            left: 0,
            right: 0,
            backgroundColor: 'rgba(11, 15, 25, 0.96)',
            borderBottom: '1px solid var(--border-color)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            boxShadow: '0 15px 30px rgba(0,0,0,0.8)',
            zIndex: 40,
          }}
        >
          {/* Status Indicator inside mobile menu */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
              padding: '0.5rem 0.75rem',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              fontSize: '0.8rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className={`status-dot ${isConnected ? 'online' : 'offline'}`} />
              <span style={{ color: isConnected ? '#6ee7b7' : '#fda4af', fontWeight: 600 }}>
                {isConnected ? 'FastAPI Backend Online' : 'Backend Offline'}
              </span>
            </div>
            <button
              onClick={() => {
                onRefreshDocs();
                setIsMobileMenuOpen(false);
              }}
              className="btn-secondary"
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
            >
              <RefreshCw style={{ width: '12px', height: '12px' }} />
              <span>Sync</span>
            </button>
          </div>

          {/* Scope Indicator on Mobile */}
          <div
            style={{
              padding: '0.5rem 0.75rem',
              backgroundColor: 'rgba(99, 102, 241, 0.08)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
            }}
          >
            {selectedDoc ? (
              <span>Active Scope: <strong style={{ color: '#a5b4fc' }}>{selectedDoc}</strong></span>
            ) : (
              <span>Scope: <strong style={{ color: '#a5b4fc' }}>Global Search ({docCount} PDFs)</strong></span>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              onClick={() => {
                onOpenUpload();
                setIsMobileMenuOpen(false);
              }}
              className="btn-primary"
              style={{ justifyContent: 'center', padding: '0.6rem', fontSize: '0.82rem' }}
            >
              <Upload style={{ width: '15px', height: '15px' }} />
              <span>Upload PDF</span>
            </button>

            <button
              onClick={() => {
                onOpenAdmin();
                setIsMobileMenuOpen(false);
              }}
              className="btn-secondary"
              style={{
                justify: 'center',
                padding: '0.6rem',
                fontSize: '0.82rem',
                borderColor: isAdmin ? 'rgba(244, 63, 94, 0.4)' : 'var(--border-color)',
                color: isAdmin ? '#fda4af' : 'var(--text-main)',
              }}
            >
              <Shield style={{ width: '15px', height: '15px', color: isAdmin ? '#f43f5e' : 'var(--text-muted)' }} />
              <span>Admin Panel</span>
            </button>
          </div>

          {/* Auth Action in Mobile Menu */}
          {currentUser ? (
            <button
              onClick={() => {
                onLogout();
                setIsMobileMenuOpen(false);
              }}
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.6rem', color: '#fda4af', borderColor: 'rgba(244, 63, 94, 0.3)' }}
            >
              <LogOut style={{ width: '15px', height: '15px' }} />
              <span>Sign Out ({currentUser.email})</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onOpenAuth('login');
                setIsMobileMenuOpen(false);
              }}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.6rem' }}
            >
              <LogIn style={{ width: '15px', height: '15px' }} />
              <span>Sign In / Create Account</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
}

