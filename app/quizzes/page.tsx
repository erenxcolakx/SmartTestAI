'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BiPlay, BiTrash, BiSearch } from 'react-icons/bi';

// Mock data for quizzes
const mockQuizzes = [
  {
    id: 1,
    title: 'SmartTest AI Overview',
    questionsCount: 5,
    createdAt: new Date('2023-05-20T10:30:00'),
    lastTaken: new Date('2023-05-21T15:45:00'),
    score: 80
  },
  {
    id: 2,
    title: 'Web Development Basics',
    questionsCount: 8,
    createdAt: new Date('2023-05-15T09:20:00'),
    lastTaken: new Date('2023-05-18T11:30:00'),
    score: 75
  },
  {
    id: 3,
    title: 'Database Systems',
    questionsCount: 10,
    createdAt: new Date('2023-05-10T14:00:00'),
    lastTaken: null,
    score: null
  },
  {
    id: 4,
    title: 'Machine Learning Fundamentals',
    questionsCount: 12,
    createdAt: new Date('2023-05-05T16:45:00'),
    lastTaken: new Date('2023-05-07T10:15:00'),
    score: 92
  },
  {
    id: 5,
    title: 'Software Engineering Principles',
    questionsCount: 7,
    createdAt: new Date('2023-05-01T11:00:00'),
    lastTaken: new Date('2023-05-03T14:20:00'),
    score: 85
  }
];

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState(mockQuizzes);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredQuizzes = quizzes.filter(quiz =>
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleDeleteQuiz = (id: number) => {
    if (confirm('Are you sure you want to delete this quiz?')) {
      setQuizzes(quizzes.filter(quiz => quiz.id !== id));
    }
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Quizzes</h1>
        <Link href="/upload" className="btn btn-primary">
          Create New Quiz
        </Link>
      </div>
      
      <div className="card mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search quizzes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
          <BiSearch className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
        </div>
      </div>
      
      {filteredQuizzes.length === 0 ? (
        <div className="card text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">No Quizzes Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {searchQuery ? 'No quizzes match your search query.' : 'You have not created any quizzes yet.'}
          </p>
          {!searchQuery && (
            <Link href="/upload" className="btn btn-primary">
              Create Your First Quiz
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredQuizzes.map(quiz => (
            <div key={quiz.id} className="card flex flex-col md:flex-row md:items-center">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{quiz.title}</h3>
                <div className="flex flex-wrap text-sm text-gray-600 dark:text-gray-300 mb-4 md:mb-0">
                  <span className="mr-4">{quiz.questionsCount} questions</span>
                  <span className="mr-4">Created: {formatDate(quiz.createdAt)}</span>
                  {quiz.lastTaken && (
                    <span className="mr-4">Last taken: {formatDate(quiz.lastTaken)}</span>
                  )}
                  {quiz.score !== null && (
                    <span className="font-medium text-primary-600 dark:text-primary-400">
                      Last score: {quiz.score}%
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Link
                  href={`/quiz/${quiz.id}`}
                  className="btn btn-primary flex items-center"
                >
                  <BiPlay className="mr-1" />
                  {quiz.lastTaken ? 'Retake Quiz' : 'Start Quiz'}
                </Link>
                <button
                  onClick={() => handleDeleteQuiz(quiz.id)}
                  className="btn btn-secondary flex items-center"
                >
                  <BiTrash className="mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 