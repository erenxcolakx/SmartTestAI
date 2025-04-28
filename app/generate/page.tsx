'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BiLoader, BiCheck, BiX } from 'react-icons/bi';

// Mock data for generated questions
const mockQuestions = [
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
];

export default function GeneratePage() {
  const router = useRouter();
  const [stage, setStage] = useState<'processing' | 'review' | 'saving'>('processing');
  const [progress, setProgress] = useState(0);
  const [questions, setQuestions] = useState<typeof mockQuestions>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate processing file and generating questions
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(timer);
          setStage('review');
          setQuestions(mockQuestions);
          return 100;
        }
        return newProgress;
      });
    }, 150);

    return () => clearInterval(timer);
  }, []);

  const handleSave = async () => {
    setStage('saving');
    
    // Simulate saving to database
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Redirect to quizzes page
    router.push('/quizzes');
  };

  const handleEditQuestion = (index: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      question: value
    };
    setQuestions(updatedQuestions);
  };

  const handleEditOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleSetCorrectAnswer = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].correctAnswer = optionIndex;
    setQuestions(updatedQuestions);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Question Generation</h1>
      
      {stage === 'processing' && (
        <div className="card text-center">
          <BiLoader className="w-12 h-12 mx-auto text-primary-500 animate-spin mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Processing Document</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Our AI is analyzing your document and generating questions...
          </p>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4">
            <div 
              className="bg-primary-500 h-4 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {progress < 30 && 'Parsing document...'}
            {progress >= 30 && progress < 60 && 'Analyzing content...'}
            {progress >= 60 && progress < 90 && 'Generating questions...'}
            {progress >= 90 && 'Finalizing...'}
          </p>
        </div>
      )}
      
      {stage === 'review' && questions.length > 0 && (
        <div>
          <div className="card mb-6">
            <h2 className="text-2xl font-semibold mb-4">Review Generated Questions</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Our AI has generated the following questions based on your document. You can edit or remove questions before saving.
            </p>
          </div>
          
          {questions.map((question, questionIndex) => (
            <div key={question.id} className="card mb-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={question.question}
                    onChange={(e) => handleEditQuestion(questionIndex, e.target.value)}
                    className="w-full text-lg font-medium p-2 border-b border-gray-200 dark:border-gray-700 focus:border-primary-500 bg-transparent"
                  />
                </div>
                <button
                  className="text-red-500 hover:text-red-700 p-2"
                  onClick={() => handleRemoveQuestion(questionIndex)}
                >
                  <BiX className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-3 mb-4">
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center">
                    <input
                      type="radio"
                      id={`question-${question.id}-option-${optionIndex}`}
                      name={`question-${question.id}`}
                      checked={question.correctAnswer === optionIndex}
                      onChange={() => handleSetCorrectAnswer(questionIndex, optionIndex)}
                      className="mr-3"
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleEditOption(questionIndex, optionIndex, e.target.value)}
                      className="flex-1 p-2 border border-gray-200 dark:border-gray-700 rounded-md focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                ))}
              </div>
              
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Select the radio button next to the correct answer.
              </p>
            </div>
          ))}
          
          <div className="flex justify-end space-x-4">
            <button
              className="btn btn-secondary"
              onClick={() => router.push('/upload')}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSave}
            >
              Save Quiz
            </button>
          </div>
        </div>
      )}
      
      {stage === 'saving' && (
        <div className="card text-center">
          <BiLoader className="w-12 h-12 mx-auto text-primary-500 animate-spin mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Saving Quiz</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Please wait while we save your quiz...
          </p>
        </div>
      )}
      
      {error && (
        <div className="card bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400">
          <h3 className="text-lg font-semibold mb-2">Error</h3>
          <p>{error}</p>
          <button
            className="btn btn-secondary mt-4"
            onClick={() => router.push('/upload')}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}