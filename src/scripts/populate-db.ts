import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface LectureContent {
  course: string
  lecture: string
  content: string
}

async function createEmbedding(content: string) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: content,
  })
  return response.data[0].embedding
}

async function populateDatabase(lectureContents: LectureContent[]) {
  for (const content of lectureContents) {
    console.log(`Processing: ${content.course} - ${content.lecture}`)
    const embedding = await createEmbedding(content.content)
    
    const { error } = await supabase.from('lecture_content').insert({
      course: content.course,
      lecture: content.lecture,
      content: content.content,
      embedding,
    })
    
    if (error) {
      console.error('Error inserting content:', error)
    } else {
      console.log(`Added: ${content.course} - ${content.lecture}`)
    }
  }
}

// Example lecture content
const sampleContent: LectureContent[] = [
  {
    course: 'COMP2041',
    lecture: 'Week 1 - Introduction to Python',
    content: 'Python is a high-level programming language known for its simplicity and readability. It supports multiple programming paradigms including procedural, object-oriented, and functional programming.',
  },
  {
    course: 'COMP2041',
    lecture: 'Week 2 - Python Functions',
    content: 'Functions in Python are defined using the def keyword. They can take parameters and return values. Python supports default parameters, keyword arguments, and variable-length argument lists.',
  },
  {
    course: 'COMP1511',
    lecture: 'Week 1 - Introduction to C',
    content: 'C is a procedural programming language that provides low-level access to memory. It is a compiled language that requires explicit memory management by the programmer.',
  },
  // Add more lecture content here
]

console.log('Starting database population...')
populateDatabase(sampleContent)
  .then(() => console.log('Database populated successfully'))
  .catch((error) => console.error('Error populating database:', error)) 