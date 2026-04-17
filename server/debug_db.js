import { connectDB } from "./db.js";

async function debugData() {
  const db = await connectDB();
  console.log("--- Endorsement Requests ---");
  const requests = await db.collection("endorsement_requests").find().toArray();
  console.log(JSON.stringify(requests, null, 2));

  console.log("--- Users ---");
  const users = await db.collection("users").find().toArray();
  console.log(JSON.stringify(users, null, 2));

  process.exit(0);
}

debugData();
