'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BiLoader, BiCheck, BiX } from 'react-icons/bi';
import axios from 'axios';

export default function GeneratePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileName = searchParams.get('fileName');
  
  const [stage, setStage] = useState<'processing' | 'review' | 'saving'>('processing');
  const [progress, setProgress] = useState(0);
  const [questions, setQuestions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('Yeni Quiz');

  useEffect(() => {
    if (!fileName) {
      setError('Dosya adı bulunamadı. Lütfen önce bir dosya yükleyin.');
      return;
    }

    // Sorular oluştur
    const generateQuestions = async () => {
      // İlerleme animasyonu için bir interval başlat
      const timerRef = { current: null as NodeJS.Timeout | null };
      
      timerRef.current = setInterval(() => {
        setProgress(prev => {
          // API yanıt verdiyse veya hata oluştuysa ilerlemeyi durdur
          if (prev >= 95) {
            if (timerRef.current) clearInterval(timerRef.current);
            return prev;
          }
          return prev + 5;
        });
      }, 300);

      try {
        // API'ye istek gönder
        const response = await axios.post('/api/generate', { fileName });
        
        // İlerleme animasyonunu temizle
        if (timerRef.current) clearInterval(timerRef.current);
        setProgress(100);
        
        // Soruları al ve state'e kaydet
        const { questions } = response.data;
        
        // Her soruya benzersiz bir ID ekle (API tarafından eklenmemişse)
        const questionsWithId = questions.map((q: any, index: number) => ({
          ...q,
          id: q.id || `q-${Date.now()}-${index}`
        }));
        
        setQuestions(questionsWithId);
        setStage('review');
      } catch (err: any) {
        console.error('Soru oluşturma hatası:', err);
        setError(err.response?.data?.error || 'Sorular oluşturulurken bir hata meydana geldi.');
        if (timerRef.current) clearInterval(timerRef.current);
      }
    };

    generateQuestions();
  }, [fileName]);

  const handleSave = async () => {
    setStage('saving');
    
    try {
      // Quiz'i veritabanına kaydet
      const response = await axios.post('/api/quizzes', {
        title,
        questions
      });
      
      // Quiz sayfasına yönlendir
      router.push(`/quizzes`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Quiz kaydedilirken bir hata oluştu.');
      setStage('review');
    }
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
      <h1 className="text-3xl font-bold mb-8 text-center">Soru Oluşturma</h1>
      
      {stage === 'processing' && (
        <div className="card text-center">
          <BiLoader className="w-12 h-12 mx-auto text-primary-500 animate-spin mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Doküman İşleniyor</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Yapay zeka dokümanınızı analiz ediyor ve sorular oluşturuyor...
          </p>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4">
            <div 
              className="bg-primary-500 h-4 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {progress < 30 && 'Doküman ayrıştırılıyor...'}
            {progress >= 30 && progress < 60 && 'İçerik analiz ediliyor...'}
            {progress >= 60 && progress < 90 && 'Sorular oluşturuluyor...'}
            {progress >= 90 && 'Tamamlanıyor...'}
          </p>
        </div>
      )}
      
      {stage === 'review' && questions.length > 0 && (
        <div>
          <div className="card mb-6">
            <h2 className="text-2xl font-semibold mb-4">Oluşturulan Soruları İnceleyin</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Yapay zeka dokümanınız için aşağıdaki soruları oluşturdu. Kaydetmeden önce soruları düzenleyebilir veya kaldırabilirsiniz.
            </p>
            
            <div className="mb-4">
              <label htmlFor="quiz-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Quiz Başlığı
              </label>
              <input
                type="text"
                id="quiz-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input bg-transparent"
                placeholder="Quiz için bir başlık girin"
              />
            </div>
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
                {question.options.map((option: string, optionIndex: number) => (
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
                      className="flex-1 p-2 border border-gray-200 dark:border-gray-700 rounded-md focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-transparent"
                    />
                  </div>
                ))}
              </div>
              
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Doğru cevabı işaretlemek için yanındaki radio butonunu seçin.
              </p>
            </div>
          ))}
          
          <div className="flex justify-end space-x-4">
            <button
              className="btn btn-secondary"
              onClick={() => router.push('/upload')}
            >
              İptal
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={questions.length === 0 || !title.trim()}
            >
              Quiz'i Kaydet
            </button>
          </div>
        </div>
      )}
      
      {stage === 'saving' && (
        <div className="card text-center">
          <BiLoader className="w-12 h-12 mx-auto text-primary-500 animate-spin mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Quiz Kaydediliyor</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Lütfen quiz'iniz kaydedilirken bekleyin...
          </p>
        </div>
      )}
      
      {error && (
        <div className="card bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400">
          <h3 className="text-lg font-semibold mb-2">Hata</h3>
          <p>{error}</p>
          <button
            className="btn btn-secondary mt-4"
            onClick={() => router.push('/upload')}
          >
            Tekrar Dene
          </button>
        </div>
      )}
    </div>
  );
}