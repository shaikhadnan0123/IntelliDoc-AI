import React, { useState } from 'react';
import { Shield, Trash2, AlertTriangle, CheckCircle, Database, FileText, X, RefreshCw, Loader2, Info } from 'lucide-react';
import { deleteDocument } from '../services/api';

export default function AdminModal({
  isOpen,
  onClose,
  documents = [],
  currentUser,
  onRefreshDocs,
}) {
  const [deletingDoc, setDeletingDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const isAdmin = currentUser?.role === 'admin' || currentUser?.is_admin === true || currentUser?.email === 'admin@example.com';

  const handleDelete = async (filename) => {
    if (!filename) return;

    setDeletingDoc(filename);
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await deleteDocument(filename);
      setMessage(`Document "${filename}" and its vector embeddings were successfully deleted.`);
      if (onRefreshDocs) await onRefreshDocs();
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message || `Failed to delete "${filename}".`);
    } finally {
      setLoading(false);
      setDeletingDoc(null);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 110,
        animation: 'fadeIn 0.25s ease-out',
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '680px',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          position: 'relative',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 35px rgba(244, 63, 94, 0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '0.25rem',
          }}
        >
          <X style={{ width: '20px', height: '20px' }} />
        </button>

        {/* Header Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(244, 63, 94, 0.4)',
            }}
          >
            <Shield style={{ width: '26px', height: '26px', color: '#ffffff' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Admin Management Console</h2>
              <span className="badge badge-rose">Admin Only</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Manage indexed documents, inspect ChromaDB collection state, and cleanup system data.
            </p>
          </div>
        </div>

        {/* Access Warning if non-admin */}
        {!isAdmin ? (
          <div
            style={{
              padding: '2rem',
              textAlign: 'center',
              backgroundColor: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.25)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <AlertTriangle style={{ width: '42px', height: '42px', color: '#fda4af', margin: '0 auto 0.75rem auto' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>Admin Privileges Required</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.35rem', maxWidth: '440px', margin: '0.35rem auto 1.25rem auto' }}>
              Your current account ({currentUser?.email || 'Guest'}) does not have administrator permissions. Sign in as an admin account to manage and delete documents.
            </p>
            <button onClick={onClose} className="btn-secondary" style={{ padding: '0.6rem 1.25rem' }}>
              Close Console
            </button>
          </div>
        ) : (
          <>
            {/* Status Feedback Banners */}
            {message && (
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
                <CheckCircle style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                <span>{message}</span>
              </div>
            )}

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
                <AlertTriangle style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {/* Document Count Summary Bar */}
            <div
              className="glass-card"
              style={{
                padding: '1rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Database style={{ width: '20px', height: '20px', color: 'var(--accent-primary)' }} />
                <div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
                    Active Indexed Documents
                  </span>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {documents.length} files currently stored in PostgreSQL & ChromaDB
                  </p>
                </div>
              </div>

              <button
                onClick={onRefreshDocs}
                className="btn-secondary"
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem' }}
              >
                <RefreshCw style={{ width: '14px', height: '14px' }} />
                <span>Sync DB</span>
              </button>
            </div>

            {/* Document List with Delete Action */}
            <div style={{ maxHeight: '320px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.6rem', paddingRight: '4px' }}>
              {documents.length === 0 ? (
                <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <FileText style={{ width: '36px', height: '36px', margin: '0 auto 0.75rem auto', opacity: 0.3 }} />
                  <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Database & Vector Storage Clean</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                    PostgreSQL documents count = 0 | Chroma vector collections are empty.
                  </p>
                </div>
              ) : (
                documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="glass-card"
                    style={{
                      padding: '0.85rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'space-between',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                      <FileText style={{ width: '18px', height: '18px', color: 'var(--accent-primary)', flexShrink: 0 }} />
                      <div style={{ overflow: 'hidden' }}>
                        <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {doc}
                        </p>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                          Indexed in Chroma Vector DB & PostgreSQL
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(doc)}
                      disabled={loading && deletingDoc === doc}
                      className="btn-secondary"
                      style={{
                        padding: '0.45rem 0.85rem',
                        borderColor: 'rgba(244, 63, 94, 0.4)',
                        color: '#fda4af',
                        backgroundColor: 'rgba(244, 63, 94, 0.1)',
                      }}
                      title="Permanently remove file from DB, disk & vector embeddings"
                    >
                      {loading && deletingDoc === doc ? (
                        <>
                          <Loader2 style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />
                          <span style={{ fontSize: '0.78rem' }}>Deleting...</span>
                        </>
                      ) : (
                        <>
                          <Trash2 style={{ width: '14px', height: '14px' }} />
                          <span style={{ fontSize: '0.78rem' }}>Delete Document</span>
                        </>
                      )}
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Note Info Callout */}
            <div
              style={{
                marginTop: '1.25rem',
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(99, 102, 241, 0.08)',
                border: '1px solid rgba(99, 102, 241, 0.15)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
              }}
            >
              <Info style={{ width: '16px', height: '16px', color: 'var(--accent-primary)', flexShrink: 0 }} />
              <span>
                <strong>End-to-End Deletion Workflow:</strong> Deleting a document triggers full cleanup across Frontend API → PostgreSQL database → Physical file storage → ChromaDB vector collections.
              </span>
            </div>
          </>
        )}
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
