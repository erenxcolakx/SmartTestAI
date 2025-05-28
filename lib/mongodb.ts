import { MongoClient, Db } from 'mongodb';

// MongoDB bağlantı URL'si ve SSL ayarları
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smarttest';

// MongoDB istemci seçenekleri - SSL sorunları için daha agresif ayarlar
const mongoOptions = {
  // SSL/TLS ayarları - daha esnek
  tls: false, // TLS'i kapat
  ssl: false, // SSL'i kapat
  
  // Eğer cloud MongoDB kullanıyorsa bu ayarları kullan
  ...(MONGODB_URI.includes('mongodb+srv') && {
    tls: true,
    ssl: true,
    tlsAllowInvalidCertificates: true,
    tlsAllowInvalidHostnames: true,
  }),
  
  // Bağlantı ayarları
  connectTimeoutMS: 30000,
  socketTimeoutMS: 60000,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 30000,
  heartbeatFrequencyMS: 10000,
  
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
    
    // SSL hatası varsa farklı deneme yap
    if (error instanceof Error && error.message && error.message.includes('SSL')) {
      console.log('SSL hatası algılandı, SSL olmadan deneniyor...');
      try {
        const clientNoSSL = new MongoClient(MONGODB_URI, {
          ...mongoOptions,
          tls: false,
          ssl: false,
        });
        await clientNoSSL.connect();
        const db = clientNoSSL.db();
        
        cachedClient = clientNoSSL;
        cachedDb = db;
        
        console.log('MongoDB bağlantısı SSL olmadan başarılı');
        return { client: clientNoSSL, db };
      } catch (retryError) {
        console.error('SSL olmadan da bağlantı başarısız:', retryError);
        throw retryError;
      }
    }
    
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

// NextAuth.js için ClientPromise - SSL sorunları için özel ayar
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // Geliştirme ortamında, global değişken kullan
  if (!global._mongoClientPromise) {
    const client = new MongoClient(MONGODB_URI, mongoOptions);
    global._mongoClientPromise = client.connect().catch(async (error: unknown) => {
      // SSL hatası varsa retry
      if (error instanceof Error && error.message && error.message.includes('SSL')) {
        console.log('NextAuth SSL hatası, SSL olmadan deneniyor...');
        const clientNoSSL = new MongoClient(MONGODB_URI, {
          ...mongoOptions,
          tls: false,
          ssl: false,
        });
        return clientNoSSL.connect();
      }
      throw error;
    });
  }
  clientPromise = global._mongoClientPromise;
} else {
  // Üretim ortamında yeni bağlantı oluştur
  const client = new MongoClient(MONGODB_URI, mongoOptions);
  clientPromise = client.connect().catch(async (error: unknown) => {
    // SSL hatası varsa retry
    if (error instanceof Error && error.message && error.message.includes('SSL')) {
      console.log('Production NextAuth SSL hatası, SSL olmadan deneniyor...');
      const clientNoSSL = new MongoClient(MONGODB_URI, {
        ...mongoOptions,
        tls: false,
        ssl: false,
      });
      return clientNoSSL.connect();
    }
    throw error;
  });
}

export { clientPromise }; 