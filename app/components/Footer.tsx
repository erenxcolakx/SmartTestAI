'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BiHeart } from 'react-icons/bi';
import { HiSparkles } from 'react-icons/hi';
import { motion } from 'framer-motion';

export default function Footer() {
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

  const currentYear = new Date().getFullYear();

  return (
    <motion.footer 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-700/50 transition-all duration-300"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur opacity-20"></div>
                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-2 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
                  <Image 
                    src={isDarkMode ? "/logotpw.png" : "/logotp.png"}
                    alt="SmartTest AI Logo" 
                    width={32} 
                    height={32} 
                    className="w-8 h-8"
                  />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  SmartTest AI
                </h3>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Akıllı Quiz Sistemi
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
              Yapay zeka destekli quiz sistemi ile öğrenme deneyiminizi geliştirin. 
              Dokümanlarınızı yükleyin, otomatik sorular oluşturun ve bilginizi test edin.
            </p>

            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span>Made with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                className="mx-2"
              >
                <BiHeart className="text-red-500" />
              </motion.div>
              <span>in Turkey</span>
              <HiSparkles className="ml-2 text-purple-500" />
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Hızlı Erişim
            </h4>
            <ul className="space-y-3">
              {[
                { href: '/upload', label: 'Doküman Yükle' },
                { href: '/quizzes', label: 'Quizlerim' },
                { href: '/results', label: 'Sonuçlarım' },
                { href: '/profile', label: 'Profil' }
              ].map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors duration-200 text-sm block py-1"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12 pt-8 border-t border-gray-200/50 dark:border-gray-700/50"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <span>&copy; {currentYear} SmartTest AI. </span>
              <span className="font-medium">Tüm hakları saklıdır.</span>
            </div>
            
            <div className="flex items-center space-x-6">
              {[
                { href: '/privacy', label: 'Gizlilik' },
                { href: '/terms', label: 'Şartlar' },
                { href: '/contact', label: 'İletişim' }
              ].map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <a 
                    href={link.href} 
                    className="text-sm text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
} 