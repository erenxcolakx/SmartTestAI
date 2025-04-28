'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BiCheck, BiX, BiLeftArrowAlt, BiRightArrowAlt, BiFlag } from 'react-icons/bi';

// Mock quiz data
const mockQuiz = {
  id: 1,
  title: 'SmartTest AI Overview',
  questions: [
    {
      id: 1,
      question: 'What is the main function of SmartTest AI?',
      options: [
        'Editing documents',
        'Generating AI-powered quizzes',
        'Video conferencing',
        'Storing files in the cloud'
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      question: 'What is the maximum file size supported for uploads?',
      options: [
        '5MB',
        '10MB',
        '20MB',
        '50MB'
      ],
      correctAnswer: 1
    },
    {
      id: 3,
      question: 'Which file formats are supported by SmartTest AI?',
      options: [
        'PDF, DOCX, TXT',
        'PDF, JPG, PNG',
        'DOCX, XLSX, PPT',
        'TXT, CSV, XML'
      ],
      correctAnswer: 0
    },
    {
      id: 4,
      question: 'How does SmartTest AI generate questions?',
      options: [
        'Manual input from users',
        'Using pre-defined templates',
        'Using AI and NLP models',
        'Copying from external sources'
      ],
      correctAnswer: 2
    },
    {
      id: 5,
      question: 'How long are performance reports stored in SmartTest AI?',
      options: [
        '7 days',
        '14 days',
        '30 days',
        '90 days'
      ],
      correctAnswer: 2
    }
  ]
};

export default function QuizPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const quizId = parseInt(params.id);
  
  const [quiz, setQuiz] = useState<typeof mockQuiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real application, fetch the quiz data from an API
    const loadQuiz = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (quizId === mockQuiz.id) {
          setQuiz(mockQuiz);
          setSelectedAnswers(new Array(mockQuiz.questions.length).fill(-1));
        } else {
          setError('Quiz not found');
        }
      } catch (err) {
        setError('Failed to load quiz');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadQuiz();
  }, [quizId]);

  const handleAnswerSelect = (optionIndex: number) => {
    if (quizSubmitted) return;
    
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(newSelectedAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    if (!quiz) return;
    
    // Calculate score
    let correctCount = 0;
    
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });
    
    const calculatedScore = Math.round((correctCount / quiz.questions.length) * 100);
    setScore(calculatedScore);
    setQuizSubmitted(true);
  };

  const handleRetry = () => {
    setSelectedAnswers(new Array(quiz?.questions.length || 0).fill(-1));
    setCurrentQuestionIndex(0);
    setQuizSubmitted(false);
    setScore(null);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card text-center py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mx-auto mb-6"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mx-auto mb-6"></div>
            <div className="space-y-3">
              <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400">
          <h2 className="text-2xl font-semibold mb-4">Error</h2>
          <p className="mb-6">{error || 'Quiz not found'}</p>
          <button
            className="btn btn-primary"
            onClick={() => router.push('/quizzes')}
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  if (quizSubmitted) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card mb-8">
          <h1 className="text-3xl font-bold mb-4">{quiz.title} - Results</h1>
          <div className="flex items-center mb-6">
            <div className="w-32 h-32 rounded-full flex items-center justify-center border-8 border-primary-500 mr-6">
              <span className="text-4xl font-bold text-primary-500">{score}%</span>
            </div>
            <div>
              <p className="text-xl mb-2">
                You answered {selectedAnswers.filter((ans, idx) => ans === quiz.questions[idx].correctAnswer).length} out of {quiz.questions.length} questions correctly.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                {score && score >= 80 ? 'Great job!' : score && score >= 60 ? 'Good effort!' : 'Keep practicing!'}
              </p>
            </div>
          </div>
          
          <div className="flex justify-between">
            <button 
              className="btn btn-secondary"
              onClick={() => router.push('/quizzes')}
            >
              Back to Quizzes
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleRetry}
            >
              Retry Quiz
            </button>
          </div>
        </div>
        
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-2">Review Answers</h2>
          
          {quiz.questions.map((question, questionIndex) => (
            <div key={question.id} className="card">
              <div className="flex">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                  selectedAnswers[questionIndex] === question.correctAnswer 
                    ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' 
                    : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'
                }`}>
                  {selectedAnswers[questionIndex] === question.correctAnswer 
                    ? <BiCheck className="w-5 h-5" /> 
                    : <BiX className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-3">{question.question}</h3>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div 
                        key={optionIndex} 
                        className={`p-3 rounded-md border ${
                          optionIndex === question.correctAnswer 
                            ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' 
                            : optionIndex === selectedAnswers[questionIndex] 
                              ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20' 
                              : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span>{option}</span>
                          {optionIndex === question.correctAnswer && (
                            <span className="text-green-600 dark:text-green-400 font-medium">Correct</span>
                          )}
                          {optionIndex === selectedAnswers[questionIndex] && optionIndex !== question.correctAnswer && (
                            <span className="text-red-600 dark:text-red-400 font-medium">Your answer</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card mb-8">
        <h1 className="text-3xl font-bold mb-6">{quiz.title}</h1>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
          <div 
            className="bg-primary-500 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-6">
          <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
          <span>
            {selectedAnswers.filter(ans => ans !== -1).length} of {quiz.questions.length} answered
          </span>
        </div>
      </div>
      
      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-6">{currentQuestion.question}</h2>
        
        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, optionIndex) => (
            <div
              key={optionIndex}
              className={`p-4 rounded-md border cursor-pointer transition-all ${
                selectedAnswers[currentQuestionIndex] === optionIndex
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
              }`}
              onClick={() => handleAnswerSelect(optionIndex)}
            >
              {option}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          className="btn btn-secondary flex items-center"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <BiLeftArrowAlt className="mr-1" />
          Previous
        </button>
        
        {currentQuestionIndex === quiz.questions.length - 1 ? (
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={selectedAnswers.some(ans => ans === -1)}
          >
            Submit Quiz
          </button>
        ) : (
          <button
            className="btn btn-primary flex items-center"
            onClick={handleNext}
          >
            Next
            <BiRightArrowAlt className="ml-1" />
          </button>
        )}
      </div>
      
      {selectedAnswers.some(ans => ans === -1) && currentQuestionIndex === quiz.questions.length - 1 && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 rounded-md flex items-center">
          <BiFlag className="mr-2 flex-shrink-0" />
          <span>Please answer all questions before submitting the quiz.</span>
        </div>
      )}
    </div>
  );
} 