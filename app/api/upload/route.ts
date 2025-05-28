import { NextRequest, NextResponse } from 'next/server';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';

// Geçici dosyaları saklamak için dizin oluştur
const UPLOAD_DIR = join(process.cwd(), 'tmp/uploads');

if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Dosya bulunamadı' },
        { status: 400 }
      );
    }

    // Dosya tipini kontrol et
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Geçersiz dosya tipi. Sadece PDF, DOCX ve TXT dosyaları desteklenir.' },
        { status: 400 }
      );
    }

    // Dosya boyutunu kontrol et (10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Dosya çok büyük. Maksimum dosya boyutu 10MB.' },
        { status: 400 }
      );
    }

    // Dosyayı kaydet
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${randomUUID()}-${file.name}`;
    const filePath = join(UPLOAD_DIR, fileName);
    
    writeFileSync(filePath, buffer);

    return NextResponse.json({
      message: 'Dosya başarıyla yüklendi',
      fileName,
      filePath,
      originalName: file.name,
      type: file.type,
      size: file.size
    });
  } catch (error) {
    console.error('Dosya yükleme hatası:', error);
    return NextResponse.json(
      { error: 'Dosya yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 