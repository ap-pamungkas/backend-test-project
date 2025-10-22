import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();  
const client = new MongoClient(process.env.MONGO_URI);
let _db;

/*
  Connect to MongoDB
*/

export async function connectDB() {
  await client.connect();
  _db = client.db();
  console.log('MongoDB connected');
}
export const getDB = () => _db;