import { AI_CONFIG } from '../config/ai';

class GeminiService {
  private static instance: GeminiService;
  private apiKey: string;

  private constructor() {
    this.apiKey = process.env.GOOGLE_API_KEY || '';
  }

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  async generateContent(prompt: string, options = { model: AI_CONFIG.gemini.models.pro }) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${options.model}:generateContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': this.apiKey
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini generation error:', error);
      throw error;
    }
  }

  async generateFromImage(imageUrl: string, prompt: string) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${AI_CONFIG.gemini.models.vision}:generateContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': this.apiKey
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inline_data: { mime_type: 'image/jpeg', data: imageUrl } }
            ]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini Vision API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini vision error:', error);
      throw error;
    }
  }
}

export const geminiService = GeminiService.getInstance();