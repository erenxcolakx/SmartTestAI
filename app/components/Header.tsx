import Link from 'next/link';
import { BsLightbulbFill } from 'react-icons/bs';

export default function Header() {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <BsLightbulbFill className="h-8 w-8 text-primary-500" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">SmartTest AI</span>
            </Link>
          </div>
          <nav className="flex space-x-4">
            <Link 
              href="/upload" 
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Upload
            </Link>
            <Link 
              href="/quizzes" 
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              My Quizzes
            </Link>
            <Link 
              href="/performance" 
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Performance
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
} 