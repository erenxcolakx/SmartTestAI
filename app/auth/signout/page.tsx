'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignOut() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Oturum kapatma hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="max-w-md mx-auto my-16">
      <div className="card text-center">
        <h1 className="text-2xl font-bold mb-6">Çıkış Yapmak İstiyor musunuz?</h1>
        
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Oturumunuzu kapatmak üzeresiniz. Çıkış yapmak istediğinizden emin misiniz?
        </p>
        
        <div className="flex space-x-4">
          <button
            onClick={handleCancel}
            className="flex-1 btn btn-secondary"
          >
            İptal
          </button>
          
          <button
            onClick={handleSignOut}
            disabled={isLoading}
            className="flex-1 btn btn-primary"
          >
            {isLoading ? 'Çıkış Yapılıyor...' : 'Çıkış Yap'}
          </button>
        </div>
      </div>
    </div>
  );
} 