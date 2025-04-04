'use client'
import React, { useState } from 'react'
import SearchBar from '../components/SearchBar'
import CourseSelector from '../components/CourseSelector'
import SearchResults from '../components/SearchResults'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (query: string) => {
    if (!query.trim()) return
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, course: selectedCourse }),
      })
      
      const data = await response.json()
      setSearchResults(data.results || [])
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">UNSW Lecture Search</h1>
      
      <div className="max-w-2xl mx-auto space-y-6">
        <CourseSelector 
          selectedCourse={selectedCourse}
          onCourseSelect={setSelectedCourse}
        />
        
        <SearchBar 
          onSearch={handleSearch}
          query={searchQuery}
          setQuery={setSearchQuery}
        />
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-600">Searching...</p>
          </div>
        ) : (
          <SearchResults results={searchResults} />
        )}
      </div>
    </div>
  )
} 