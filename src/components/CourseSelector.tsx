import React from 'react'

interface CourseSelectorProps {
  selectedCourse: string
  onCourseSelect: (course: string) => void
}

const COURSES = [
  { code: 'COMP2041', name: 'Software Construction' },
  { code: 'COMP1511', name: 'Programming Fundamentals' },
  { code: 'COMP1531', name: 'Software Engineering Fundamentals' },
  { code: 'COMP3311', name: 'Database Systems' },
  { code: 'COMP3231', name: 'Operating Systems' },
  { code: 'COMP2521', name: 'Data Structures and Algorithms' },
  // Add more courses as needed
]

export default function CourseSelector({ selectedCourse, onCourseSelect }: CourseSelectorProps) {
  return (
    <div className="w-full">
      <label htmlFor="course-select" className="block text-sm font-medium text-gray-700 mb-2">
        Select Course
      </label>
      <select
        id="course-select"
        value={selectedCourse}
        onChange={(e) => onCourseSelect(e.target.value)}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">All Courses</option>
        {COURSES.map((course) => (
          <option key={course.code} value={course.code}>
            {course.code} - {course.name}
          </option>
        ))}
      </select>
    </div>
  )
} 