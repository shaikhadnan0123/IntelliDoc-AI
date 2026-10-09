import React, { useState } from 'react';
import { FileText, Search, Folder, CheckCircle, Plus, ChevronRight, Layers, Trash2, X, PanelLeftClose } from 'lucide-react';
import { deleteDocument } from '../services/api';
import Footer from './Footer';

export default function Sidebar({
  documents = [],
  selectedDoc,
  onSelectDoc,
  onOpenUpload,
  loading = false,
  currentUser,
  onRefreshDocs,
  isOpen = true,
  onCloseSidebar,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingFile, setDeletingFile] = useState(null);

  const isAdmin = currentUser?.role === 'admin' || currentUser?.is_admin === true || currentUser?.email === 'admin@example.com';

  const filteredDocs = documents.filter((doc) =>
    doc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (e, filename) => {
    e.stopPropagation(); // prevent selecting the document
    if (!window.confirm(`Are you sure you want to delete "${filename}"? This will clean up PostgreSQL DB, physical PDF file, and ChromaDB vector embeddings.`)) {
      return;
    }

    setDeletingFile(filename);
    try {
      await deleteDocument(filename);
      if (selectedDoc === filename) {
        onSelectDoc(null);
      }
      if (onRefreshDocs) {
        await onRefreshDocs();
      }
    } catch (err) {
      alert(err.message || `Failed to delete document ${filename}`);
    } finally {
      setDeletingFile(null);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        className="mobile-backdrop"
        onClick={onCloseSidebar}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 40,
        }}
      />

      <aside
        className="glass-panel sidebar-drawer"
        style={{
          width: '320px',
          height: 'calc(100vh - 68px)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          backgroundColor: 'var(--bg-sidebar)',
          zIndex: 45,
        }}
      >
        {/* Sidebar Header */}
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <Folder style={{ width: '18px', height: '18px', color: 'var(--accent-primary)' }} />
              <h2 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                Document Library
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge badge-indigo">
                {documents.length} Files
              </span>
              {/* Close Tab / Fold Sidebar Button */}
              {onCloseSidebar && (
                <button
                  onClick={onCloseSidebar}
                  className="btn-secondary"
                  title="Close / Hide Document Tab"
                  style={{ padding: '0.3rem 0.45rem', color: 'var(--text-muted)' }}
                >
                  <X style={{ width: '16px', height: '16px' }} />
                </button>
              )}
            </div>
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative' }}>
            <Search
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '15px',
                height: '15px',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              placeholder="Filter documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem 0.55rem 2.25rem',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                outline: 'none',
                transition: 'all 0.2s ease',
              }}
            />
          </div>
        </div>

        {/* Scope Selector Header */}
        <div style={{ padding: '0.85rem 1.25rem 0.35rem 1.25rem' }}>
          <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
            Retrieval Scope Target
          </span>
        </div>

        {/* All Documents Item */}
        <div style={{ padding: '0 0.85rem' }}>
          <button
            onClick={() => onSelectDoc(null)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              border: selectedDoc === null ? '1px solid var(--accent-primary)' : '1px solid transparent',
              backgroundColor: selectedDoc === null ? 'rgba(99, 102, 241, 0.16)' : 'transparent',
              color: selectedDoc === null ? 'var(--text-heading)' : 'var(--text-muted)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease',
              marginBottom: '0.5rem',
              boxShadow: selectedDoc === null ? '0 0 15px rgba(99, 102, 241, 0.2)' : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Layers style={{ width: '16px', height: '16px', color: selectedDoc === null ? 'var(--accent-primary)' : 'var(--text-muted)' }} />
              <div>
                <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>All Documents</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Global ChromaDB Search</p>
              </div>
            </div>
            {selectedDoc === null && (
              <CheckCircle style={{ width: '16px', height: '16px', color: 'var(--accent-primary)' }} />
            )}
          </button>
        </div>

        {/* Document List Scrollable */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 0.85rem 1rem 0.85rem' }}>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Loading document library...
            </div>
          ) : filteredDocs.length === 0 ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <FileText style={{ width: '36px', height: '36px', margin: '0 auto 0.75rem auto', opacity: 0.3 }} />
              <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>No documents found</p>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                Upload a PDF document to start asking questions.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {filteredDocs.map((doc, idx) => {
                const isSelected = selectedDoc === doc;
                const isDeleting = deletingFile === doc;

                return (
                  <div
                    key={idx}
                    onClick={() => onSelectDoc(doc)}
                    className="glass-card"
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'space-between',
                      padding: '0.7rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                      backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.14)' : 'var(--bg-card)',
                      color: isSelected ? 'var(--text-heading)' : 'var(--text-main)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', overflow: 'hidden' }}>
                      <FileText style={{ width: '16px', height: '16px', color: isSelected ? 'var(--accent-primary)' : 'var(--accent-secondary)', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.82rem', fontWeight: isSelected ? 600 : 400, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {doc}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                      {/* Admin Delete Action */}
                      {isAdmin && (
                        <button
                          onClick={(e) => handleDelete(e, doc)}
                          disabled={isDeleting}
                          title="Delete document (Admin)"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--accent-rose)',
                            cursor: 'pointer',
                            padding: '0.25rem',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            opacity: 0.7,
                            transition: 'opacity 0.2s ease',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
                        >
                          <Trash2 style={{ width: '14px', height: '14px' }} />
                        </button>
                      )}

                      {isSelected ? (
                        <CheckCircle style={{ width: '15px', height: '15px', color: 'var(--accent-primary)' }} />
                      ) : (
                        <ChevronRight style={{ width: '14px', height: '14px', color: 'var(--text-dim)' }} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Action Ingest Button */}
        <div style={{ padding: '0.85rem 1rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
          <button
            onClick={onOpenUpload}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.65rem' }}
          >
            <Plus style={{ width: '16px', height: '16px' }} />
            <span>Ingest New Document</span>
          </button>
        </div>

        {/* Footer with Author Credit & Rights */}
        <Footer compact={true} />
      </aside>
    </>
  );
}

