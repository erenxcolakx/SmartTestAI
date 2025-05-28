'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BiPlay, BiTrash, BiSearch, BiLoader, BiPlus, BiBook, BiCalendar, BiCheckCircle } from 'react-icons/bi';
import { HiSparkles } from 'react-icons/hi';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useSession } from 'next-auth/react';

export default function QuizzesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Track theme changes
  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);
  
  // Oturum kontrolü
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);
  
  // Quizleri yükle
  useEffect(() => {
    if (status !== 'authenticated') return;
    
    const loadQuizzes = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/quizzes');
        setQuizzes(response.data);
      } catch (err: any) {
        console.error('Quizleri yükleme hatası:', err);
        setError(err.response?.data?.error || 'Quizler yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };
    
    loadQuizzes();
  }, [status]);
  
  const filteredQuizzes = quizzes.filter(quiz =>
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleDeleteQuiz = async (id: string) => {
    if (window.confirm('Bu quiz\'i silmek istediğinizden emin misiniz?')) {
      try {
        await axios.delete(`/api/quizzes/${id}`);
        setQuizzes(quizzes.filter(quiz => quiz._id !== id));
      } catch (err: any) {
        console.error('Quiz silme hatası:', err);
        alert(err.response?.data?.error || 'Quiz silinirken bir hata oluştu.');
      }
    }
  };
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  // Yükleniyor durumu
  if (status === 'loading' || loading) {
    return (
      <div className="relative bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20 min-h-screen transition-colors">
        {/* Modern geometric background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-100 dark:bg-purple-900/30 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-100 dark:bg-blue-900/30 rounded-full blur-3xl opacity-30"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center px-8 py-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-purple-100 dark:border-purple-800">
              <BiLoader className="w-12 h-12 text-purple-500 animate-spin mr-4" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Quizler Yükleniyor</h2>
                <p className="text-gray-600 dark:text-gray-300">Lütfen bekleyin...</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }
  
  // Kimlik doğrulama hatası
  if (status === 'unauthenticated') {
    return null;
  }
  
  // Hata durumu
  if (error) {
    return (
      <div className="relative bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20 min-h-screen transition-colors">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-100 dark:bg-red-900/30 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-100 dark:bg-purple-900/30 rounded-full blur-3xl opacity-30"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="p-8 bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm rounded-3xl border border-red-200 dark:border-red-800">
              <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-4">Hata Oluştu</h2>
              <p className="text-red-600 dark:text-red-300 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-semibold transition-all"
              >
                Tekrar Dene
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20 min-h-screen transition-colors">
      {/* Modern geometric background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-100 dark:bg-purple-900/30 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-100 dark:bg-blue-900/30 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-200 to-blue-200 dark:from-purple-800/30 dark:to-blue-800/30 rounded-full blur-3xl opacity-20"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-purple-100 dark:border-purple-800 mb-8">
            <BiBook className="mr-2 text-purple-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quiz Koleksiyonum</span>
            <HiSparkles className="ml-2 text-purple-500" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animated-gradient-text">
            Quizlerim
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Oluşturduğunuz ve çözdüğünüz quizleri görüntüleyin, yönetin ve tekrar çözün
          </p>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/upload" className="inline-flex items-center px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-semibold text-lg shadow-xl shadow-purple-500/25 transition-all">
              <BiPlus className="mr-3 text-xl" />
              Yeni Quiz Oluştur
            </Link>
          </motion.div>
        </motion.div>
        
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <BiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Quizlerde ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
            />
          </div>
        </motion.div>
        
        {/* Quiz Grid */}
        {filteredQuizzes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <div className="max-w-lg mx-auto p-12 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-100 dark:border-gray-700">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <BiBook className="text-3xl text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {searchQuery ? 'Quiz Bulunamadı' : 'Henüz Quiz Yok'}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                {searchQuery 
                  ? 'Arama kriterlerinize uygun quiz bulunamadı.' 
                  : 'İlk quizinizi oluşturarak başlayın!'}
              </p>
              {!searchQuery && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/upload" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-2xl font-semibold shadow-xl shadow-purple-500/25 transition-all">
                    <BiPlus className="mr-3 text-xl" />
                    İlk Quiz'inizi Oluşturun
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredQuizzes.map((quiz, index) => (
              <motion.div
                key={quiz._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <div className="h-full p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:shadow-purple-500/10 dark:hover:shadow-purple-400/10 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BiBook className="text-white text-xl" />
                    </div>
                    {quiz.score !== null && (
                      <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                        %{quiz.score}
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                    {quiz.title}
                  </h3>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <BiBook className="mr-2 text-purple-500" />
                      {quiz.questions.length} soru
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <BiCalendar className="mr-2 text-blue-500" />
                      {formatDate(quiz.createdAt)}
                    </div>
                    {quiz.lastTaken && (
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <BiCheckCircle className="mr-2 text-green-500" />
                        Son: {formatDate(quiz.lastTaken)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-3">
                    <Link
                      href={`/quiz/${quiz._id}`}
                      className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all"
                    >
                      <BiPlay className="mr-2" />
                      {quiz.lastTaken ? 'Tekrar Çöz' : 'Başlat'}
                    </Link>
                    <button
                      onClick={() => handleDeleteQuiz(quiz._id)}
                      className="px-4 py-3 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-xl transition-all"
                    >
                      <BiTrash />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 