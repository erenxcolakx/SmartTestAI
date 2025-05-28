import OpenAI from 'openai';

// OpenAI istemcisini oluştur
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface QuestionOption {
  text: string;
}

export interface GeneratedQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

/**
 * Verilen metin içeriğinden sorular oluşturur
 * @param content Metin içeriği
 * @param count Oluşturulacak soru sayısı (default: 5)
 * @returns Oluşturulan sorular
 */
export async function generateQuestions(content: string, count: number = 5): Promise<GeneratedQuestion[]> {
  try {
    const prompt = `
      Aşağıdaki metni kullanarak ${count} adet çoktan seçmeli soru oluştur.
      Her soru için 4 seçenek oluştur ve doğru cevabın indeksini belirt (0'dan başlayarak).
      
      Cevabı aşağıdaki JSON formatında döndür:
      [
        {
          "question": "Soru metni",
          "options": ["Seçenek 1", "Seçenek 2", "Seçenek 3", "Seçenek 4"],
          "correctAnswer": 0 // doğru cevabın indeksi (0-3 arası)
        }
      ]
      
      Metnin içeriği:
      ${content}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Sen eğitim içeriklerinden çoktan seçmeli sorular oluşturan bir AI asistansın."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const responseContent = response.choices[0].message.content;
    if (!responseContent) {
      throw new Error('OpenAI API boş yanıt döndürdü');
    }

    const parsedResponse = JSON.parse(responseContent);
    
    // Her soruya benzersiz bir ID ekleyelim
    return parsedResponse.map((q: any, index: number) => ({
      id: `q-${Date.now()}-${index}`,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer
    }));
  } catch (error) {
    console.error('Soru oluşturma hatası:', error);
    throw new Error('Sorular oluşturulurken bir hata meydana geldi');
  }
} 