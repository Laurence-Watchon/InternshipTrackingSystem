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
      {
        $set: {
          isRejected: true,
          rejectionReason: reason,
          updatedAt: new Date()
        }
      }
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

// -----------------------------------------------
// POST /api/admin/requirements
// Creates a new internship requirement
// -----------------------------------------------
router.post("/requirements", async (req, res) => {
  try {
    const { title, description, acceptedFileTypes, college, adminId } = req.body;

    if (!title || !college || !adminId) {
      return res.status(400).json({ error: "Title, college, and adminId are required." });
    }

    const db = await connectDB();
    const requirement = {
      title,
      description,
      acceptedFileTypes: acceptedFileTypes || [],
      college,
      adminId: new ObjectId(adminId),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection("requirements").insertOne(requirement);
    res.status(201).json({ message: "Requirement created successfully.", id: result.insertedId });
  } catch (err) {
    console.error("Error creating requirement:", err);
    res.status(500).json({ error: "Failed to create requirement." });
  }
});

// -----------------------------------------------
// PUT /api/admin/requirements/:id
// Updates an internship requirement
// -----------------------------------------------
router.put("/requirements/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, acceptedFileTypes } = req.body;

    const db = await connectDB();
    const result = await db.collection("requirements").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          description,
          acceptedFileTypes: acceptedFileTypes || [],
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Requirement not found." });
    }

    res.json({ message: "Requirement updated successfully." });
  } catch (err) {
    console.error("Error updating requirement:", err);
    res.status(500).json({ error: "Failed to update requirement." });
  }
});

// -----------------------------------------------
// GET /api/admin/requirements
// Fetches all requirements for a specific college
// -----------------------------------------------
router.get("/requirements", async (req, res) => {
  try {
    const { college } = req.query;

    if (!college) {
      return res.status(400).json({ error: "College is required." });
    }

    const db = await connectDB();
    const requirements = await db.collection("requirements")
      .find({ college })
      .sort({ createdAt: 1 })
      .toArray();

    res.json(requirements);
  } catch (err) {
    console.error("Error fetching requirements:", err);
    res.status(500).json({ error: "Failed to fetch requirements." });
  }
});

// -----------------------------------------------
// DELETE /api/admin/requirements/:id
// Deletes an internship requirement
// -----------------------------------------------
router.delete("/requirements/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectDB();
    const result = await db.collection("requirements").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Requirement not found." });
    }

    res.json({ message: "Requirement deleted successfully." });
  } catch (err) {
    console.error("Error deleting requirement:", err);
    res.status(500).json({ error: "Failed to delete requirement." });
  }
});

// -----------------------------------------------
// GET /api/admin/students
// Fetches all verified students for a specific college
// -----------------------------------------------
router.get("/students", async (req, res) => {
  try {
    const { college } = req.query;

    if (!college) {
      return res.status(400).json({ error: "College is required." });
    }

    const db = await connectDB();

    // 1. Fetch all verified students in the college
    const students = await db.collection("users").find({
      role: "student",
      isVerified: true,
      college: college
    }).toArray();

    // 2. Fetch all requirements for the college
    const requirements = await db.collection("requirements")
      .find({ college })
      .toArray();

    // 3. Fetch all submissions for the college
    const submissions = await db.collection("submissions")
      .find({ college })
      .toArray();

    // 4. Map students to include requirement stats
    const studentsWithStats = students.map(student => {
      // Filter requirements that apply to this specific student's course
      const relevantRequirements = requirements.filter(req =>
        !req.course || req.course.length === 0 || (student.course && req.course.includes(student.course))
      );

      // Count non-rejected submissions
      const studentSubmissions = submissions.filter(s =>
        s.studentId.toString() === student._id.toString()
      );

      const completedRequirementsEntries = relevantRequirements.filter(req => {
        const sub = studentSubmissions.find(s => s.requirementId.toString() === req._id.toString());
        return sub && sub.status !== "rejected";
      });

      const requirementsCompleted = completedRequirementsEntries.length;
      const completedRequirementsTitles = completedRequirementsEntries.map(req => req.title);

      return {
        ...student,
        id: student._id,
        fullName: `${student.firstName} ${student.lastName}`,
        requirementsCompleted,
        totalRequirements: relevantRequirements.length,
        completedRequirements: completedRequirementsTitles
      };
    });

    res.json(studentsWithStats);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ error: "Failed to fetch students." });
  }
});

// -----------------------------------------------
// GET /api/admin/requirements/:id/submissions
// Fetches all submissions for a specific requirement
// -----------------------------------------------
router.get("/requirements/:id/submissions", async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectDB();
    const submissions = await db.collection("submissions")
      .find({ requirementId: new ObjectId(id) })
      .toArray();
    res.json(submissions);
  } catch (err) {
    console.error("Error fetching submissions:", err);
    res.status(500).json({ error: "Failed to fetch submissions." });
  }
});

// -----------------------------------------------
// PATCH /api/admin/submissions/:id
// Updates a submission status and feedback
// -----------------------------------------------
router.patch("/submissions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, feedback } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required." });
    }

    const db = await connectDB();
    const result = await db.collection("submissions").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, feedback, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Submission not found." });
    }

    res.json({ message: "Submission updated successfully." });
  } catch (err) {
    console.error("Error updating submission:", err);
    res.status(500).json({ error: "Failed to update submission." });
  }
});

