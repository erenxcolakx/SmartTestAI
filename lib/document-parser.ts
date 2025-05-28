import { readFileSync } from 'fs';
import { extname } from 'path';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

/**
 * Farklı dosya tiplerinden metin çıkaran fonksiyon
 * @param filePath Dosya yolu
 * @returns Metin içeriği
 */
export async function parseDocument(filePath: string): Promise<string> {
  const fileExtension = extname(filePath).toLowerCase();
  
  try {
    switch (fileExtension) {
      case '.pdf':
        return await parsePdf(filePath);
      
      case '.docx':
        return await parseDocx(filePath);
      
      case '.txt':
        return parseTxt(filePath);
      
      default:
        throw new Error(`Desteklenmeyen dosya uzantısı: ${fileExtension}`);
    }
  } catch (error) {
    console.error('Doküman işleme hatası:', error);
    throw new Error('Doküman içeriği çıkarılırken bir hata oluştu');
  }
}

/**
 * PDF dosyasından metin çıkarır
 */
async function parsePdf(filePath: string): Promise<string> {
  const dataBuffer = readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}

/**
 * DOCX dosyasından metin çıkarır
 */
async function parseDocx(filePath: string): Promise<string> {
  const result = await mammoth.extractRawText({
    path: filePath
  });
  return result.value;
}

/**
 * TXT dosyasından metin çıkarır
 */
function parseTxt(filePath: string): string {
  return readFileSync(filePath, 'utf8');
}

/**
 * Metin içeriğini temizleyip hazırlar
 * @param text Ham metin
 * @returns Temizlenmiş metin
 */
export function cleanText(text: string): string {
  // Gereksiz boşlukları temizle
  let cleaned = text.replace(/\s+/g, ' ');
  
  // Özel karakterleri temizle
  cleaned = cleaned.replace(/[^\w\s.,?!;:()'"]/g, '');
  
  // Çok uzun metinleri kısalt (OpenAI API limitleri için)
  const maxLength = 8000; // OpenAI'nin token limitleri nedeniyle
  if (cleaned.length > maxLength) {
    cleaned = cleaned.substring(0, maxLength);
  }
  
  return cleaned.trim();
} 