import OpenAI from 'openai';
import { AI_CONFIG } from '../config/ai';

class OpenAIService {
  private client: OpenAI;
  private static instance: OpenAIService;

  private constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
      organization: process.env.OPENAI_ORG_ID
    });
  }

  public static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  async transcribe(audioFile: File) {
    try {
      const formData = new FormData();
      formData.append('file', audioFile);
      formData.append('model', AI_CONFIG.openai.models.transcription);

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`OpenAI transcription error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error('OpenAI transcription error:', error);
      throw error;
    }
  }

  async summarize(text: string) {
    try {
      const response = await this.client.chat.completions.create({
        model: AI_CONFIG.openai.models.summarization,
        messages: [
          {
            role: 'system',
            content: 'Create a concise summary with key points and actionable insights.'
          },
          {
            role: 'user',
            content: text
          }
        ]
      });
      return response.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI summarization error:', error);
      throw error;
    }
  }
}

export const openaiService = OpenAIService.getInstance();