// -----------------------------------------------
// GET /api/admin/students-monitoring
// Fetches all students with their submission status for all requirements
// -----------------------------------------------
router.get("/students-monitoring", async (req, res) => {
  try {
    const { college } = req.query;

    if (!college) {
      return res.status(400).json({ error: "College is required." });
    }

    const db = await connectDB();

    // 1. Fetch all verified students in the college
    const students = await db.collection("users")
      .find({ role: "student", isVerified: true, college })
      .toArray();

    // 2. Fetch all requirements for the college
    const requirements = await db.collection("requirements")
      .find({ college })
      .toArray();

    // 3. Fetch all submissions for these requirements
    const submissions = await db.collection("submissions")
      .find({ college })
      .toArray();

    // Map data for monitoring
    const monitoringData = students.map(student => {
      // Filter requirements that apply to this specific student
      const relevantRequirements = requirements.filter(req =>
        !req.course || req.course.length === 0 || req.course.includes(student.course)
      );

      const studentSubmissions = relevantRequirements.map(req => {
        const submission = submissions.find(s =>
          s.studentId.toString() === student._id.toString() &&
          s.requirementId.toString() === req._id.toString()
        );
        return {
          requirementId: req._id,
          requirementTitle: req.title,
          requirementDescription: req.description || "No description provided.",
          status: submission ? submission.status : "not-submitted",
          submissionId: submission ? submission._id : null,
          fileUrl: submission ? submission.fileUrl : null,
          fileName: submission ? submission.fileName : null,
          submittedAt: submission ? submission.submittedAt : null,
          feedback: submission ? submission.feedback : null,
          updatedAt: submission ? submission.updatedAt : null
        };
      });

      return {
        studentId: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        studentNumber: student.studentNumber,
        email: student.email,
        course: student.course,
        submissions: studentSubmissions
      };
    });

    res.json(monitoringData);
  } catch (err) {
    console.error("Error fetching monitoring data:", err);
    res.status(500).json({ error: "Failed to fetch monitoring data." });
  }
});

// -----------------------------------------------
// GET /api/admin/college-settings
// Fetches settings (like required hours) for a college
// -----------------------------------------------
router.get("/college-settings", async (req, res) => {
  try {
    const { college } = req.query;
    if (!college) return res.status(400).json({ error: "College is required." });

    const db = await connectDB();
    const settings = await db.collection("college_settings").findOne({
      college: { $regex: new RegExp(`^${college.trim()}$`, "i") }
    });

    // Return empty object if no settings found yet
    res.json(settings || { college, requiredHours: {} });
  } catch (err) {
    console.error("Error fetching college settings:", err);
    res.status(500).json({ error: "Failed to fetch settings." });
  }
});

// -----------------------------------------------
// PUT /api/admin/college-settings
// Upserts settings for a college
// -----------------------------------------------
router.put("/college-settings", async (req, res) => {
  try {
    const { college, requiredHours } = req.body;
    if (!college) return res.status(400).json({ error: "College is required." });

    const db = await connectDB();
    await db.collection("college_settings").updateOne(
      { college },
      {
        $set: {
          requiredHours: requiredHours || {},
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    res.json({ message: "Settings updated successfully." });
  } catch (err) {
    console.error("Error updating college settings:", err);
    res.status(500).json({ error: "Failed to update settings." });
  }
});

// -----------------------------------------------
// GET /api/admin/endorsements
// Fetches all endorsement requests for a specific college
// -----------------------------------------------
router.get("/endorsements", async (req, res) => {
  try {
    const { college } = req.query;
    if (!college) return res.status(400).json({ error: "College is required." });

    const db = await connectDB();

    // Aggregation to join endorsement_requests with users
    const requests = await db.collection("endorsement_requests").aggregate([
      {
        // Ensure studentId is an ObjectId for lookup
        $addFields: {
          studentIdObj: {
            $cond: {
              if: { $eq: [{ $type: "$studentId" }, "string"] },
              then: { $toObjectId: "$studentId" },
              else: "$studentId"
            }
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "studentIdObj",
          foreignField: "_id",
          as: "studentInfo"
        }
      },
      { $unwind: "$studentInfo" },
      {
        $match: {
          $or: [
            { "studentInfo.college": college },
            { "studentInfo.college": { $regex: new RegExp(`^${college}$`, "i") } } // Case insensitive
          ]
        }
      },
      {
        $project: {
          _id: 1,
          studentId: 1,
          fullName: { $concat: ["$studentInfo.firstName", " ", "$studentInfo.lastName"] },
          studentNumber: "$studentInfo.studentNumber",
          course: "$studentInfo.course",
          companyName: 1,
          companyAddress: 1,
          supervisor: "$supervisorFullName",
          status: 1,
          dateRequested: 1,
          updatedAt: 1
        }
      }
    ]).toArray();

    // Map DB status to frontend status if needed
    // DB uses 'in_process', Frontend uses 'pending'
    const mappedRequests = requests.map(req => ({
      ...req,
      id: req._id,
      status: req.status === 'in_process' ? 'pending' : req.status
    }));

    res.json(mappedRequests);
  } catch (err) {
    console.error("Error fetching endorsement requests:", err);
    res.status(500).json({ error: "Failed to fetch endorsement requests." });
  }
});

// -----------------------------------------------
// PATCH /api/admin/endorsements/:id
// Updates an endorsement request status
// -----------------------------------------------
router.patch("/endorsements/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required." });
    }

    const db = await connectDB();
    
    // Map frontend 'pending' back to 'in_process' if updating to that (unlikely from admin but good for consistency)
    const dbStatus = status === 'pending' ? 'in_process' : status;
    
    const updateData = { 
      status: dbStatus, 
      updatedAt: new Date() 
    };

    if (status === 'ready') {
      updateData.dateApproved = new Date();
    }

    if (status === 'rejected' && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const result = await db.collection("endorsement_requests").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Endorsement request not found." });
    }

    res.json({ message: "Endorsement request updated successfully." });
  } catch (err) {
    console.error("Error updating endorsement request:", err);
    res.status(500).json({ error: "Failed to update endorsement request." });
  }
});

export default router;
