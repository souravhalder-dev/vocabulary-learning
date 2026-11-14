import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  // Returns empty list or default demo document for offline/serverless fallback
  return NextResponse.json([
    {
      id: 1,
      title: "The Industrial Revolution & Global Progress",
      source_type: "text",
      content: "The first pillar began with the Industrial Revolution. It brought massive transformation and shaped the modern creative economy. Students of history examine how resilience and innovation overcome challenges.",
      total_words: 29,
      total_pages: 1,
      current_page: 1,
      reading_progress: 100,
      created_at: new Date().toISOString(),
      last_read_at: new Date().toISOString()
    }
  ]);
}
