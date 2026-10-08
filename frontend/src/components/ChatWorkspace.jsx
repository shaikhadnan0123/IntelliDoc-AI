import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Layers, FileText, Bot, AlertCircle, RefreshCcw, HelpCircle, X, Folder } from 'lucide-react';
import ChatMessage from './ChatMessage';
import SourcesPanel from './SourcesPanel';
import { askQuestion } from '../services/api';

const STARTER_QUESTIONS = [
  'What are the key concepts explained in this document?',
  'Summarize the main findings and conclusions.',
  'What methodology or approach was used?',
  'List all technical specifications or requirements.',
];

export default function ChatWorkspace({
  selectedDoc,
  onClearFilter,
  documents = [],
  onOpenSidebar,
}) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Right Drawer active tab for inspecting sources
  const [activeSources, setActiveSources] = useState(null);
  const [showSourcesDrawer, setShowSourcesDrawer] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (queryText) => {
    const questionToAsk = queryText || inputValue;
    if (!questionToAsk.trim() || loading) return;

    setError(null);
    setInputValue('');

    const userMessage = {
      role: 'user',
      content: questionToAsk,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      // Pass message history to API
      const responseData = await askQuestion({
        question: questionToAsk,
        filename: selectedDoc,
        history: messages,
      });

      const assistantMessage = {
        role: 'assistant',
        content: responseData.answer || 'No answer generated.',
        sources: responseData.sources || [],
        evaluation: responseData.evaluation || null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      if (responseData.sources && responseData.sources.length > 0) {
        setActiveSources(responseData.sources);
      }
    } catch (err) {
      console.error('Ask Question error:', err);
      setError(err.message || 'Error contacting IntelliDoc AI backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleToggleSources = (sources) => {
    setActiveSources(sources);
    setShowSourcesDrawer(true);
  };

  const clearChat = () => {
    setMessages([]);
    setActiveSources(null);
    setError(null);
  };

  return (
    <div style={{ flex: 1, display: 'flex', height: 'calc(100vh - 68px)', overflow: 'hidden', position: 'relative' }}>
      {/* Central Conversation Feed */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', width: '100%' }}>
        {/* Workspace Top Banner / Context Scope */}
        <div
          className="glass-panel"
          style={{
            padding: '0.65rem 1rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            backgroundColor: 'rgba(11, 15, 25, 0.7)',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', overflow: 'hidden' }}>
            {onOpenSidebar && (
              <button
                onClick={onOpenSidebar}
                className="btn-secondary mobile-only"
                style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                title="Open Document Library"
              >
                <Folder style={{ width: '14px', height: '14px', color: 'var(--accent-primary)' }} />
                <span>Docs</span>
              </button>
            )}

            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }} className="desktop-only">Retrieval Filter:</span>
            {selectedDoc ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', overflow: 'hidden' }}>
                <span className="badge badge-indigo" style={{ padding: '0.2rem 0.55rem', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <FileText style={{ width: '12px', height: '12px', flexShrink: 0 }} />
                  {selectedDoc}
                </span>
                <button
                  onClick={onClearFilter}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    flexShrink: 0,
                  }}
                >
                  Clear filter
                </button>
              </div>
            ) : (
              <span className="badge badge-indigo" style={{ padding: '0.2rem 0.55rem', fontSize: '0.75rem' }}>
                <Layers style={{ width: '12px', height: '12px' }} />
                All {documents.length} Indexed PDFs
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {activeSources && (
              <button
                onClick={() => setShowSourcesDrawer(!showSourcesDrawer)}
                className="btn-secondary"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
              >
                <Layers style={{ width: '14px', height: '14px', color: 'var(--accent-primary)' }} />
                <span>{showSourcesDrawer ? 'Hide Sources' : 'Inspect Sources'}</span>
              </button>
            )}

            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="btn-secondary"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                title="Clear Chat History"
              >
                <RefreshCcw style={{ width: '14px', height: '14px' }} />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Message List Scroll Container */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {messages.length === 0 ? (
            /* Empty State */
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <Sparkles style={{ width: '32px', height: '32px', color: 'var(--accent-primary)' }} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                Ask Anything About Your Documents
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '520px', marginBottom: '2rem' }}>
                IntelliDoc AI retrieves precise vector chunks from ChromaDB and generates grounded answers backed by faithfulness evaluation metrics.
              </p>

              {/* Starter Question Chips */}
              <div style={{ width: '100%', maxWidth: '600px' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.85rem' }}>
                  Suggested Prompts
                </p>
                <div className="starter-prompts-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {STARTER_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q)}
                      className="glass-card"
                      style={{
                        padding: '0.85rem 1rem',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        color: 'var(--text-main)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.5rem',
                      }}
                    >
                      <HelpCircle style={{ width: '16px', height: '16px', color: 'var(--accent-primary)', flexShrink: 0, marginTop: '2px' }} />
                      <span>{q}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Conversation Feed */
            <div style={{ paddingBottom: '1rem' }}>
              {messages.map((msg, idx) => (
                <ChatMessage key={idx} message={msg} onToggleSources={handleToggleSources} />
              ))}
            </div>
          )}

          {/* Typing Indicator */}
          {loading && (
            <div style={{ display: 'flex', gap: '1rem', padding: '1.25rem 1.5rem', backgroundColor: 'rgba(17, 24, 39, 0.5)' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Bot style={{ width: '18px', height: '18px', color: '#ffffff' }} />
              </div>
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>IntelliDoc Assistant</span>
                <div className="typing-indicator" style={{ marginTop: '0.4rem' }}>
                  <span />
                  <span />
                  <span />
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem', display: 'block' }}>
                  Searching ChromaDB & evaluating answer faithfulness...
                </span>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div
              style={{
                margin: '1rem 1.5rem',
                padding: '0.85rem 1rem',
                backgroundColor: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                borderRadius: 'var(--radius-sm)',
                color: '#fda4af',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
              }}
            >
              <AlertCircle style={{ width: '18px', height: '18px', flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form Bar */}
        <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '0.75rem',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '0.5rem 0.75rem',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                selectedDoc
                  ? `Ask question about "${selectedDoc}"...`
                  : 'Ask question across all documents...'
              }
              rows={1}
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                border: 'none',
                color: 'var(--text-main)',
                fontSize: '0.92rem',
                outline: 'none',
                resize: 'none',
                fontFamily: 'Inter, sans-serif',
                maxHeight: '120px',
                padding: '0.5rem 0.25rem',
              }}
            />

            <button
              type="submit"
              className="btn-primary"
              disabled={!inputValue.trim() || loading}
              style={{ padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)' }}
            >
              <Send style={{ width: '16px', height: '16px' }} />
            </button>
          </form>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem', padding: '0 0.25rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              Press <strong>Enter</strong> to send, <strong>Shift + Enter</strong> for new line
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              ChromaDB Top-K Search Enabled
            </span>
          </div>
        </div>
      </div>

      {/* Right Drawer: Retrieved Sources Inspector */}
      {(showSourcesDrawer || activeSources) && (
        <div
          className="glass-panel animate-fade-in sources-panel-drawer"
          style={{
            width: '360px',
            height: '100%',
            borderLeft: '1px solid var(--border-color)',
            overflowY: 'auto',
            padding: '1.25rem',
            backgroundColor: 'rgba(11, 15, 25, 0.95)',
            zIndex: 35,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
            <button
              onClick={() => {
                setShowSourcesDrawer(false);
                setActiveSources(null);
              }}
              className="btn-secondary"
              style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
            >
              <X style={{ width: '14px', height: '14px' }} />
              <span>Close</span>
            </button>
          </div>
          <SourcesPanel sources={activeSources || []} />
        </div>
      )}
    </div>
  );
}
