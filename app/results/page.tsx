'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BiLoader, BiArrowBack, BiTrophy, BiTime, BiCalendar, BiStar, BiBook } from 'react-icons/bi';
import { HiSparkles } from 'react-icons/hi';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useSession } from 'next-auth/react';

export default function ResultsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    bestScore: 0,
    totalTime: 0
  });

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

  useEffect(() => {
    if (status !== 'authenticated') return;

    const loadResults = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/results');
        
        const resultsData = response.data;
        setResults(resultsData);
        
        if (resultsData.length > 0) {
          const totalQuizzes = resultsData.length;
          const totalScore = resultsData.reduce((sum: number, result: any) => sum + result.score, 0);
          const averageScore = Math.round(totalScore / totalQuizzes);
          const bestScore = Math.max(...resultsData.map((result: any) => result.score));
          const totalTime = resultsData.reduce((sum: number, result: any) => sum + result.timeSpent, 0);
          
          setStats({
            totalQuizzes,
            averageScore,
            bestScore,
            totalTime
          });
        }
      } catch (err: any) {
        console.error('Sonuçları yükleme hatası:', err);
        setError(err.response?.data?.error || 'Sonuçlar yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };
    
    loadResults();
  }, [status]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
    return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
  };
  
  if (status === 'loading' || loading) {
    return (
      <div className="relative bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20 min-h-screen transition-colors">
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
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sonuçlar Yükleniyor</h2>
                <p className="text-gray-600 dark:text-gray-300">Lütfen bekleyin...</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }
  
  if (status === 'unauthenticated') {
    return null;
  }
  
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
            <BiTrophy className="mr-2 text-purple-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Performans Analizi</span>
            <HiSparkles className="ml-2 text-purple-500" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-8 pb-8 animated-gradient-text">
            Sonuçlarım
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Quiz performansınızı analiz edin ve gelişim sürecinizi takip edin
          </p>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/quizzes" className="inline-flex items-center px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-semibold text-lg shadow-xl shadow-purple-500/25 transition-all">
              <BiArrowBack className="mr-3 text-xl" />
              Quizlere Dön
            </Link>
          </motion.div>
        </motion.div>

        {results.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <div className="max-w-lg mx-auto p-12 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-100 dark:border-gray-700">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <BiTrophy className="text-3xl text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Henüz Sonuç Yok</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Quiz çözdüğünüzde sonuçlarınız burada görünecek.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/quizzes" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-2xl font-semibold shadow-xl shadow-purple-500/25 transition-all">
                  <BiBook className="mr-3 text-xl" />
                  Quiz Çözmeye Başla
                </Link>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12"
            >
              <div className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:shadow-purple-500/10 dark:hover:shadow-purple-400/10 transition-all duration-300">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                    <BiBook className="text-white text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Toplam Quiz</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalQuizzes}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:shadow-green-500/10 dark:hover:shadow-green-400/10 transition-all duration-300">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mr-4">
                    <BiStar className="text-white text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Ortalama Skor</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">%{stats.averageScore}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:shadow-yellow-500/10 dark:hover:shadow-yellow-400/10 transition-all duration-300">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mr-4">
                    <BiTrophy className="text-white text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">En İyi Skor</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">%{stats.bestScore}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10 transition-all duration-300">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4">
                    <BiTime className="text-white text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Toplam Süre</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatTime(stats.totalTime)}</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Results List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quiz Geçmişi</h2>
              </div>
              
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {results.map((result, index) => (
                  <motion.div
                    key={result._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="p-6 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex-1 mb-4 md:mb-0">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {result.quiz?.title || 'Quiz Silinmiş'}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                          <div className="flex items-center">
                            <BiCalendar className="mr-1 text-blue-500" />
                            {formatDate(result.completedAt)}
                          </div>
                          <div className="flex items-center">
                            <BiTime className="mr-1 text-purple-500" />
                            {formatTime(result.timeSpent)}
                          </div>
                          <div className="flex items-center">
                            <BiBook className="mr-1 text-green-500" />
                            {result.totalQuestions} soru
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className={`px-4 py-2 rounded-full text-sm font-bold ${getScoreBadgeColor(result.score)}`}>
                          %{result.score}
                        </div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <BiStar
                              key={star}
                              className={`w-5 h-5 ${
                                star <= Math.ceil(result.score / 20)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
} 