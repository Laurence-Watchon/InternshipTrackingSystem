import express from "express";
import { connectDB } from "../db.js";
import { ObjectId } from "mongodb";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

const router = express.Router();

// Multer setup for memory storage (direct to Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// -----------------------------------------------
// GET /api/student/requirements
// Fetches all requirements for the student's college
// -----------------------------------------------
router.get("/requirements", async (req, res) => {
  try {
    const { college } = req.query;
    if (!college) return res.status(400).json({ error: "College is required." });

    const db = await connectDB();
    const query = { college };

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
// POST /api/student/upload
// Uploads a file to Cloudinary and returns the secure URL
// -----------------------------------------------
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    // Use a stream to upload the buffer to Cloudinary
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "auto", folder: "internship_submissions" },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);
    res.json({
      secure_url: result.secure_url,
      public_id: result.public_id,
      fileName: req.file.originalname
    });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    res.status(500).json({ error: "Failed to upload file to Cloudinary." });
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
