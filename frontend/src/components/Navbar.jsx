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
  Sun,
  Moon,
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
  theme = 'night',
  onToggleTheme,
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
        backgroundColor: 'var(--bg-header)',
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
          className="animate-pulse-glow"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '11px',
            background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 50%, var(--accent-cyan) 100%)',
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
                background: 'linear-gradient(90deg, var(--text-heading) 0%, var(--accent-primary) 100%)',
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
              border: '1px solid var(--border-highlight)',
              padding: '0.35rem 0.85rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              color: 'var(--accent-primary)',
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
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
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
        {/* Night / Normal Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          className="theme-toggle-btn"
          title={theme === 'night' ? 'Switch to Normal (Light) Mode' : 'Switch to Night Mode'}
        >
          {theme === 'night' ? (
            <>
              <Moon style={{ width: '15px', height: '15px', color: '#a5b4fc' }} />
              <span>Night Mode</span>
            </>
          ) : (
            <>
              <Sun style={{ width: '15px', height: '15px', color: '#f59e0b' }} />
              <span>Normal Mode</span>
            </>
          )}
        </button>

        {/* Backend Connection Indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            padding: '0.35rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
          }}
        >
          <span className={`status-dot ${isConnected ? 'online' : 'offline'}`} />
          <span style={{ color: isConnected ? 'var(--accent-emerald)' : 'var(--accent-rose)', fontWeight: 600 }}>
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
            color: isAdmin ? 'var(--accent-rose)' : 'var(--text-muted)',
            backgroundColor: isAdmin ? 'rgba(244, 63, 94, 0.1)' : 'var(--bg-card)',
            fontSize: '0.85rem',
          }}
          title={isAdmin ? 'Open Admin Console & Document Cleanup' : 'Admin Panel'}
        >
          <Shield style={{ width: '15px', height: '15px', color: isAdmin ? 'var(--accent-rose)' : 'var(--text-muted)' }} />
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
                backgroundColor: 'var(--bg-card)',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
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
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-heading)', lineHeight: 1.1 }}>
                  {currentUser.email}
                </span>
                <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>
                  Role: <strong style={{ color: isAdmin ? 'var(--accent-rose)' : 'var(--accent-primary)' }}>{isAdmin ? 'admin' : (currentUser.role || 'user')}</strong>
                </span>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="btn-secondary"
              title="Sign Out"
              style={{ padding: '0.45rem 0.65rem', color: 'var(--accent-rose)' }}
            >
              <LogOut style={{ width: '14px', height: '14px' }} />
            </button>
          </div>
        ) : (
          <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '0.75rem' }}>
            <button
              onClick={() => onOpenAuth('login')}
              className="btn-secondary"
              style={{ padding: '0.45rem 0.85rem', borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)', fontSize: '0.85rem' }}
            >
              <LogIn style={{ width: '14px', height: '14px' }} />
              <span>Sign In</span>
            </button>
          </div>
        )}
      </div>

      {/* Header Actions - Mobile View (Always show Theme Toggle + Sign In button + Mobile Menu button) */}
      <div className="mobile-only" style={{ alignItems: 'center', gap: '0.5rem' }}>
        {/* Mobile Theme Switcher */}
        <button
          onClick={onToggleTheme}
          className="btn-secondary"
          style={{ padding: '0.4rem 0.6rem' }}
          title={theme === 'night' ? 'Normal Mode' : 'Night Mode'}
        >
          {theme === 'night' ? (
            <Moon style={{ width: '15px', height: '15px', color: '#a5b4fc' }} />
          ) : (
            <Sun style={{ width: '15px', height: '15px', color: '#f59e0b' }} />
          )}
        </button>

        {/* Sign In / Profile Quick Button on Mobile */}
        {currentUser ? (
          <div
            onClick={onLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: 'var(--bg-card)',
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
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
            <LogOut style={{ width: '13px', height: '13px', color: 'var(--accent-rose)' }} />
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
            <X style={{ width: '18px', height: '18px', color: 'var(--text-heading)' }} />
          ) : (
            <MoreVertical style={{ width: '18px', height: '18px', color: 'var(--text-muted)' }} />
          )}
        </button>
      </div>

      {/* Mobile Drawer Dropdown Panel */}
      {isMobileMenuOpen && (
        <div
          className="glass-panel animate-slide-up"
          style={{
            position: 'absolute',
            top: '68px',
            left: 0,
            right: 0,
            backgroundColor: 'var(--bg-header)',
            borderBottom: '1px solid var(--border-color)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            boxShadow: 'var(--shadow-card)',
            zIndex: 40,
          }}
        >
          {/* Status Indicator inside mobile menu */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.5rem 0.75rem',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              fontSize: '0.8rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className={`status-dot ${isConnected ? 'online' : 'offline'}`} />
              <span style={{ color: isConnected ? 'var(--accent-emerald)' : 'var(--accent-rose)', fontWeight: 600 }}>
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
              border: '1px solid var(--border-highlight)',
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
            }}
          >
            {selectedDoc ? (
              <span>Active Scope: <strong style={{ color: 'var(--accent-primary)' }}>{selectedDoc}</strong></span>
            ) : (
              <span>Scope: <strong style={{ color: 'var(--accent-primary)' }}>Global Search ({docCount} PDFs)</strong></span>
            )}
          </div>

          {/* Theme Toggler inside Mobile Drawer */}
          <button
            onClick={() => {
              onToggleTheme();
            }}
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.6rem', fontWeight: 600 }}
          >
            {theme === 'night' ? (
              <>
                <Sun style={{ width: '16px', height: '16px', color: '#f59e0b' }} />
                <span>Switch to Normal (Light) Mode</span>
              </>
            ) : (
              <>
                <Moon style={{ width: '16px', height: '16px', color: '#6366f1' }} />
                <span>Switch to Night (Dark) Mode</span>
              </>
            )}
          </button>

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
                justifyContent: 'center',
                padding: '0.6rem',
                fontSize: '0.82rem',
                borderColor: isAdmin ? 'rgba(244, 63, 94, 0.4)' : 'var(--border-color)',
                color: isAdmin ? 'var(--accent-rose)' : 'var(--text-main)',
              }}
            >
              <Shield style={{ width: '15px', height: '15px', color: isAdmin ? 'var(--accent-rose)' : 'var(--text-muted)' }} />
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
              style={{ width: '100%', justifyContent: 'center', padding: '0.6rem', color: 'var(--accent-rose)', borderColor: 'rgba(244, 63, 94, 0.3)' }}
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

