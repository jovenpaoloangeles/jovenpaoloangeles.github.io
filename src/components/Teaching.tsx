import React from 'react';
import { GraduationCap, Calendar, Users } from 'lucide-react';

export function Teaching() {
  const courses = [
    {
      code: 'CS 246',
      title: 'Machine Learning in Computational Biology',
      term: 'Spring 2024',
      level: 'Graduate',
      students: 45,
      description: 'Advanced course covering machine learning applications in computational biology.',
    },
    {
      code: 'CS 161',
      title: 'Introduction to Bioinformatics',
      term: 'Fall 2023',
      level: 'Undergraduate',
      students: 120,
      description: 'Fundamental concepts and algorithms in bioinformatics.',
    },
    {
      code: 'CS 373',
      title: 'Statistical Methods in Genomics',
      term: 'Winter 2023',
      level: 'Graduate',
      students: 35,
      description: 'Statistical approaches for analyzing genomic data.',
    },
  ];

  return (
    <section id="teaching" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl font-serif">
            Teaching Experience
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Current and recent courses taught at Stanford University
          </p>
        </div>
        <div className="mt-12 grid gap-8 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
          {courses.map((course, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {course.code}: {course.title}
                  </h3>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {course.term}
                  </div>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <GraduationCap className="h-4 w-4 mr-1" />
                    {course.level} Level
                  </div>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-1" />
                    {course.students} Students
                  </div>
                </div>
                <p className="text-gray-500 text-sm">{course.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}