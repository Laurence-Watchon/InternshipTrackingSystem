import express from "express";
import { connectDB } from "../db.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// -----------------------------------------------
// GET /api/admin/pending
// Fetches all students requiring admin approval
// -----------------------------------------------
router.get("/pending", async (req, res) => {
  try {
    const { college } = req.query;

    const query = {
      role: "student",
      isVerified: false,
      isRejected: { $ne: true } // Exclude rejected students
    };

    if (college && college !== "All") {
      query.college = college;
    }

    const db = await connectDB();
    const pendingStudents = await db.collection("users").find(query).toArray();
    res.json(pendingStudents);
  } catch (err) {
    console.error("Error fetching pending students:", err);
    res.status(500).json({ error: "Failed to fetch pending students." });
  }
});

// -----------------------------------------------
// PUT /api/admin/approve/:id
// Approves a student registration
// -----------------------------------------------
router.put("/approve/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectDB();
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      { $set: { isVerified: true, updatedAt: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Student not found." });
    }
    
    res.json({ message: "Student approved successfully." });
  } catch (err) {
    console.error("Error approving student:", err);
    res.status(500).json({ error: "Failed to approve student." });
  }
});

// -----------------------------------------------
// PUT /api/admin/reject/:id
// Rejects a student registration (Soft Delete)
// -----------------------------------------------
router.put("/reject/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    if (!reason) {
      return res.status(400).json({ error: "Rejection reason is required." });
    }

    const db = await connectDB();
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      { $set: { 
          isRejected: true, 
          rejectionReason: reason,
          updatedAt: new Date() 
      } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Student not found." });
    }
    
    res.json({ message: "Student registration softly rejected." });
  } catch (err) {
    console.error("Error rejecting student:", err);
    res.status(500).json({ error: "Failed to reject student." });
  }
});

export default router;
