'use client';

import { SessionProvider } from 'next-auth/react';
import { useState, useEffect } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // Sayfa yüklendiğinde dark mode'u kaldır
  useEffect(() => {
    setMounted(true);
    document.documentElement.classList.remove('dark');
  }, []);

  // Sayfa tamamen yüklenene kadar içeriği gösterme (hydration hatalarını önlemek için)
  if (!mounted) {
    return <SessionProvider>{children}</SessionProvider>;
  }

  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
} 