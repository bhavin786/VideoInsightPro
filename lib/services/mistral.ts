import { AI_CONFIG } from '../config/ai';

class MistralService {
  private static instance: MistralService;
  private apiKey: string;

  private constructor() {
    this.apiKey = process.env.MISTRAL_API_KEY || '';
  }

  public static getInstance(): MistralService {
    if (!MistralService.instance) {
      MistralService.instance = new MistralService();
    }
    return MistralService.instance;
  }

  async chat(prompt: string, options = { model: AI_CONFIG.mistral.models.small }) {
    try {
      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: options.model,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (!response.ok) {
        throw new Error(`Mistral API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Mistral chat error:', error);
      throw error;
    }
  }
}

export const mistralService = MistralService.getInstance();