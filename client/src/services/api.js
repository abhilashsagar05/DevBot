const API_BASE = '/api';

/**
 * Fetch health status of the backend API
 */
export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    return { isHealthy: data.status === 'healthy', details: data };
  } catch (err) {
    return { isHealthy: false, error: err.message };
  }
}

/**
 * Send a chat message to Gemini via the backend Express API
 * @param {string} message
 * @param {Array<{role: string, content: string}>} history
 */
export async function sendChatMessage(message, history = []) {
  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ message, history }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      const errorMsg = data.error || `Server returned error (${res.status})`;
      throw new Error(errorMsg);
    }

    return data.reply;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to DevBot backend. Is the server running?');
    }
    throw error;
  }
}

