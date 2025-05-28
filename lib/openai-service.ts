import OpenAI from 'openai';

export interface QuestionOption {
  text: string;
}

export interface GeneratedQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

// OpenAI istemcisini oluştur - API key kontrolü ile
let openai: OpenAI | null = null;

try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
} catch (error) {
  console.warn('OpenAI API key bulunamadı veya geçersiz. Mock sorular kullanılacak.');
}

/**
 * Mock sorular oluşturur (OpenAI API olmadığında)
 */
function generateMockQuestions(content: string, count: number): GeneratedQuestion[] {
  const mockQuestions: GeneratedQuestion[] = [];
  
  for (let i = 0; i < Math.min(count, 3); i++) {
    mockQuestions.push({
      id: `mock-${Date.now()}-${i}`,
      question: `Bu metinle ilgili örnek soru ${i + 1}?`,
      options: [
        `Seçenek A - ${i + 1}`,
        `Seçenek B - ${i + 1}`,
        `Seçenek C - ${i + 1}`,
        `Seçenek D - ${i + 1}`
      ],
      correctAnswer: 0
    });
  }
  
  return mockQuestions;
}

/**
 * Verilen metin içeriğinden sorular oluşturur
 * @param content Metin içeriği
 * @param count Oluşturulacak soru sayısı (default: 5)
 * @returns Oluşturulan sorular
 */
export async function generateQuestions(content: string, count: number = 5): Promise<GeneratedQuestion[]> {
  // OpenAI API key yoksa mock sorular döndür
  if (!openai || !process.env.OPENAI_API_KEY) {
    console.warn('OpenAI API key bulunamadı. Mock sorular kullanılıyor.');
    return generateMockQuestions(content, count);
  }

  try {
    const prompt = `
      Aşağıdaki metni kullanarak ${count} adet çoktan seçmeli soru oluştur.
      Her soru için 4 seçenek oluştur ve doğru cevabın indeksini belirt (0'dan başlayarak).
      
      Cevabı aşağıdaki JSON formatında döndür:
      {
        "questions": [
          {
            "question": "Soru metni",
            "options": ["Seçenek 1", "Seçenek 2", "Seçenek 3", "Seçenek 4"],
            "correctAnswer": 0
          }
        ]
      }
      
      Metnin içeriği:
      ${content.substring(0, 3000)} // İlk 3000 karakterle sınırla
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Sen eğitim içeriklerinden Türkçe çoktan seçmeli sorular oluşturan bir AI asistansın. Yanıtını sadece JSON formatında ver."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });

    const responseContent = response.choices[0].message.content;
    if (!responseContent) {
      throw new Error('OpenAI API boş yanıt döndürdü');
    }

    const parsedResponse = JSON.parse(responseContent);
    const questions = parsedResponse.questions || parsedResponse || [];
    
    // Her soruya benzersiz bir ID ekleyelim
    return questions.map((q: any, index: number) => ({
      id: `q-${Date.now()}-${index}`,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer
    }));
  } catch (error) {
    console.error('OpenAI soru oluşturma hatası:', error);
    console.warn('OpenAI hatası nedeniyle mock sorular kullanılıyor.');
    return generateMockQuestions(content, count);
  }
} 