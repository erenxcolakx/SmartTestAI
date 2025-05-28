'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BiLoader, BiUser, BiEnvelope, BiLogOut, BiBook, BiTrophy, BiUpload, BiStar } from 'react-icons/bi';
import { HiSparkles } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { signOut } from 'next-auth/react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    completedQuizzes: 0
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
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      setLoading(false);
      
      // Burada kullanıcının istatistiklerini API'den alabilirsiniz
      setStats({
        totalQuizzes: 12,
        averageScore: 78,
        completedQuizzes: 8
      });
    }
  }, [status, router]);

  if (loading) {
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
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Profil Yükleniyor</h2>
                <p className="text-gray-600 dark:text-gray-300">Lütfen bekleyin...</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!session || !session.user) {
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
              <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-4">Erişim Reddedildi</h2>
              <p className="text-red-600 dark:text-red-300 mb-6">Bu sayfayı görüntülemek için giriş yapmalısınız.</p>
              <Link href="/auth/signin" className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-semibold transition-all inline-block">
                Giriş Yap
              </Link>
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
            <BiUser className="mr-2 text-purple-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Kullanıcı Profili</span>
            <HiSparkles className="ml-2 text-purple-500" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animated-gradient-text">
            Profilim
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Hesap bilgilerinizi görüntüleyin ve quiz istatistiklerinizi takip edin
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:shadow-purple-500/10 dark:hover:shadow-purple-400/10 transition-all duration-300">
              <div className="text-center mb-8">
                {session.user.image ? (
                  <div className="relative w-32 h-32 mx-auto mb-6">
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'Kullanıcı'}
                      fill
                      className="rounded-full object-cover border-4 border-purple-100 dark:border-purple-800"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-4xl mx-auto mb-6 border-4 border-purple-100 dark:border-purple-800">
                    {session.user.name?.charAt(0) || 'U'}
                  </div>
                )}
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{session.user.name}</h2>
                <p className="text-gray-600 dark:text-gray-300">Quiz Kaşifi</p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center p-4 bg-gray-50/50 dark:bg-gray-700/50 rounded-2xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                    <BiUser className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Kullanıcı Adı</p>
                    <p className="font-medium text-gray-900 dark:text-white">{session.user.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-gray-50/50 dark:bg-gray-700/50 rounded-2xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
                    <BiEnvelope className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">E-posta</p>
                    <p className="font-medium text-gray-900 dark:text-white">{session.user.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full px-6 py-4 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-2xl font-semibold transition-all flex items-center justify-center"
                >
                  <BiLogOut className="mr-2" />
                  Çıkış Yap
                </motion.button>
              </div>
            </div>
          </motion.div>
          
          {/* Stats and Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Stats */}
            <div className="p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:shadow-purple-500/10 dark:hover:shadow-purple-400/10 transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">İstatistikler</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl border border-purple-200 dark:border-purple-700">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                      <BiBook className="text-white text-xl" />
                    </div>
                    <div>
                      <p className="text-sm text-purple-600 dark:text-purple-400">Toplam Quiz</p>
                      <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">{stats.totalQuizzes}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl border border-green-200 dark:border-green-700">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
                      <BiStar className="text-white text-xl" />
                    </div>
                    <div>
                      <p className="text-sm text-green-600 dark:text-green-400">Ortalama Skor</p>
                      <p className="text-3xl font-bold text-green-700 dark:text-green-300">%{stats.averageScore}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl border border-blue-200 dark:border-blue-700">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                      <BiTrophy className="text-white text-xl" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-600 dark:text-blue-400">Tamamlanan</p>
                      <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{stats.completedQuizzes}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:shadow-purple-500/10 dark:hover:shadow-purple-400/10 transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Hızlı Erişim</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link href="/upload" className="block p-6 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-2xl transition-all group">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                        <BiUpload className="text-xl" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-1">Yeni Quiz Oluştur</h4>
                        <p className="text-purple-100 text-sm">Doküman yükleyerek başlayın</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link href="/quizzes" className="block p-6 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl transition-all group">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                        <BiBook className="text-xl" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-1">Quizlerim</h4>
                        <p className="text-blue-100 text-sm">Oluşturduğum quizleri görüntüle</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link href="/results" className="block p-6 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl transition-all group">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                        <BiTrophy className="text-xl" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-1">Sonuçlarım</h4>
                        <p className="text-green-100 text-sm">Performansımı analiz et</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <div className="block p-6 bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl text-white opacity-75">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                        <BiUser className="text-xl" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-1">Ayarlar</h4>
                        <p className="text-gray-100 text-sm">Yakında gelecek...</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 