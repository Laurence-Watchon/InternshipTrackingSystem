import express from "express";
import { connectDB } from "../db.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// -----------------------------------------------
// GET /api/student/requirements
// Fetches all requirements for the student's college
// -----------------------------------------------
router.get("/requirements", async (req, res) => {
  try {
    const { college, course } = req.query;
    if (!college) return res.status(400).json({ error: "College is required." });

    const db = await connectDB();
    const query = { college };
    
    // If course is provided, filter: show if course matches OR if requirements apply to all (empty array)
    if (course) {
      query.$or = [
        { course: { $size: 0 } },
        { course: course }
      ];
    }

    const requirements = await db.collection("requirements")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    res.json(requirements);
  } catch (err) {
    console.error("Error fetching student requirements:", err);
    res.status(500).json({ error: "Failed to fetch requirements." });
  }
});

// -----------------------------------------------
// POST /api/student/submissions
// Submits a document for a requirement
// -----------------------------------------------
router.post("/submissions", async (req, res) => {
  try {
    const { requirementId, studentId, college, course, fileName, fileUrl } = req.body;

    if (!requirementId || !studentId || !fileUrl) {
      return res.status(400).json({ error: "requirementId, studentId, and fileUrl are required." });
    }

    const db = await connectDB();
    const submission = {
      requirementId: new ObjectId(requirementId),
      studentId: new ObjectId(studentId),
      college,
      course,
      fileName,
      fileUrl,
      status: "pending",
      submittedAt: new Date(),
      updatedAt: new Date()
    };

    // Use upsert or check if already exists to prevent duplicate submissions for the same requirement
    const result = await db.collection("submissions").replaceOne(
      { requirementId: new ObjectId(requirementId), studentId: new ObjectId(studentId) },
      submission,
      { upsert: true }
    );

    res.status(201).json({
      message: "Submission successful.",
      id: result.upsertedId || result.matchedCount
    });
  } catch (err) {
    console.error("Error creating submission:", err);
    res.status(500).json({ error: "Failed to submit document." });
  }
});

// -----------------------------------------------
// GET /api/student/my-submissions
// Fetches all submissions for the student
// -----------------------------------------------
router.get("/my-submissions", async (req, res) => {
  try {
    const { studentId } = req.query;

    if (!studentId) {
      return res.status(400).json({ error: "studentId is required." });
    }

    const db = await connectDB();
    const submissions = await db.collection("submissions")
      .find({ studentId: new ObjectId(studentId) })
      .toArray();

    res.json(submissions);
  } catch (err) {
    console.error("Error fetching my submissions:", err);
    res.status(500).json({ error: "Failed to fetch submissions." });
  }
});

// -----------------------------------------------
// GET /api/student/college-settings
// Fetches settings (like required hours) for the student's college
// -----------------------------------------------
router.get("/college-settings", async (req, res) => {
  try {
    const { college } = req.query;
    if (!college) return res.status(400).json({ error: "College is required." });

    const db = await connectDB();
    const settings = await db.collection("college_settings").findOne({
      college: { $regex: new RegExp(`^${college.trim()}$`, "i") }
    });

    res.json(settings || { college, requiredHours: {} });
  } catch (err) {
    console.error("Error fetching college settings for student:", err);
    res.status(500).json({ error: "Failed to fetch settings." });
  }
});

export default router;
