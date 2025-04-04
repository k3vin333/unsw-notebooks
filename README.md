# UNSW Lecture Search

A semantic search application for UNSW lecture content, helping students find relevant information across courses.

## Features

- Search across lecture content
- Course-specific filtering
- Relevance scoring
- Modern, responsive UI

## Current Implementation

This project currently uses a mock search implementation due to OpenAI API quota limitations. The search functionality demonstrates how the app would work with actual semantic search without requiring API access.

## Project Status

### Completed
- [x] Basic Next.js project setup
- [x] UI components (SearchBar, CourseSelector, SearchResults)
- [x] Mock search API implementation
- [x] Basic styling with Tailwind CSS
- [x] Course filtering functionality

### TODO
- [ ] Set up OpenAI API with valid API key
- [ ] Set up Supabase database with pgvector extension
- [ ] Create lecture_content table in Supabase
- [ ] Create vector similarity search function in Supabase
- [ ] Update search API to use real OpenAI embeddings
- [ ] Update database population script to use real OpenAI embeddings
- [ ] Add more lecture content
- [ ] Implement error handling and fallback for API quota limits
- [ ] Add user authentication (optional)
- [ ] Add ability for instructors to upload lecture content (optional)
- [ ] Add pagination for search results (optional)
- [ ] Implement highlighting of matched text in results (optional)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## Production Implementation

To implement full semantic search functionality:

1. Create a `.env.local` file with valid API keys:
   ```
   OPENAI_API_KEY=your_openai_api_key
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   ```

2. Set up Supabase:
   - Create a new Supabase project
   - Enable the vector extension in SQL editor: `create extension vector;`
   - Create a table for lecture content:
     ```sql
     create table lecture_content (
       id uuid default uuid_generate_v4() primary key,
       course text not null,
       lecture text not null,
       content text not null,
       embedding vector(1536)
     );
     ```
   - Create a search function:
     ```sql
     create function match_lecture_content(
       query_embedding vector(1536),
       match_threshold float,
       match_count int,
       course_filter text
     )
     returns table (
       id uuid,
       course text,
       lecture text,
       content text,
       similarity float
     )
     language plpgsql
     as $$
     begin
       return query
       select
         lecture_content.id,
         lecture_content.course,
         lecture_content.lecture,
         lecture_content.content,
         1 - (lecture_content.embedding <=> query_embedding) as similarity
       from lecture_content
       where 1 - (lecture_content.embedding <=> query_embedding) > match_threshold
         and (course_filter is null or lecture_content.course = course_filter)
       order by lecture_content.embedding <=> query_embedding
       limit match_count;
     end;
     $$;
     ```

3. Update the API route in `src/app/api/search/route.ts` to use OpenAI embeddings and Supabase
4. Run the database population script: `npm run populate-db`

## Technologies Used

- Next.js
- TypeScript
- Tailwind CSS
- OpenAI API (when enabled)
- Supabase (when enabled)

## Contributing

Feel free to submit issues and enhancement requests! 