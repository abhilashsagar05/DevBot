const isLocalhost = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// If on localhost, use local proxy /api. If hosted online (e.g. on Render), automatically route to the cloud API.
export const API_BASE = import.meta.env.VITE_API_URL || 
  (isLocalhost ? '/api' : 'https://devbot-ai-api.onrender.com/api');

/**
 * Fetch health status of the backend API
 */
export async function checkHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(`${API_BASE}/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

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
      throw new Error('Unable to connect to DevBot backend. If running on Render free tier, the server may take 30-50 seconds to wake up.');
    }
    throw error;
  }
}
