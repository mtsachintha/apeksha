import mongoose from 'mongoose';

const dbConnect = async () => {
  try {
    const uri = process.env.MONGODB_URI;  // Get the MongoDB URI from environment variable
    const dbName = process.env.MONGODB_DB;  // Get the DB name from environment variable
    
    if (!uri || !dbName) {
      throw new Error("MongoDB URI or DB name not provided in environment variables.");
    }

    if (mongoose.connections[0].readyState) {
      console.log("Already connected to the database");
      return;
    }

    // Connect to MongoDB using the URI and DB name from environment variables
    await mongoose.connect(uri + dbName, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`Connected to the ${dbName} database`);
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

export default dbConnect;
