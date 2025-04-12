import mongoose from "mongoose";
import process from "process";

const connectToDb = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error("❌ MongoDB URI is not defined in environment variables.");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB Database:", conn.connection.host);
  } catch (error) {
    console.error("❌ Error Connecting to Database:", error.message);
    process.exit(1);
  }
};

const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await connectToDb();
};

export default dbConnect;
