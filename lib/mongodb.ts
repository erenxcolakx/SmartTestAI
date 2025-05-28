import { MongoClient, Db } from 'mongodb';

// MongoDB bağlantı URL'si - güvenli fallback ile
let MONGODB_URI: string = process.env.MONGODB_URI || '';

// Environment variable kontrolü ve geçerli fallback
if (!MONGODB_URI || MONGODB_URI.trim() === '' || (!MONGODB_URI.startsWith('mongodb://') && !MONGODB_URI.startsWith('mongodb+srv://'))) {
  console.warn('MONGODB_URI environment variable is not set or invalid, using default local connection');
  MONGODB_URI = 'mongodb://localhost:27017/smarttest';
}

// MongoDB bağlantı türünü kontrol et
const isAtlas = MONGODB_URI.includes('mongodb+srv');
const isLocal = MONGODB_URI.includes('localhost') || MONGODB_URI.includes('127.0.0.1');

// MongoDB istemci seçenekleri - basitleştirilmiş
const mongoOptions = {
  // Bağlantı ayarları
  connectTimeoutMS: 30000,
  socketTimeoutMS: 60000,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 30000,
  heartbeatFrequencyMS: 10000,
  
  // Retry ayarları
  retryWrites: true,
  retryReads: true,
  
  // TLS ayarları - sadece gerektiğinde
  ...(isAtlas && {
    // Atlas için TLS zaten otomatik aktif, ekstra ayar gerekmez
  }),
  
  ...(isLocal && {
    // Local için TLS'i kapat
    tls: false,
  }),
};

// Global değişkenler
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

// Global namespace için type declaration
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

/**
 * MongoDB veritabanına bağlanır
 */
export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  // Eğer istemci ve veritabanı önbellekte varsa, onları döndür
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    // Yeni bir bağlantı oluştur
    const client = new MongoClient(MONGODB_URI, mongoOptions);
    await client.connect();
    
    // Bağlantıyı test et
    await client.db().admin().ping();
    
    const db = client.db();

    // Bağlantıyı önbelleğe al
    cachedClient = client;
    cachedDb = db;

    console.log('MongoDB bağlantısı başarılı');
    return { client, db };
  } catch (error) {
    console.error('MongoDB bağlantı hatası:', error);
    throw error;
  }
}

/**
 * Veritabanı koleksiyonunu döndürür
 * @param collectionName Koleksiyon adı
 */
export async function getCollection(collectionName: string) {
  const { db } = await connectToDatabase();
  return db.collection(collectionName);
}

// NextAuth.js için ClientPromise - basitleştirilmiş
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // Geliştirme ortamında, global değişken kullan
  if (!global._mongoClientPromise) {
    const client = new MongoClient(MONGODB_URI, mongoOptions);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // Üretim ortamında yeni bağlantı oluştur
  const client = new MongoClient(MONGODB_URI, mongoOptions);
  clientPromise = client.connect();
}

export { clientPromise }; 