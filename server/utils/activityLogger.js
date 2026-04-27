import { ObjectId } from "mongodb";
import { connectDB } from "../db.js";

/**
 * Logs an activity for a student and keeps only the most recent 10.
 */
export const logActivity = async (studentId, activityData) => {
  try {
    const db = await connectDB();
    const sId = typeof studentId === 'string' ? new ObjectId(studentId) : studentId;

    // 1. Insert new activity
    await db.collection("activities").insertOne({
      studentId: sId,
      ...activityData,
      createdAt: new Date()
    });

    // 2. Fetch all activities for this student sorted by newest first
    const activities = await db.collection("activities")
      .find({ studentId: sId })
      .sort({ createdAt: -1 })
      .toArray();

    // 3. If more than 10, delete the excess ones
    if (activities.length > 10) {
      const idsToDelete = activities.slice(10).map(a => a._id);
      await db.collection("activities").deleteMany({
        _id: { $in: idsToDelete }
      });
    }
  } catch (err) {
    console.error("Error logging activity:", err);
  }
};
