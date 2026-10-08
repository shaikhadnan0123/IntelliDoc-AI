/**
 * IntelliDoc AI - Frontend API Service Wrapper
 * Clean client-side service layer interacting with FastAPI backend (http://localhost:8000).
 * DOES NOT modify backend code or directory.
 */

const API_BASE_URL = 'http://localhost:8000';
const TOKEN_KEY = 'intellidoc_jwt_token';

/**
 * JWT Token Helpers
 */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function getAuthHeaders(extraHeaders = {}) {
  const token = getToken();
  const headers = { ...extraHeaders };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Health Check - Verify FastAPI Server Connectivity
 */
export async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    if (!response.ok) throw new Error('API server unreachable');
    return await response.json();
  } catch (error) {
    console.warn('Backend connection check warning:', error.message);
    return null;
  }
}

/**
 * User Registration
 * @param {string} email
 * @param {string} password
 */
export async function registerUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: email.trim(), password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Registration failed. Please check credentials or duplicate email.');
  }

  return await response.json();
}

/**
 * User Login (OAuth2 Password flow expects URLSearchParams form data)
 * @param {string} email
 * @param {string} password
 */
export async function loginUser(email, password) {
  const formData = new URLSearchParams();
  formData.append('username', email.trim());
  formData.append('password', password);

  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Invalid email or password.');
  }

  const data = await response.json();
  if (data.access_token) {
    setToken(data.access_token);
  }
  return data;
}

/**
 * Fetch Current Authenticated User Profile
 */
export async function getCurrentUser() {
  const token = getToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        removeToken();
      }
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

/**
 * Logout User
 */
export function logoutUser() {
  removeToken();
}

/**
 * Fetch List of Indexed Documents
 */
export async function fetchDocuments() {
  try {
    const response = await fetch(`${API_BASE_URL}/documents`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch documents: ${response.statusText}`);
    }
    const data = await response.json();
    return data.documents || [];
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
}

/**
 * Upload PDF File
 * @param {File} file - PDF file to upload
 */
export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Upload failed. Duplicate file or file format issue.');
  }

  return await response.json();
}

/**
 * Delete Indexed Document (Admin / Management)
 * @param {string} filename - Filename to remove from DB and Chroma
 */
export async function deleteDocument(filename) {
  const headers = getAuthHeaders();
  
  // Try DELETE /documents/{filename}
  let response = await fetch(`${API_BASE_URL}/documents/${encodeURIComponent(filename)}`, {
    method: 'DELETE',
    headers,
  });

  if (!response.ok && (response.status === 404 || response.status === 405)) {
    // Try DELETE /documents?filename=...
    response = await fetch(`${API_BASE_URL}/documents?filename=${encodeURIComponent(filename)}`, {
      method: 'DELETE',
      headers,
    });
  }

  if (!response.ok && (response.status === 404 || response.status === 405)) {
    // Try DELETE /delete/{filename}
    response = await fetch(`${API_BASE_URL}/delete/${encodeURIComponent(filename)}`, {
      method: 'DELETE',
      headers,
    });
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to delete document "${filename}". Admin rights required.`);
  }

  return await response.json();
}

/**
 * Ask Question (RAG Retrieval + LLM Answer + Evaluation)
 * @param {Object} params
 * @param {string} params.question - User question
 * @param {string|null} params.filename - Filter by filename
 * @param {Array} params.history - Array of previous messages [{role, content}]
 */
export async function askQuestion({ question, filename = null, history = [] }) {
  const payload = {
    question: question.trim(),
    filename: filename && filename !== 'ALL' ? filename : null,
    history: history.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
    })),
  };

  const response = await fetch(`${API_BASE_URL}/ask`, {
    method: 'POST',
    headers: getAuthHeaders({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to process question. Please try again.');
  }

  return await response.json();
}

