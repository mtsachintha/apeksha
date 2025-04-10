import mongoose from 'mongoose';

// Connection caching
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // Check for required environment variables
  const MONGODB_URI = process.env.MONGODB_URI;
  const MONGODB_DB = process.env.MONGODB_DB;

  if (!MONGODB_URI) {
    throw new Error('Please define MONGODB_URI environment variable');
  }
  if (!MONGODB_DB) {
    throw new Error('Please define MONGODB_DB environment variable');
  }

  // If already connected in cached connection
  if (cached.conn) {
    console.log('Using existing database connection');
    return cached.conn;
  }

  // If no connection promise exists, create one
  if (!cached.promise) {
    const opts = {
      dbName: MONGODB_DB,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then(mongoose => {
      console.log(`Connected to ${MONGODB_DB} database`);
      return mongoose;
    }).catch(err => {
      console.error('Database connection failed:', err);
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    // Reset cached promise on error to allow retries
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

export default dbConnect;