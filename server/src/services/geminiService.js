const config = require('../config/env');

let genAIClient = null;

function getClient() {
  if (genAIClient) return genAIClient;

  if (!config.geminiApiKey) {
    throw new Error('GEMINI_API_KEY is not configured. Please set GEMINI_API_KEY in your environment or .env file.');
  }

  try {
    // Official Google Gen AI SDK
    const { GoogleGenAI } = require('@google/genai');
    genAIClient = new GoogleGenAI({ apiKey: config.geminiApiKey });
    return genAIClient;
  } catch (err) {
    // Fallback if @google/generative-ai is installed
    try {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      genAIClient = new GoogleGenerativeAI(config.geminiApiKey);
      genAIClient.__legacy = true;
      return genAIClient;
    } catch (innerErr) {
      throw new Error(`Failed to initialize Google Gen AI SDK: ${err.message}`);
    }
  }
}

/**
 * Generate a response from Gemini given user prompt and optional conversation history.
 * @param {string} prompt - The user's input message
 * @param {Array<{role: string, content: string}>} [history] - Previous messages in conversation
 * @returns {Promise<string>}
 */
async function generateChatResponse(prompt, history = []) {
  const client = getClient();
  const modelName = config.geminiModel || 'gemini-2.5-flash';

  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Gemini API request timed out after 30 seconds.')), 30000);
  });

  const apiPromise = (async () => {
    if (client.__legacy) {
      const model = client.getGenerativeModel({ model: modelName });
      
      // If history exists, we can use startChat or generateContent
      if (history && history.length > 0) {
        const formattedHistory = history.map(item => ({
          role: item.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: item.content }]
        }));
        const chat = model.startChat({ history: formattedHistory });
        const result = await chat.sendMessage(prompt);
        return result.response.text();
      } else {
        const result = await model.generateContent(prompt);
        return result.response.text();
      }
    } else {
      // Current official @google/genai SDK
      // Build contents array if history is provided
      let contents;
      if (history && history.length > 0) {
        contents = history.map(item => ({
          role: item.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: item.content }]
        }));
        contents.push({
          role: 'user',
          parts: [{ text: prompt }]
        });
      } else {
        contents = prompt;
      }

      const response = await client.models.generateContent({
        model: modelName,
        contents: contents
      });

      if (!response || !response.text) {
        throw new Error('Gemini returned an empty response. The prompt may have triggered safety filters.');
      }

      return response.text;
    }
  })();

  try {
    const reply = await Promise.race([apiPromise, timeoutPromise]);
    return reply;
  } catch (error) {
    // Sanitize upstream errors
    if (error.status === 429 || (error.message && error.message.includes('429'))) {
      throw new Error('Gemini API quota/rate limit exceeded. Please wait a minute before making another request.');
    }
    if (error.message && error.message.includes('API key not valid')) {
      throw new Error('Invalid Gemini API Key. Please verify your GEMINI_API_KEY in the environment.');
    }
    throw error;
  }
}

// Allows injecting a mock client during tests
function __setMockClient(mock) {
  genAIClient = mock;
}

module.exports = {
  generateChatResponse,
  __setMockClient
};

