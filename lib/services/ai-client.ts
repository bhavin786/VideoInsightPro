import { AI_CONFIG } from '../config/ai';
import { openaiService } from './openai';
import { geminiService } from './gemini';
import { deepseekService } from './deepseek';
import { mistralService } from './mistral';

class AIClient {
  private static instance: AIClient;
  private constructor() {}

  public static getInstance(): AIClient {
    if (!AIClient.instance) {
      AIClient.instance = new AIClient();
    }
    return AIClient.instance;
  }

  async transcribeVideo(url: string) {
    try {
      // OpenAI's Whisper is still the best choice for transcription
      const audioFile = await this.extractAudioFromVideo(url);
      return await openaiService.transcribe(audioFile);
    } catch (error) {
      console.error('Transcription error:', error);
      throw error;
    }
  }

  async generateSummary(transcript: string) {
    try {
      // Use Gemini for summary generation
      return await geminiService.generateContent(
        `Please provide a concise summary of the following transcript, highlighting key points and actionable insights:\n\n${transcript}`
      );
    } catch (error) {
      console.error('Summary generation error:', error);
      // Fallback to OpenAI if Gemini fails
      return await openaiService.summarize(transcript);
    }
  }

  async extractKeywords(content: string) {
    try {
      // Use Gemini for keyword extraction
      const prompt = `Extract the most relevant keywords and topics from the following content. Format the response as a JSON array of strings:\n\n${content}`;
      const response = await geminiService.generateContent(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Keyword extraction error:', error);
      throw error;
    }
  }

  async detectSponsors(transcript: string) {
    try {
      // Use Gemini to detect sponsored content
      const prompt = `Analyze this transcript and identify any sponsored content, product placements, or promotional material. Return the results as a JSON object with 'hasSponsoredContent' boolean and 'sponsoredSegments' array with timestamps:\n\n${transcript}`;
      const response = await geminiService.generateContent(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Sponsor detection error:', error);
      throw error;
    }
  }

  private async extractAudioFromVideo(url: string): Promise<File> {
    // Implementation for extracting audio from video
    throw new Error('Not implemented');
  }
}

export const aiClient = AIClient.getInstance();