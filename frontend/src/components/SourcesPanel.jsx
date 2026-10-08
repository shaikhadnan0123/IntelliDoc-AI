import React from 'react';
import { Database, FileText, Layers, ExternalLink, Bookmark, Hash } from 'lucide-react';

export default function SourcesPanel({ sources = [], isOpen = true }) {
  if (!sources || sources.length === 0) {
    return (
      <div style={{ padding: '2rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <Database style={{ width: '36px', height: '36px', margin: '0 auto 0.75rem auto', opacity: 0.3 }} />
        <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>No Sources Retrieved Yet</p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
          Ask a question to see the retrieved document chunks & vector similarity scores.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers style={{ width: '18px', height: '18px', color: 'var(--accent-primary)' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Retrieved Document Sources</h3>
        </div>
        <span className="badge badge-indigo">
          Top-{sources.length} Chunks
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {sources.map((source, idx) => {
          const distance = source.distance !== undefined ? source.distance : 0;
          // Calculate similarity score percentage for visualization
          // Distance in vector search (Cosine / L2): smaller distance = higher similarity
          const similarityScore = Math.max(0, Math.min(100, Math.round((1 - distance) * 100)));

          return (
            <div
              key={idx}
              className="glass-card"
              style={{
                padding: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Top Row Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText style={{ width: '16px', height: '16px', color: '#818cf8' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>
                    {source.filename || 'Document'}
                  </span>
                  {source.page !== undefined && (
                    <span className="badge badge-indigo" style={{ padding: '0.15rem 0.45rem', fontSize: '0.7rem' }}>
                      Page {source.page}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'Fira Code' }}>
                    dist: {distance}
                  </span>
                </div>
              </div>

              {/* Vector Match Distance Meter */}
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  <span>Vector Relevance Match</span>
                  <span>{similarityScore}%</span>
                </div>
                <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${similarityScore}%`,
                      background: 'linear-gradient(90deg, #6366f1 0%, #06b6d4 100%)',
                      borderRadius: '2px',
                    }}
                  />
                </div>
              </div>

              {/* Chunk Snippet Box */}
              <div
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.75rem',
                  fontSize: '0.82rem',
                  color: 'var(--text-main)',
                  lineHeight: '1.55',
                  maxHeight: '140px',
                  overflowY: 'auto',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {source.text}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
