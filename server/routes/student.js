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
    const requirements = await db.collection("requirements")
      .find({ college })
      .sort({ createdAt: 1 })
      .toArray();

    // Filter by course if requirement has course restrictions
    const { course } = req.query;
    const filteredRequirements = requirements.filter(req =>
      !req.course || req.course.length === 0 || (course && req.course.includes(course))
    );

    res.json(filteredRequirements);
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
    const fileExtension = req.file.originalname.split('.').pop().toLowerCase();
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension);

    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: isImage ? "image" : "raw",
            folder: "internship_submissions"
          },
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
      status: "submitted",
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
// GET /api/student/pending-requirements-count
// Returns how many requirements the student needs to upload or fix
// -----------------------------------------------
router.get("/pending-requirements-count", async (req, res) => {
  try {
    const { studentId, college, course } = req.query;
    if (!studentId || !college) {
      return res.status(400).json({ error: "studentId and college are required." });
    }

    const db = await connectDB();

    // 1. Fetch all requirements for the college
    const requirements = await db.collection("requirements")
      .find({ college })
      .toArray();

    // 2. Filter requirements specifically for their course (if criteria exists)
    const relevantRequirements = requirements.filter(req =>
      !req.course || req.course.length === 0 || (course && req.course.includes(course))
    );

    // 3. Fetch student's submissions
    const submissions = await db.collection("submissions")
      .find({ studentId: new ObjectId(studentId) })
      .toArray();

    // 4. Count "To Do" items: No submission OR status is 'rejected'
    let count = 0;
    relevantRequirements.forEach(req => {
      const sub = submissions.find(s => s.requirementId.toString() === req._id.toString());
      if (!sub || sub.status === "rejected") {
        count++;
      }
    });

    res.json({ count });
  } catch (err) {
    console.error("Error fetching pending requirements count:", err);
    res.status(500).json({ error: "Failed to fetch count." });
  }
});

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
