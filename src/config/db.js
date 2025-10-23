import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const client = new MongoClient(process.env.MONGO_URI);
let _db;

/*
  Connect to MongoDB
*/

export async function connectDB() {
  if (client.topology && client.topology.isConnected()) return; // Already connected

  await client.connect();
  _db = client.db(); // CLEANUP: Drop database  when testing
  if (process.env.NODE_ENV === "test") {
    await _db.dropDatabase();
  }
  console.log("MongoDB connected");
}

/*
  Disconnect from MongoDB 
*/
export async function disconnectDB() {
  if (client.topology && client.topology.isConnected()) {
    await client.close();
    _db = null;
    console.log("MongoDB disconnected");
  }
}

export const getDB = () => _db;
