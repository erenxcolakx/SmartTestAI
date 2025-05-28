import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

interface Params {
  params: {
    id: string;
  };
}

// Belirli bir quizi getirir
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const id = params.id;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Geçersiz quiz ID' },
        { status: 400 }
      );
    }
    
    const collection = await getCollection('quizzes');
    const quiz = await collection.findOne({ _id: new ObjectId(id) });
    
    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz bulunamadı' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Quiz getirme hatası:', error);
    return NextResponse.json(
      { error: 'Quiz getirilirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// Quizi günceller
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const id = params.id;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Geçersiz quiz ID' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const { title, questions, lastTaken, score } = body;
    
    const collection = await getCollection('quizzes');
    
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (questions !== undefined) updateData.questions = questions;
    if (lastTaken !== undefined) updateData.lastTaken = new Date(lastTaken);
    if (score !== undefined) updateData.score = score;
    
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Quiz bulunamadı' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Quiz başarıyla güncellendi',
      updated: result.modifiedCount > 0
    });
  } catch (error) {
    console.error('Quiz güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Quiz güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// Quizi siler
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const id = params.id;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Geçersiz quiz ID' },
        { status: 400 }
      );
    }
    
    const collection = await getCollection('quizzes');
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Quiz bulunamadı veya silinemedi' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Quiz başarıyla silindi'
    });
  } catch (error) {
    console.error('Quiz silme hatası:', error);
    return NextResponse.json(
      { error: 'Quiz silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 