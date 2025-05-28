import { NextRequest, NextResponse } from 'next/server';
import { existsSync } from 'fs';
import { join } from 'path';
import { parseDocument, cleanText } from '@/lib/document-parser';
import { generateQuestions } from '@/lib/openai-service';

const UPLOAD_DIR = join(process.cwd(), 'tmp/uploads');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileName } = body;

    if (!fileName) {
      return NextResponse.json(
        { error: 'Dosya adı gerekli' },
        { status: 400 }
      );
    }

    const filePath = join(UPLOAD_DIR, fileName);
    
    // Dosyanın varlığını kontrol et
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Dosya bulunamadı' },
        { status: 404 }
      );
    }

    // Dosyadan metni çıkar
    const text = await parseDocument(filePath);
    
    // Metni temizle
    const cleanedText = cleanText(text);
    
    // Sorular oluştur (maksimum 10 soru)
    const count = Math.min(10, parseInt(request.nextUrl.searchParams.get('count') || '5', 10));
    const questions = await generateQuestions(cleanedText, count);

    return NextResponse.json({
      message: 'Sorular başarıyla oluşturuldu',
      questions,
      count: questions.length
    });
  } catch (error: any) {
    console.error('Soru oluşturma hatası:', error);
    return NextResponse.json(
      { error: error.message || 'Sorular oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
} 