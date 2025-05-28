'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';

export default function SignIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl: '/quizzes' });
    } catch (error) {
      console.error('Oturum açma hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-16">
      <div className="card text-center">
        <h1 className="text-3xl font-bold mb-8">SmartTest AI'a Hoş Geldiniz</h1>
        
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Dokümanlarınızdan akıllı testler oluşturmak için lütfen giriş yapın.
        </p>
        
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="flex items-center justify-center w-full py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          {isLoading ? (
            <span className="animate-spin mr-2">⏳</span>
          ) : (
            <FcGoogle className="w-5 h-5 mr-2" />
          )}
          Google ile Giriş Yap
        </button>
        
        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          Giriş yaparak, <a href="/terms" className="text-primary-600 dark:text-primary-400 hover:underline">Kullanım Şartlarını</a> ve <a href="/privacy" className="text-primary-600 dark:text-primary-400 hover:underline">Gizlilik Politikasını</a> kabul etmiş olursunuz.
        </div>
      </div>
    </div>
  );
} 