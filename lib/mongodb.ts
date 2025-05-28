import { MongoClient, Db } from 'mongodb';

// MongoDB bağlantı URL'si ve SSL ayarları
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smarttest';

// MongoDB istemci seçenekleri - SSL sorunları için
const mongoOptions = {
  // SSL/TLS ayarları
  ssl: true,
  tls: true,
  tlsAllowInvalidCertificates: true, // Geliştirme için
  tlsAllowInvalidHostnames: true,    // Geliştirme için
  
  // Bağlantı ayarları
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 10000,
  
  // Retry ayarları
  retryWrites: true,
  retryReads: true,
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

// NextAuth.js için ClientPromise
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