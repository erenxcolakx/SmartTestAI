'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BiCheck, BiX, BiLeftArrowAlt, BiRightArrowAlt, BiFlag, BiLoader, BiTime } from 'react-icons/bi';
import axios from 'axios';

interface QuizPageProps {
  params: Promise<{ id: string }>;
}

export default function QuizPage({ params }: QuizPageProps) {
  const router = useRouter();
  const [quizId, setQuizId] = useState<string>('');
  
  const [quiz, setQuiz] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [quizResult, setQuizResult] = useState<any>(null);

  useEffect(() => {
    // Initialize params
    const initializeParams = async () => {
      const resolvedParams = await params;
      setQuizId(resolvedParams.id);
    };
    
    initializeParams();
  }, [params]);

  useEffect(() => {
    if (!quizId) return;
    
    // Quiz verilerini API'den yükle
    const loadQuiz = async () => {
      try {
        const response = await axios.get(`/api/quizzes/${quizId}`);
        setQuiz(response.data);
        setSelectedAnswers(new Array(response.data.questions.length).fill(-1));
        setStartTime(new Date());
      } catch (err: any) {
        console.error('Quiz yükleme hatası:', err);
        setError(err.response?.data?.error || 'Quiz yüklenirken bir hata oluştu');
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

  const handleSubmit = async () => {
    if (!quiz) return;
    
    // Harcanan süreyi hesapla (saniye cinsinden)
    const endTime = new Date();
    const seconds = startTime ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000) : 0;
    setTimeSpent(seconds);
    
    try {
      // Quiz sonucunu API'ye gönder
      const response = await axios.post('/api/results', {
        quizId: quiz._id,
        answers: selectedAnswers,
        timeSpent: seconds
      });
      
      setQuizResult(response.data);
      setScore(response.data.score);
      setQuizSubmitted(true);
    } catch (err: any) {
      console.error('Quiz sonucu gönderme hatası:', err);
      setError(err.response?.data?.error || 'Quiz sonucu kaydedilirken bir hata oluştu');
    }
  };

  const handleRetry = () => {
    setSelectedAnswers(new Array(quiz?.questions.length || 0).fill(-1));
    setCurrentQuestionIndex(0);
    setQuizSubmitted(false);
    setScore(null);
    setStartTime(new Date());
    setTimeSpent(0);
    setQuizResult(null);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card text-center py-12">
          <BiLoader className="w-12 h-12 mx-auto text-primary-500 animate-spin mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Quiz Yükleniyor</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Lütfen bekleyin...
          </p>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400">
          <h2 className="text-2xl font-semibold mb-4">Hata</h2>
          <p className="mb-6">{error || 'Quiz bulunamadı'}</p>
          <button
            className="btn btn-primary"
            onClick={() => router.push('/quizzes')}
          >
            Quizlere Dön
          </button>
        </div>
      </div>
    );
  }

  if (quizSubmitted) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card mb-8">
          <h1 className="text-3xl font-bold mb-4">{quiz.title} - Sonuçlar</h1>
          <div className="flex flex-col md:flex-row items-center mb-6">
            <div className="w-32 h-32 rounded-full flex items-center justify-center border-8 border-primary-500 mb-4 md:mb-0 md:mr-6">
              <span className="text-4xl font-bold text-primary-500">{score}%</span>
            </div>
            <div>
              <p className="text-xl mb-2">
                {quiz.questions.length} sorudan {quizResult?.correctAnswers || 0} tanesini doğru yanıtladınız.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                {score && score >= 80 ? 'Harika iş!' : score && score >= 60 ? 'İyi çaba!' : 'Daha fazla pratik yapmalısın!'}
              </p>
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <BiTime className="mr-1" />
                <span>Toplam süre: {formatTime(timeSpent)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <button 
              className="btn btn-secondary"
              onClick={() => router.push('/quizzes')}
            >
              Quizlere Dön
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleRetry}
            >
              Tekrar Dene
            </button>
          </div>
        </div>
        
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-2">Cevapları İncele</h2>
          
          {quiz.questions.map((question: any, questionIndex: number) => (
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
                    {question.options.map((option: string, optionIndex: number) => (
                      <div 
                        key={optionIndex} 
                        className={`p-3 rounded-md border ${
                          optionIndex === question.correctAnswer 
                            ? 'border-green-200 dark:border-green-800' 
                            : optionIndex === selectedAnswers[questionIndex] 
                              ? 'border-red-200 dark:border-red-800' 
                              : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span>{option}</span>
                          {optionIndex === question.correctAnswer && (
                            <span className="text-green-600 dark:text-green-400 font-medium">Doğru</span>
                          )}
                          {optionIndex === selectedAnswers[questionIndex] && optionIndex !== question.correctAnswer && (
                            <span className="text-red-600 dark:text-red-400 font-medium">Senin cevabın</span>
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
          <span>Soru {currentQuestionIndex + 1} / {quiz.questions.length}</span>
          <span>
            {selectedAnswers.filter(ans => ans !== -1).length} / {quiz.questions.length} yanıtlandı
          </span>
        </div>
      </div>
      
      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-6">{currentQuestion.question}</h2>
        
        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option: string, optionIndex: number) => (
            <div
              key={optionIndex}
              className={`p-4 rounded-md border cursor-pointer transition-all ${
                selectedAnswers[currentQuestionIndex] === optionIndex
                  ? 'border-primary-500'
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
          Önceki
        </button>
        
        {currentQuestionIndex === quiz.questions.length - 1 ? (
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={selectedAnswers.some(ans => ans === -1)}
          >
            Quiz'i Tamamla
          </button>
        ) : (
          <button
            className="btn btn-primary flex items-center"
            onClick={handleNext}
          >
            Sonraki
            <BiRightArrowAlt className="ml-1" />
          </button>
        )}
      </div>
      
      {selectedAnswers.some(ans => ans === -1) && currentQuestionIndex === quiz.questions.length - 1 && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 rounded-md flex items-center">
          <BiFlag className="mr-2 flex-shrink-0" />
          <span>Quiz'i tamamlamadan önce lütfen tüm soruları yanıtlayın.</span>
        </div>
      )}
    </div>
  );
} 