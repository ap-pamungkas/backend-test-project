import { MongoClient } from 'mongodb';
if (process.env.NODE_ENV !== 'production') {
  import('dotenv').then(dotenv => dotenv.config());
}

const client = new MongoClient(process.env.MONGO_URI);
let _db;
export async function connectDB() {
  await client.connect();
  _db = client.db();
  console.log('MongoDB connected');
}
export const getDB = () => _db;