import { AI_CONFIG } from '../config/ai';

class DeepSeekService {
  private static instance: DeepSeekService;
  private apiKey: string;

  private constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY || '';
  }

  public static getInstance(): DeepSeekService {
    if (!DeepSeekService.instance) {
      DeepSeekService.instance = new DeepSeekService();
    }
    return DeepSeekService.instance;
  }

  async chat(prompt: string, options = { model: AI_CONFIG.deepseek.models.chat }) {
    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
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
        throw new Error(`DeepSeek API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('DeepSeek chat error:', error);
      throw error;
    }
  }
}

export const deepseekService = DeepSeekService.getInstance();