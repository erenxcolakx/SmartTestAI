'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BiLineChart, BiTime, BiCalendar, BiTrophy } from 'react-icons/bi';

// Mock performance data
const mockPerformanceData = [
  {
    id: 1,
    quizId: 1,
    quizTitle: 'SmartTest AI Overview',
    date: new Date('2023-05-21T15:45:00'),
    score: 80,
    totalQuestions: 5,
    correctAnswers: 4,
    timeSpent: 210 // seconds
  },
  {
    id: 2,
    quizId: 2,
    quizTitle: 'Web Development Basics',
    date: new Date('2023-05-18T11:30:00'),
    score: 75,
    totalQuestions: 8,
    correctAnswers: 6,
    timeSpent: 320
  },
  {
    id: 3,
    quizId: 4,
    quizTitle: 'Machine Learning Fundamentals',
    date: new Date('2023-05-07T10:15:00'),
    score: 92,
    totalQuestions: 12,
    correctAnswers: 11,
    timeSpent: 450
  },
  {
    id: 4,
    quizId: 5,
    quizTitle: 'Software Engineering Principles',
    date: new Date('2023-05-03T14:20:00'),
    score: 85,
    totalQuestions: 7,
    correctAnswers: 6,
    timeSpent: 280
  },
  {
    id: 5,
    quizId: 1,
    quizTitle: 'SmartTest AI Overview',
    date: new Date('2023-04-29T09:10:00'),
    score: 60,
    totalQuestions: 5,
    correctAnswers: 3,
    timeSpent: 190
  }
];

export default function PerformancePage() {
  const [performanceData] = useState(mockPerformanceData);

  // Calculate average score
  const averageScore = performanceData.length > 0
    ? Math.round(performanceData.reduce((acc, item) => acc + item.score, 0) / performanceData.length)
    : 0;

  // Get best score
  const bestScore = performanceData.length > 0
    ? Math.max(...performanceData.map(item => item.score))
    : 0;

  // Total quizzes taken
  const totalQuizzes = performanceData.length;

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Format time (seconds to mm:ss)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Performance History</h1>

      {performanceData.length === 0 ? (
        <div className="card text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">No Quiz History</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You haven't taken any quizzes yet.
          </p>
          <Link href="/quizzes" className="btn btn-primary">
            Take a Quiz
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card flex items-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-4">
                <BiLineChart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-600 dark:text-gray-300">Average Score</h2>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{averageScore}%</p>
              </div>
            </div>

            <div className="card flex items-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-4">
                <BiTrophy className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-600 dark:text-gray-300">Best Score</h2>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{bestScore}%</p>
              </div>
            </div>

            <div className="card flex items-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mr-4">
                <BiCalendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-600 dark:text-gray-300">Quizzes Taken</h2>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{totalQuizzes}</p>
              </div>
            </div>
          </div>

          <div className="card overflow-x-auto">
            <h2 className="text-xl font-semibold mb-4">Quiz History</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Showing results from the past 30 days. Older results may be archived.
            </p>
            
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Quiz
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Score
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Correct/Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {performanceData.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.quizTitle}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{formatDate(item.date)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${
                        item.score >= 80 ? 'text-green-600 dark:text-green-400' : 
                        item.score >= 60 ? 'text-yellow-600 dark:text-yellow-400' : 
                        'text-red-600 dark:text-red-400'
                      }`}>
                        {item.score}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.correctAnswers}/{item.totalQuestions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <BiTime className="mr-1" />
                        {formatTime(item.timeSpent)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        href={`/quiz/${item.quizId}`} 
                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        Retake
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
} 