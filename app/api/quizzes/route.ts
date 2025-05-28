import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Quizleri listeler
export async function GET(request: NextRequest) {
  try {
    const collection = await getCollection('quizzes');
    
    // Quizleri en son oluşturulandan en eskiye doğru sırala
    const quizzes = await collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json(quizzes);
  } catch (error) {
    console.error('Quiz listeleme hatası:', error);
    return NextResponse.json(
      { error: 'Quizler listelenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// Yeni quiz oluşturur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, questions } = body;
    
    if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: 'Geçersiz quiz verisi. Başlık ve sorular gerekli.' },
        { status: 400 }
      );
    }
    
    const collection = await getCollection('quizzes');
    
    const quiz = {
      title,
      questions,
      createdAt: new Date(),
      lastTaken: null,
      score: null
    };
    
    const result = await collection.insertOne(quiz);
    
    return NextResponse.json({
      message: 'Quiz başarıyla oluşturuldu',
      _id: result.insertedId,
      ...quiz
    });
  } catch (error) {
    console.error('Quiz oluşturma hatası:', error);
    return NextResponse.json(
      { error: 'Quiz oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
} 