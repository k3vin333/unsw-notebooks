import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function POST(request: Request) {
  try {
    const { query, course } = await request.json()

    // Create embeddings for the search query
    const embedding = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: query,
    })

    // Search in Supabase vector store
    const { data: results } = await supabase.rpc('match_lecture_content', {
      query_embedding: embedding.data[0].embedding,
      match_threshold: 0.7,
      match_count: 5,
      course_filter: course || null
    })

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    )
  }
} 