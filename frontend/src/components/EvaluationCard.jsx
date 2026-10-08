import React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle, Info, Sparkles, Award } from 'lucide-react';

export default function EvaluationCard({ evaluation }) {
  if (!evaluation) return null;

  const {
    faithfulness_score = 0,
    relevance_score = 0,
    grounded = false,
    explanation = 'No explanation provided.',
  } = evaluation;

  const isHighQuality = grounded && faithfulness_score >= 70 && relevance_score >= 70;

  return (
    <div
      className="glass-card animate-fade-in"
      style={{
        padding: '1.25rem',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        backgroundColor: 'rgba(17, 24, 39, 0.85)',
        marginTop: '1rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Card Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <ShieldCheck style={{ width: '20px', height: '20px', color: 'var(--accent-primary)' }} />
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
            RAG Answer Evaluation
          </h4>
        </div>

        {/* Grounded Status Pill */}
        {grounded ? (
          <span className="badge badge-emerald" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <CheckCircle style={{ width: '13px', height: '13px' }} />
            Grounded in Document
          </span>
        ) : (
          <span className="badge badge-rose" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <AlertTriangle style={{ width: '13px', height: '13px' }} />
            Not Grounded / Hallucination Risk
          </span>
        )}
      </div>

      {/* Score Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        {/* Faithfulness Score Meter */}
        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: 'var(--radius-sm)', padding: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Faithfulness Score
            </span>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: faithfulness_score >= 70 ? '#6ee7b7' : '#fcd34d' }}>
              {faithfulness_score}%
            </span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${faithfulness_score}%`,
                background: faithfulness_score >= 70 ? 'linear-gradient(90deg, #10b981 0%, #06b6d4 100%)' : 'linear-gradient(90deg, #f59e0b 0%, #ef4444 100%)',
                transition: 'width 0.5s ease-out',
              }}
            />
          </div>
        </div>

        {/* Relevance Score Meter */}
        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: 'var(--radius-sm)', padding: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Relevance Score
            </span>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: relevance_score >= 70 ? '#a5b4fc' : '#fcd34d' }}>
              {relevance_score}%
            </span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${relevance_score}%`,
                background: relevance_score >= 70 ? 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)' : 'linear-gradient(90deg, #f59e0b 0%, #ef4444 100%)',
                transition: 'width 0.5s ease-out',
              }}
            />
          </div>
        </div>
      </div>

      {/* Explanation Callout Box */}
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          backgroundColor: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.15)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.75rem 1rem',
          fontSize: '0.82rem',
          color: 'var(--text-main)',
          lineHeight: '1.5',
        }}
      >
        <Info style={{ width: '18px', height: '18px', color: 'var(--accent-primary)', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <span style={{ fontWeight: 600, color: '#c7d2fe', display: 'block', marginBottom: '0.15rem' }}>
            Evaluator Rationale:
          </span>
          <p style={{ color: 'var(--text-muted)' }}>{explanation}</p>
        </div>
      </div>
    </div>
  );
}
