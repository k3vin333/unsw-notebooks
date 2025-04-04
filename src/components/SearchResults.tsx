import React from 'react'

interface SearchResult {
  id: string
  course: string
  lecture: string
  content: string
  similarity: number
}

interface SearchResultsProps {
  results: SearchResult[]
}

export default function SearchResults({ results }: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No results found. Try a different search query.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {results.map((result) => (
        <div
          key={result.id}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {result.course} - {result.lecture}
            </h3>
            <span className="text-sm text-gray-500">
              Relevance: {(result.similarity * 100).toFixed(1)}%
            </span>
          </div>
          <p className="text-gray-700">{result.content}</p>
        </div>
      ))}
    </div>
  )
} 