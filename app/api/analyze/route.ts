import { NextResponse } from 'next/server';
import { openaiService } from '@/lib/services/openai';
import { geminiService } from '@/lib/services/gemini';

export async function POST(request: Request) {
  try {
    const { videoUrl } = await request.json();

    if (!videoUrl) {
      return NextResponse.json(
        { error: 'Video URL is required' },
        { status: 400 }
      );
    }

    // Process video analysis on the server side
    const results = {
      transcript: 'Sample transcript', // TODO: Implement actual transcription
      summary: await geminiService.generateContent(
        'Generate a summary for this video content'
      ),
      keywords: ['ai', 'video', 'analysis'], // TODO: Implement actual keyword extraction
      sponsorInfo: {
        hasSponsoredContent: false,
        sponsoredSegments: []
      }
    };

    return NextResponse.json(results);
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze video' },
      { status: 500 }
    );
  }
}