import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from './components/Header';
import Footer from './components/Footer';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SmartTest AI | Akıllı Sınav Oluşturma Platformu',
  description: 'Dokümanlarınızdan otomatik quiz oluşturun, öğrenmeyi hızlandırın ve bilginizi ölçün.',
  icons: {
    icon: [
      { url: '/logotp.png', sizes: '32x32', type: 'image/png' },
      { url: '/logotp.png', type: 'image/png' },
    ],
    apple: { url: '/logotp.png', type: 'image/png' },
  },
  authors: [{ name: 'SmartTest AI Team' }],
  keywords: ['quiz', 'yapay zeka', 'AI', 'öğrenme', 'sınav', 'test', 'eğitim'],
  creator: 'SmartTest AI',
  publisher: 'SmartTest AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="dark">
      <head>
        <link rel="icon" href="/logotp.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logotp.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className={`${inter.className} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
} 