'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { BiRocket, BiBook, BiAnalyse, BiCloudUpload, BiChevronRight, BiStar } from 'react-icons/bi';
import { HiSparkles, HiLightningBolt } from 'react-icons/hi';
import { motion } from 'framer-motion';

export default function HomePage() {
  const { data: session } = useSession();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Track theme changes
  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };

    // Check initial theme
    checkTheme();

    // Listen for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);
  
  return (
    <div className="relative bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20 min-h-screen transition-colors">
      {/* Modern geometric background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-100 dark:bg-purple-900/30 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-100 dark:bg-blue-900/30 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-200 to-blue-200 dark:from-purple-800/30 dark:to-blue-800/30 rounded-full blur-3xl opacity-20"></div>
      </div>
      
      {/* Hero Bölümü - Full Width */}
      <section className="relative z-10 py-20 w-full">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Logo Badge */}
            <motion.div 
              className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-purple-100 dark:border-purple-800 mb-8"
              whileHover={{ scale: 1.05 }}
            >
              <Image 
                src={isDarkMode ? "/logotpw.png" : "/logotp.png"}
                alt="SmartTest AI"
                width={28}
                height={28}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">SmartTest AI</span>
              <HiSparkles className="ml-2 text-purple-500" />
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 animated-gradient-text">
              Akıllı Quiz<br />
              <span className="text-4xl md:text-6xl">Oluşturucu</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12">
              Dokümanlarınızı saniyeler içinde <span className="font-semibold sparkle-text">interaktif quizlere</span> dönüştürün. 
              Yapay zeka ile öğrenme deneyiminizi hızlandırın.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              {session ? (
                <>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href="/upload" className="inline-flex items-center px-8 py-4 bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white rounded-2xl font-semibold text-lg shadow-xl shadow-purple-500/25 transition-all">
                      <BiCloudUpload className="mr-3 text-xl" />
                      Hemen Başla
                      <BiChevronRight className="ml-2" />
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href="/quizzes" className="inline-flex items-center px-8 py-4 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl font-semibold text-lg shadow-lg border border-gray-200 dark:border-gray-700 transition-all">
                      <BiBook className="mr-3 text-xl" />
                      Quizlerim
                    </Link>
                  </motion.div>
                </>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/auth/signin" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-2xl font-semibold text-lg shadow-xl shadow-purple-500/25 transition-all">
                    <HiLightningBolt className="mr-3 text-xl" />
                    Ücretsiz Dene
                    <BiChevronRight className="ml-2" />
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Features Grid */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="py-10 px-6"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold animated-gradient-text mb-4">Neden SmartTest AI?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Modern yapay zeka teknolojisi ile öğrenmeyi daha etkili hale getirin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <motion.div 
              whileHover={{ y: -8 }}
              className="group p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:shadow-purple-500/10 dark:hover:shadow-purple-400/10 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <HiLightningBolt className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Saniyeler İçinde</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Herhangi bir dokümanı yükleyin, yapay zeka saniyeler içinde profesyonel quiz sorularını oluştursun.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -8 }}
              className="group p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BiAnalyse className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Akıllı Analiz</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                GPT teknolojisi içeriğinizi analiz eder ve en önemli konulardan anlamlı sorular üretir.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -8 }}
              className="group p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:shadow-green-500/10 dark:hover:shadow-green-400/10 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BiBook className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Kapsamlı Raporlama</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Detaylı performans analizi ile güçlü ve zayıf yönlerinizi keşfedin, öğrenmenizi optimize edin.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* How it Works */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="py-20 px-6"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold animated-gradient-text mb-4">3 Basit Adım</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">Quiz oluşturmak hiç bu kadar kolay olmamıştı</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connection lines for desktop */}
              <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-purple-200 via-blue-200 to-green-200 dark:from-purple-700 dark:via-blue-700 dark:to-green-700"></div>
              
              {[
                { step: 1, title: "Yükle", desc: "Dokümanınızı sürükle-bırak", icon: BiCloudUpload, color: "purple" },
                { step: 2, title: "Oluştur", desc: "AI soruları otomatik üretsin", icon: HiSparkles, color: "blue" },
                { step: 3, title: "Çöz", desc: "Quizi çöz ve analiz et", icon: BiBook, color: "green" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="text-center relative z-10"
                >
                  <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 rounded-full flex items-center justify-center shadow-lg shadow-${item.color}-500/25`}>
                    <item.icon className="text-3xl text-white" />
                  </div>
                  <div className={`w-8 h-8 mx-auto mb-4 bg-${item.color}-100 dark:bg-${item.color}-900/50 text-${item.color}-600 dark:text-${item.color}-400 rounded-full flex items-center justify-center text-sm font-bold`}>
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="py-20 px-6"
        >
          <div className="max-w-4xl mx-auto text-center">
            <div className="p-12 bg-gradient-to-br from-purple-600 to-blue-600 dark:from-purple-700 dark:to-blue-700 rounded-3xl text-white shadow-2xl shadow-purple-500/25">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Hemen Başlayın</h2>
              <p className="text-lg text-purple-100 dark:text-purple-200 mb-8 max-w-2xl mx-auto">
                Dakikalar içinde ilk quizinizi oluşturun. Kredi kartı gerekmez, ücretsiz deneme.
              </p>
              
              {session ? (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/upload" className="inline-flex items-center px-10 py-4 bg-white hover:bg-gray-100 text-purple-600 rounded-2xl font-bold text-lg shadow-xl transition-all">
                    <BiCloudUpload className="mr-3 text-xl" />
                    Quiz Oluştur
                    <BiChevronRight className="ml-2" />
                  </Link>
                </motion.div>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/auth/signin" className="inline-flex items-center px-10 py-4 bg-white hover:bg-gray-100 text-purple-600 rounded-2xl font-bold text-lg shadow-xl transition-all">
                    <HiLightningBolt className="mr-3 text-xl" />
                    Ücretsiz Başla
                    <BiChevronRight className="ml-2" />
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
} 