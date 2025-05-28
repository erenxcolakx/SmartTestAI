# SmartTest AI

AI destekli otomatik soru üretimi ve quiz çözme uygulaması.

## Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Environment değişkenlerini ayarlayın (.env.local dosyası oluşturun):

```env
# NextAuth.js
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# MongoDB - Atlas için (SSL sorunları için)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smarttestai?retryWrites=true&w=majority&ssl=true

# MongoDB - Local için (SSL sorunları olmadan)
# MONGODB_URI=mongodb://localhost:27017/smarttestai

# OpenAI
OPENAI_API_KEY=your-openai-api-key
```

## MongoDB SSL Hatası Çözümü

Eğer MongoDB bağlantısında SSL hatası alıyorsanız:

1. **MongoDB Atlas kullanıyorsanız:** Connection string'inizde `ssl=true` parametresinin olduğundan emin olun
2. **Local MongoDB kullanıyorsanız:** SSL olmadan bağlanmayı deneyin
3. **Firewall/Proxy sorunu:** Ağ bağlantınızı kontrol edin

## Özellikler

- 📄 Belge yükleme (PDF, DOCX, TXT)
- 🤖 AI destekli soru üretimi
- 📝 Interaktif quiz çözme
- 📊 Performans takibi
- 🔐 Güvenli kimlik doğrulama
- 💾 Veritabanı entegrasyonu

## Geliştirme

```bash
npm run dev
```

Uygulama http://localhost:3000 adresinde çalışacaktır.

## Teknolojiler

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Veritabanı:** MongoDB
- **Kimlik Doğrulama:** NextAuth.js
- **AI:** OpenAI GPT-3.5
- **Belge İşleme:** pdf-parse, mammoth

## Yapılandırma

### MongoDB Bağlantı Sorunları

SSL hatası alıyorsanız, connection string'inizi şu formatlardan biri ile deneyin:

```env
# Atlas (Önerilen)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db?retryWrites=true&w=majority&ssl=true&tlsAllowInvalidCertificates=true

# Local
MONGODB_URI=mongodb://localhost:27017/smarttestai
```

### Google OAuth Ayarları

1. Google Cloud Console'da yeni proje oluşturun
2. OAuth consent screen'i yapılandırın
3. Credentials bölümünden OAuth 2.0 Client ID oluşturun
4. Authorized redirect URIs'ye şunları ekleyin:
   - http://localhost:3000/api/auth/callback/google (development)
   - https://yourdomain.com/api/auth/callback/google (production)

## Deployment

### Vercel

1. Vercel'e deploy edin
2. Environment variables'ları ayarlayın
3. NEXTAUTH_URL'i production domain'iniz olarak güncelleyin

## Lisans

MIT License 