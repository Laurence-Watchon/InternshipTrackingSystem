import { MongoClient } from "mongodb";
/* eslint-env node */
import dotenv from "dotenv";
dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);
let db;

export async function connectDB() {
  if (db) return db;
  await client.connect();
  db = client.db(process.env.DB_NAME);
  console.log("✅ Connected to MongoDB");
  return db;
}