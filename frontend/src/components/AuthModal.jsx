import React, { useState } from 'react';
import { LogIn, UserPlus, X, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { loginUser, registerUser, getCurrentUser } from '../services/api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (mode === 'register') {
        // Register API call
        await registerUser(email, password);
        setSuccessMessage('Account created successfully! Logging you in...');
        
        // Auto-login after registration
        await loginUser(email, password);
        const user = await getCurrentUser();
        if (onAuthSuccess) onAuthSuccess(user);
        setTimeout(() => {
          resetAndClose();
        }, 1200);
      } else {
        // Login API call
        await loginUser(email, password);
        const user = await getCurrentUser();
        setSuccessMessage('Authentication successful!');
        if (onAuthSuccess) onAuthSuccess(user);
        setTimeout(() => {
          resetAndClose();
        }, 800);
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (roleType = 'user') => {
    const demoEmail = roleType === 'admin' ? 'admin@example.com' : 'user@example.com';
    const demoPassword = 'password123';

    setEmail(demoEmail);
    setPassword(demoPassword);
    setLoading(true);
    setError(null);

    try {
      if (mode === 'register') {
        try {
          await registerUser(demoEmail, demoPassword);
        } catch (regErr) {
          // If duplicate, ignore and proceed to login
        }
      }
      await loginUser(demoEmail, demoPassword);
      const user = await getCurrentUser() || { email: demoEmail, role: roleType };
      setSuccessMessage(`Logged in successfully as ${roleType.toUpperCase()}!`);
      if (onAuthSuccess) onAuthSuccess(user);
      setTimeout(() => {
        resetAndClose();
      }, 800);
    } catch (err) {
      setError(err.message || 'Quick login failed. Server might be registering first user.');
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setEmail('');
    setPassword('');
    setError(null);
    setSuccessMessage(null);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        animation: 'fadeIn 0.25s ease-out',
      }}
      onClick={resetAndClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '440px',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          position: 'relative',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(99, 102, 241, 0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={resetAndClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '0.25rem',
            borderRadius: '50%',
          }}
        >
          <X style={{ width: '20px', height: '20px' }} />
        </button>

        {/* Brand Icon Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              margin: '0 auto 0.85rem auto',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
            }}
          >
            <ShieldCheck style={{ width: '28px', height: '28px', color: '#ffffff' }} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {mode === 'login'
              ? 'Sign in to access document search & RAG analytics'
              : 'Register to start indexing and asking questions'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            padding: '4px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.5rem',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: mode === 'login' ? 'var(--accent-primary)' : 'transparent',
              color: mode === 'login' ? '#ffffff' : 'var(--text-muted)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
            }}
          >
            <LogIn style={{ width: '14px', height: '14px' }} />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: mode === 'register' ? 'var(--accent-primary)' : 'transparent',
              color: mode === 'register' ? '#ffffff' : 'var(--text-muted)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
            }}
          >
            <UserPlus style={{ width: '14px', height: '14px' }} />
            <span>Register</span>
          </button>
        </div>

        {/* Notification Alerts */}
        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.25rem',
              color: '#fda4af',
              fontSize: '0.83rem',
            }}
          >
            <AlertCircle style={{ width: '16px', height: '16px', flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.25rem',
              color: '#6ee7b7',
              fontSize: '0.83rem',
            }}
          >
            <CheckCircle2 style={{ width: '16px', height: '16px', flexShrink: 0 }} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Email Field */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '16px',
                  height: '16px',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                type="email"
                required
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-main)',
                  fontSize: '0.88rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '16px',
                  height: '16px',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 2.4rem 0.65rem 2.4rem',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-main)',
                  fontSize: '0.88rem',
                  outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '2px',
                }}
              >
                {showPassword ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', marginTop: '0.5rem' }}
          >
            {loading ? (
              <>
                <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                <span>Processing...</span>
              </>
            ) : mode === 'login' ? (
              <>
                <LogIn style={{ width: '16px', height: '16px' }} />
                <span>Sign In</span>
              </>
            ) : (
              <>
                <UserPlus style={{ width: '16px', height: '16px' }} />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Quick Login Divider */}
        <div style={{ position: 'relative', margin: '1.25rem 0 1rem 0', textAlign: 'center' }}>
          <div style={{ height: '1px', backgroundColor: 'var(--border-color)', width: '100%' }} />
          <span
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'var(--bg-secondary)',
              padding: '0 0.5rem',
              fontSize: '0.7rem',
              color: 'var(--text-dim)',
              textTransform: 'uppercase',
            }}
          >
            Or Portfolio Quick Demo
          </span>
        </div>

        {/* Quick Demo Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => handleQuickLogin('user')}
            className="btn-secondary"
            disabled={loading}
            style={{ justifyContent: 'center', padding: '0.55rem', fontSize: '0.78rem' }}
          >
            <Sparkles style={{ width: '14px', height: '14px', color: 'var(--accent-primary)' }} />
            <span>User Demo</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('admin')}
            className="btn-secondary"
            disabled={loading}
            style={{ justifyContent: 'center', padding: '0.55rem', fontSize: '0.78rem', borderColor: 'rgba(244, 63, 94, 0.4)', color: '#fda4af' }}
          >
            <ShieldCheck style={{ width: '14px', height: '14px', color: '#f43f5e' }} />
            <span>Admin Demo</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
