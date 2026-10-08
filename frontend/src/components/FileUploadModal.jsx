import React, { useState, useRef } from 'react';
import { UploadCloud, X, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { uploadDocument } from '../services/api';

export default function FileUploadModal({ isOpen, onClose, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    setError(null);
    setResult(null);

    if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Invalid file format. Only PDF (.pdf) files are allowed.');
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      const responseData = await uploadDocument(file);
      setResult(responseData);
      if (onUploadSuccess) {
        onUploadSuccess(responseData);
      }
    } catch (err) {
      setError(err.message || 'Failed to upload and index document.');
    } finally {
      setUploading(false);
    }
  };

  const resetModal = () => {
    setFile(null);
    setResult(null);
    setError(null);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={resetModal}
    >
      <div
        className="glass-panel modal-glass-container"
        style={{
          width: '100%',
          maxWidth: '520px',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          position: 'relative',
          border: '1px solid var(--border-highlight)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={resetModal}
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

        {/* Title */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Upload PDF Document</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Ingest and index your document into ChromaDB for vector retrieval.
          </p>
        </div>

        {/* Success View */}
        {result ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <CheckCircle2 style={{ width: '56px', height: '56px', color: 'var(--accent-emerald)', margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.15rem', color: '#ffffff', fontWeight: 700 }}>PDF Indexed Successfully!</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              <strong>{result.filename}</strong> has been vectorized and stored.
            </p>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', margin: '1.25rem 0' }}>
              <div className="glass-card" style={{ padding: '0.85rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Total Chunks</p>
                <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                  {result.total_chunks || result.chunks || 'N/A'}
                </p>
              </div>
              <div className="glass-card" style={{ padding: '0.85rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Vector Collection</p>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6ee7b7', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {result.collection || 'arise_ml_documents'}
                </p>
              </div>
            </div>

            <button onClick={resetModal} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}>
              Done & Start Asking
            </button>
          </div>
        ) : (
          <>
            {/* Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: dragActive ? '2px dashed var(--accent-primary)' : '2px dashed rgba(255, 255, 255, 0.15)',
                backgroundColor: dragActive ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                borderRadius: 'var(--radius-md)',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleChange}
                style={{ display: 'none' }}
              />

              <UploadCloud style={{ width: '48px', height: '48px', color: dragActive ? 'var(--accent-primary)' : 'var(--text-muted)', margin: '0 auto 1rem auto' }} />

              <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff' }}>
                {file ? file.name : 'Click to select or drag PDF file here'}
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
                Supports PDF format up to 50MB
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  backgroundColor: 'rgba(244, 63, 94, 0.15)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  marginTop: '1rem',
                  color: '#fda4af',
                  fontSize: '0.85rem',
                }}
              >
                <AlertCircle style={{ width: '18px', height: '18px', flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {/* Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button onClick={resetModal} className="btn-secondary" disabled={uploading}>
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="btn-primary"
                disabled={!file || uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="animate-spin" style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                    <span>Processing & Indexing...</span>
                  </>
                ) : (
                  <span>Upload & Index</span>
                )}
              </button>
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
