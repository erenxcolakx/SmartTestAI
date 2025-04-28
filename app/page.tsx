import Link from 'next/link';
import { BiUpload, BiTestTube, BiLineChart } from 'react-icons/bi';

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center py-12">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to SmartTest AI
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Upload your documents and generate AI-powered quizzes to test your knowledge instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
        <div className="card flex flex-col items-center text-center">
          <BiUpload className="w-16 h-16 text-primary-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Upload Documents</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Upload your .pdf, .docx, or .txt files to get started. We support documents up to 10MB.
          </p>
          <Link href="/upload" className="btn btn-primary mt-auto">
            Upload Now
          </Link>
        </div>

        <div className="card flex flex-col items-center text-center">
          <BiTestTube className="w-16 h-16 text-primary-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Generate Quizzes</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Our AI automatically generates relevant questions from your content for effective learning.
          </p>
          <Link href="/quizzes" className="btn btn-primary mt-auto">
            My Quizzes
          </Link>
        </div>

        <div className="card flex flex-col items-center text-center">
          <BiLineChart className="w-16 h-16 text-primary-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Track Performance</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Review your quiz results and track your progress over time to improve your knowledge.
          </p>
          <Link href="/performance" className="btn btn-primary mt-auto">
            View Performance
          </Link>
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-8 text-white shadow-lg my-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to test your knowledge?</h2>
          <p className="text-lg mb-6">
            Start by uploading your study material and let SmartTest AI generate personalized questions for you.
          </p>
          <Link href="/upload" className="inline-block bg-white text-primary-600 font-semibold px-6 py-3 rounded-md hover:bg-gray-100 transition-colors">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
} 