'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BiUpload, BiFile, BiLoader, BiCloudUpload, BiX, BiChevronRight } from 'react-icons/bi';
import { HiSparkles, HiDocumentText } from 'react-icons/hi';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useSession } from 'next-auth/react';

export default function UploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
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

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    setError(null);
    
    // Check file type
    const validTypes = ['.pdf', '.docx', '.txt', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const isValidType = validTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type);
      }
      return file.type === type;
    });

    if (!isValidType) {
      setError('Geçersiz dosya tipi. Lütfen PDF, DOCX veya TXT dosyası yükleyin.');
      return;
    }

    // Check file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      setError('Dosya çok büyük. Maksimum boyut 10MB.');
      return;
    }

    setFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    // FormData oluştur
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Dosyayı yükle
      const uploadResponse = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(percentCompleted);
        },
      });

      // Sorular oluştur
      const { fileName } = uploadResponse.data;
      
      // Dosya yüklemeyi tamamladık, şimdi generate sayfasına yönlendir
      router.push(`/generate?fileName=${fileName}`);
      
    } catch (err: any) {
      setError(err.response?.data?.error || 'Dosya yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  // Kimlik doğrulama kontrolü
  if (status === 'loading') {
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
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Yükleniyor</h2>
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

  return (
    <div className="relative bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20 min-h-screen transition-colors">
      {/* Modern geometric background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-100 dark:bg-purple-900/30 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-100 dark:bg-blue-900/30 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-200 to-blue-200 dark:from-purple-800/30 dark:to-blue-800/30 rounded-full blur-3xl opacity-20"></div>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-purple-100 dark:border-purple-800 mb-8">
            <BiCloudUpload className="mr-2 text-purple-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Doküman Yükleme</span>
            <HiSparkles className="ml-2 text-purple-500" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animated-gradient-text">
            Doküman Yükle
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            PDF, DOCX veya TXT dosyanızı yükleyin ve saniyeler içinde <span className="font-semibold sparkle-text">interaktif quiz</span> oluşturun
          </p>
        </motion.div>

        {/* Upload Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-2xl shadow-purple-500/10 dark:shadow-purple-400/10"
        >
          <form onSubmit={handleSubmit} className="p-8">
            {/* File Drop Zone */}
            <motion.div 
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                isDragging 
                  ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-900/20 scale-105' 
                  : file 
                    ? 'border-green-300 dark:border-green-600 bg-green-50/50 dark:bg-green-900/20' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              whileHover={{ scale: file ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {!file ? (
                <div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center"
                  >
                    <BiCloudUpload className="text-3xl text-white" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Dosyanızı Sürükleyin
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
                    veya tıklayarak seçin
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Desteklenen formatlar: <span className="font-medium">PDF, DOCX, TXT</span> (Maks. 10MB)
                  </p>
                  
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileChange}
                  />
                  <motion.label
                    htmlFor="file-upload"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-2xl font-semibold cursor-pointer shadow-xl shadow-purple-500/25 transition-all"
                  >
                    <HiDocumentText className="mr-3 text-xl" />
                    Dosya Seç
                  </motion.label>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center flex-col md:flex-row gap-6"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                    <BiFile className="text-2xl text-white" />
                  </div>
                  <div className="text-center md:text-left flex-1">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{file.name}</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <motion.button 
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center transition-all"
                    onClick={() => setFile(null)}
                  >
                    <BiX className="text-xl" />
                  </motion.button>
                </motion.div>
              )}
            </motion.div>

            {/* Upload Progress */}
            {uploading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-6 bg-blue-50/50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <BiLoader className="w-6 h-6 text-blue-500 animate-spin mr-3" />
                    <span className="font-semibold text-blue-700 dark:text-blue-300">Yükleniyor...</span>
                  </div>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">%{uploadProgress}</span>
                </div>
                <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-3">
                  <motion.div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  ></motion.div>
                </div>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-6 bg-red-50/50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-700"
              >
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <BiX className="text-white text-sm" />
                  </div>
                  <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <div className="mt-8 flex justify-end">
              <motion.button
                type="submit"
                disabled={!file || uploading}
                whileHover={!file || uploading ? {} : { scale: 1.05 }}
                whileTap={!file || uploading ? {} : { scale: 0.95 }}
                className={`inline-flex items-center px-8 py-4 rounded-2xl font-semibold text-lg transition-all ${
                  !file || uploading
                    ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-xl shadow-purple-500/25'
                }`}
              >
                {uploading ? (
                  <>
                    <BiLoader className="mr-3 text-xl animate-spin" />
                    Yükleniyor...
                  </>
                ) : (
                  <>
                    <BiCloudUpload className="mr-3 text-xl" />
                    Yükle ve Soru Oluştur
                    <BiChevronRight className="ml-2 text-xl" />
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            { icon: HiSparkles, title: "Yapay Zeka", desc: "GPT teknolojisi ile akıllı soru üretimi" },
            { icon: BiUpload, title: "Kolay Yükleme", desc: "Sürükle-bırak ile hızlı dosya yükleme" },
            { icon: BiFile, title: "Çoklu Format", desc: "PDF, DOCX ve TXT dosya desteği" }
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-gray-700 text-center hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <feature.icon className="text-xl text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
} 