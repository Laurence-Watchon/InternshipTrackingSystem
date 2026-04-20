
import { connectDB } from '../server/db.js';

async function checkLogs() {
  try {
    const db = await connectDB();
    const logs = await db.collection("time_logs").find({}).toArray();
    console.log("Current Logs in DB:", JSON.stringify(logs, null, 2));
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

checkLogs();
