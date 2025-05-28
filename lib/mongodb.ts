import { MongoClient, Db } from 'mongodb';

// MongoDB bağlantı URL'si
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smarttest';

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

  // Yeni bir bağlantı oluştur
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db();

  // Bağlantıyı önbelleğe al
  cachedClient = client;
  cachedDb = db;

  return { client, db };
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
    const client = new MongoClient(MONGODB_URI);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // Üretim ortamında yeni bağlantı oluştur
  const client = new MongoClient(MONGODB_URI);
  clientPromise = client.connect();
}

export { clientPromise }; 