'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import { HiSun, HiMoon } from 'react-icons/hi';
import { BiUser, BiLogOut, BiUpload, BiBook, BiTrophy, BiMenu, BiX } from 'react-icons/bi';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const isAuthenticated = status === 'authenticated';

  // Initialize theme on component mount
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      const shouldBeDark = savedTheme === 'dark';
      if (shouldBeDark !== isDark) {
        setIsDarkMode(shouldBeDark);
        if (shouldBeDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    } else {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
  }, []);

  // Apply theme changes to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const navItems = [
    { href: '/upload', label: 'Doküman Yükle', icon: BiUpload },
    { href: '/quizzes', label: 'Quizlerim', icon: BiBook },
    { href: '/results', label: 'Sonuçlarım', icon: BiTrophy },
  ];
  
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center"
          >
            <Link href="/" className="flex items-center group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
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
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  SmartTest AI
                </span>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Akıllı Quiz Sistemi
                </div>
              </div>
            </Link>
          </motion.div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:items-center lg:space-x-2">
            {isAuthenticated && navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link 
                  href={item.href} 
                  className="group relative px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-all duration-200"
                >
                  <div className="absolute inset-x-0 inset-y-0 bg-gray-100/0 dark:bg-gray-800/0 group-hover:bg-gray-100/80 dark:group-hover:bg-gray-800/80 rounded-xl transition-all duration-200"></div>
                  <div className="relative flex items-center">
                    <item.icon className="mr-2 text-lg" />
                    {item.label}
                  </div>
                </Link>
              </motion.div>
            ))}
          </nav>
          
          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Google Login Button */}
            {!isAuthenticated && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => signIn('google')}
                className="hidden md:inline-flex items-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/80 transition-all duration-200 shadow-sm"
              >
                <FcGoogle className="mr-2 text-lg" />
                Google ile Giriş
              </motion.button>
            )}

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200 shadow-sm"
              aria-label="Tema değiştir"
            >
              <AnimatePresence mode="wait">
                {isDarkMode ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <HiSun className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <HiMoon className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* User Menu */}
            {isAuthenticated && (
              <div className="hidden md:block relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center p-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50/80 dark:hover:bg-gray-700/80 transition-all duration-200 shadow-sm"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {session?.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'Kullanıcı'}
                      width={32}
                      height={32}
                      className="rounded-lg border-2 border-white dark:border-gray-700"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                      {session?.user?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <span className="ml-3 mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {session?.user?.name?.split(' ')[0] || 'Kullanıcı'}
                  </span>
                  <motion.div
                    animate={{ rotate: isMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-4 h-4 text-gray-400"
                  >
                    ▼
                  </motion.div>
                </motion.button>
                
                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 py-2 z-20"
                    >
                      <Link 
                        href="/profile"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100/80 dark:text-gray-300 dark:hover:bg-gray-700/80 transition-all duration-200 group"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <BiUser className="mr-3 text-lg text-purple-500 group-hover:scale-110 transition-transform" />
                        Profil
                      </Link>
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          signOut({ callbackUrl: '/' });
                        }}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100/80 dark:text-gray-300 dark:hover:bg-gray-700/80 transition-all duration-200 group"
                      >
                        <BiLogOut className="mr-3 text-lg text-red-500 group-hover:scale-110 transition-transform" />
                        Çıkış Yap
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            
            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 text-gray-600 dark:text-gray-400 transition-all duration-200 shadow-sm"
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <BiX className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <BiMenu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden border-t border-gray-200/50 dark:border-gray-700/50"
            >
              <div className="py-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-b-2xl">
                {isAuthenticated ? (
                  <>
                    {/* User Info */}
                    <div className="flex items-center px-4 py-3 mb-4 bg-gray-50/80 dark:bg-gray-700/80 rounded-xl mx-4">
                      {session?.user?.image ? (
                        <Image
                          src={session.user.image}
                          alt={session.user.name || 'Kullanıcı'}
                          width={40}
                          height={40}
                          className="rounded-lg border-2 border-white dark:border-gray-600"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                          {session?.user?.name?.charAt(0) || 'U'}
                        </div>
                      )}
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {session?.user?.name || 'Kullanıcı'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {session?.user?.email}
                        </div>
                      </div>
                    </div>

                    {/* Navigation Items */}
                    {navItems.map((item, index) => (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={item.href}
                          className="flex items-center px-4 py-3 mx-4 mb-2 text-gray-700 hover:bg-gray-100/80 dark:text-gray-300 dark:hover:bg-gray-700/80 rounded-xl transition-all duration-200 group"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <item.icon className="mr-3 text-lg text-purple-500 group-hover:scale-110 transition-transform" />
                          {item.label}
                        </Link>
                      </motion.div>
                    ))}

                    {/* Profile and Logout */}
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-3 mx-4 mb-2 text-gray-700 hover:bg-gray-100/80 dark:text-gray-300 dark:hover:bg-gray-700/80 rounded-xl transition-all duration-200 group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <BiUser className="mr-3 text-lg text-purple-500 group-hover:scale-110 transition-transform" />
                      Profil
                    </Link>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        signOut({ callbackUrl: '/' });
                      }}
                      className="flex items-center w-full px-4 py-3 mx-4 text-gray-700 hover:bg-gray-100/80 dark:text-gray-300 dark:hover:bg-gray-700/80 rounded-xl transition-all duration-200 group"
                    >
                      <BiLogOut className="mr-3 text-lg text-red-500 group-hover:scale-110 transition-transform" />
                      Çıkış Yap
                    </button>
                  </>
                ) : (
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => {
                      setIsMenuOpen(false);
                      signIn('google');
                    }}
                    className="flex items-center w-full px-4 py-3 mx-4 text-gray-700 hover:bg-gray-100/80 dark:text-gray-300 dark:hover:bg-gray-700/80 rounded-xl transition-all duration-200 group"
                  >
                    <FcGoogle className="mr-3 text-xl group-hover:scale-110 transition-transform" />
                    Google ile Giriş Yap
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
} 