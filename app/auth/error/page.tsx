'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  useEffect(() => {
    const error = searchParams.get('error');
    let message = 'Kimlik doğrulama sırasında bir hata oluştu.';
    
    if (error === 'AccessDenied') {
      message = 'Erişim reddedildi. Giriş yapmak için yeterli izinlere sahip değilsiniz.';
    } else if (error === 'Configuration') {
      message = 'Kimlik doğrulama yapılandırma hatası. Lütfen yönetici ile iletişime geçin.';
    } else if (error === 'Verification') {
      message = 'Doğrulama hatası. Oturum süresi dolmuş olabilir veya bağlantı geçersiz.';
    } else if (error === 'OAuthSignin') {
      message = 'OAuth oturum açma hatası. Lütfen tekrar deneyin.';
    } else if (error === 'OAuthCallback') {
      message = 'OAuth geri çağrı hatası. Kimlik sağlayıcısı ile ilgili bir sorun olabilir.';
    } else if (error === 'OAuthAccountNotLinked') {
      message = 'Bu hesap zaten başka bir kimlik doğrulama yöntemi ile bağlantılı.';
    } else if (error === 'Callback') {
      message = 'Geri çağrı hatası. Yönlendirme sırasında bir sorun oluştu.';
    } else if (error === 'Default') {
      message = 'Bilinmeyen bir kimlik doğrulama hatası oluştu. Lütfen tekrar deneyin.';
    }
    
    setErrorMessage(message);
  }, [searchParams]);

  return (
    <div className="max-w-md mx-auto my-16">
      <div className="card bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400">
        <h1 className="text-2xl font-bold mb-4">Kimlik Doğrulama Hatası</h1>
        
        <p className="mb-6">
          {errorMessage}
        </p>
        
        <div className="flex justify-center">
          <Link href="/auth/signin" className="btn btn-primary">
            Giriş Sayfasına Dön
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthError() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  );
} 