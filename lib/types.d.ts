declare module 'pdf-parse';

interface Quiz {
  _id?: string;
  title: string;
  questions: Question[];
  createdAt: Date;
  lastTaken?: Date;
  score?: number;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizResult {
  _id?: string;
  quizId: string;
  score: number;
  answers: number[];
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // saniye cinsinden
  date: Date;
} 