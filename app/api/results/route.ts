import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Quiz sonuçlarını listeler
export async function GET(request: NextRequest) {
  try {
    const collection = await getCollection('results');
    
    // Sonuçları en yeniden en eskiye doğru sırala
    const results = await collection
      .find({})
      .sort({ date: -1 })
      .toArray();
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Sonuç listeleme hatası:', error);
    return NextResponse.json(
      { error: 'Sonuçlar listelenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// Yeni quiz sonucu kaydeder
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quizId, answers, timeSpent } = body;
    
    if (!quizId || !answers || !Array.isArray(answers) || timeSpent === undefined) {
      return NextResponse.json(
        { error: 'Geçersiz sonuç verisi. Quiz ID, cevaplar ve harcanan süre gerekli.' },
        { status: 400 }
      );
    }
    
    // Quiz'i bul
    const quizCollection = await getCollection('quizzes');
    let quiz;
    
    try {
      quiz = await quizCollection.findOne({ _id: new ObjectId(quizId) });
    } catch (error) {
      return NextResponse.json(
        { error: 'Geçersiz quiz ID' },
        { status: 400 }
      );
    }
    
    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz bulunamadı' },
        { status: 404 }
      );
    }
    
    // Doğru cevapları hesapla
    let correctCount = 0;
    for (let i = 0; i < answers.length; i++) {
      if (i < quiz.questions.length && answers[i] === quiz.questions[i].correctAnswer) {
        correctCount++;
      }
    }
    
    // Skoru hesapla
    const score = Math.round((correctCount / quiz.questions.length) * 100);
    
    // Sonucu kaydet
    const resultCollection = await getCollection('results');
    const result = {
      quizId: new ObjectId(quizId),
      score,
      answers,
      totalQuestions: quiz.questions.length,
      correctAnswers: correctCount,
      timeSpent,
      date: new Date()
    };
    
    const insertResult = await resultCollection.insertOne(result);
    
    // Quiz'i güncelle (son alınma tarihi ve skor)
    await quizCollection.updateOne(
      { _id: new ObjectId(quizId) },
      { 
        $set: { 
          lastTaken: new Date(),
          score
        } 
      }
    );
    
    return NextResponse.json({
      message: 'Sonuç başarıyla kaydedildi',
      _id: insertResult.insertedId,
      ...result,
      quizTitle: quiz.title
    });
  } catch (error) {
    console.error('Sonuç kaydetme hatası:', error);
    return NextResponse.json(
      { error: 'Sonuç kaydedilirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 