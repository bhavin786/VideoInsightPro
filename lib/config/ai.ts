export const AI_CONFIG = {
  openai: {
    apiVersion: '2024-02-15',
    models: {
      transcription: 'whisper-1',
      summarization: 'gpt-4-turbo-preview',
      analysis: 'gpt-4-turbo-preview'
    },
    maxRetries: 3,
    timeout: 30000 // 30 seconds
  },
  deepseek: {
    models: {
      chat: 'deepseek-chat',
      coder: 'deepseek-coder'
    },
    maxRetries: 3,
    timeout: 30000
  },
  mistral: {
    models: {
      tiny: 'mistral-tiny',
      small: 'mistral-small',
      medium: 'mistral-medium'
    },
    maxRetries: 3,
    timeout: 30000
  },
  gemini: {
    models: {
      pro: 'gemini-pro',
      vision: 'gemini-pro-vision'
    },
    maxRetries: 3,
    timeout: 30000
  },
  assemblyai: {
    maxRetries: 3,
    timeout: 60000, // 60 seconds
    features: {
      speakerDiarization: true,
      languageDetection: true
    }
  },
  semrush: {
    region: 'us',
    batchSize: 100, // keywords per request
    timeout: 10000 // 10 seconds
  }
} as const;

export type AIConfig = typeof AI_CONFIG;