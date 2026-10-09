import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ChatWorkspace from './components/ChatWorkspace';
import FileUploadModal from './components/FileUploadModal';
import AuthModal from './components/AuthModal';
import AdminModal from './components/AdminModal';
import { checkHealth, fetchDocuments, getCurrentUser, logoutUser } from './services/api';

export default function App() {
  const [isConnected, setIsConnected] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [loadingDocs, setLoadingDocs] = useState(true);

  // Theme state: 'night' (Dark) | 'normal' (Light)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('intellidoc_theme') || 'night';
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'night' ? 'normal' : 'night';
    setTheme(nextTheme);
    localStorage.setItem('intellidoc_theme', nextTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Responsive Sidebar state (default open on desktop, closed on mobile)
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    return typeof window !== 'undefined' && window.innerWidth >= 768;
  });

  // Authentication state
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'

  // Admin Console state
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Handle window resize to adjust default sidebar visibility
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load backend health, user session & indexed documents
  const loadInitialData = async () => {
    setLoadingDocs(true);
    try {
      const health = await checkHealth();
      setIsConnected(!!health);

      // Check current JWT session
      const user = await getCurrentUser();
      setCurrentUser(user);

      // Fetch documents list
      const docs = await fetchDocuments();
      setDocuments(docs || []);
    } catch (err) {
      console.warn('Initial data load warning:', err);
      setIsConnected(false);
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    loadInitialData();

    // Periodic ping to verify backend connectivity
    const interval = setInterval(async () => {
      const health = await checkHealth();
      setIsConnected(!!health);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleUploadSuccess = () => {
    loadInitialData();
  };

  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    loadInitialData();
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="app-container" data-theme={theme}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        {/* Navigation Top Header */}
        <Navbar
          isConnected={isConnected}
          docCount={documents.length}
          onOpenUpload={() => setIsUploadOpen(true)}
          onRefreshDocs={loadInitialData}
          selectedDoc={selectedDoc}
          currentUser={currentUser}
          onOpenAuth={handleOpenAuth}
          onLogout={handleLogout}
          onOpenAdmin={() => setIsAdminOpen(true)}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={handleToggleSidebar}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        {/* Main Workspace Body */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
          {/* Document Library Sidebar */}
          <Sidebar
            documents={documents}
            selectedDoc={selectedDoc}
            onSelectDoc={(doc) => {
              setSelectedDoc(doc);
              // On mobile, auto-close sidebar when selecting a document so chat is visible
              if (window.innerWidth < 768) {
                setIsSidebarOpen(false);
              }
            }}
            onOpenUpload={() => setIsUploadOpen(true)}
            loading={loadingDocs}
            currentUser={currentUser}
            onRefreshDocs={loadInitialData}
            isOpen={isSidebarOpen}
            onCloseSidebar={() => setIsSidebarOpen(false)}
          />

          {/* Interactive Chat & RAG Explorer Workspace */}
          <ChatWorkspace
            selectedDoc={selectedDoc}
            onClearFilter={() => setSelectedDoc(null)}
            documents={documents}
            onOpenSidebar={() => setIsSidebarOpen(true)}
          />
        </div>
      </div>

      {/* File Upload Modal */}
      <FileUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* Authentication Modal (Login / Register) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authMode}
      />

      {/* Admin Management Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        documents={documents}
        currentUser={currentUser}
        onRefreshDocs={loadInitialData}
      />
    </div>
  );
}
