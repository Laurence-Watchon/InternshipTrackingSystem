import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { connectDB } from "../db.js";
import { ObjectId } from "mongodb";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Store OTPs temporarily in memory (email -> { otp, expiry, userData, type })
const otpStore = new Map();

// --- Email transporter setup ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password (not your real password)
  },
});

// --- Generate 6-digit OTP ---
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// --- Send OTP Email ---
async function sendOTPEmail(email, otp, firstName) {
  const mailOptions = {
    from: `"Internship Tracking System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Email Verification - Your OTP Code",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin:0; padding:0; background-color:#f0fdf4; font-family: 'Segoe UI', Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0fdf4; padding: 40px 0;">
            <tr>
              <td align="center">
                <table width="500" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #22c55e, #16a34a); padding: 36px 40px; text-align:center;">
                      <div style="width:64px; height:64px; background:rgba(255,255,255,0.2); border-radius:50%; margin:0 auto 16px; display:flex; align-items:center; justify-content:center;">
                        <span style="font-size:32px;">🎓</span>
                      </div>
                      <h1 style="color:#ffffff; margin:0; font-size:22px; font-weight:700; letter-spacing:-0.3px;">
                        Internship Tracking System
                      </h1>
                      <p style="color:rgba(255,255,255,0.85); margin:6px 0 0; font-size:14px;">
                        Mock University
                      </p>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding: 40px 40px 32px;">
                      <h2 style="color:#111827; margin:0 0 8px; font-size:20px; font-weight:700;">
                        Verify Your Email Address
                      </h2>
                      <p style="color:#6b7280; margin:0 0 24px; font-size:15px; line-height:1.6;">
                        Hi <strong style="color:#111827;">${firstName}</strong>, thanks for signing up! 
                        Please use the code below to verify your email address.
                      </p>

                      <!-- OTP Box -->
                      <div style="background: linear-gradient(135deg, #f0fdf4, #dcfce7); border: 2px solid #86efac; border-radius:12px; padding: 28px; text-align:center; margin-bottom:24px;">
                        <p style="color:#16a34a; font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:1.5px; margin:0 0 12px;">
                          Your Verification Code
                        </p>
                        <div style="letter-spacing: 12px; font-size: 42px; font-weight: 800; color: #15803d; font-family: 'Courier New', monospace;">
                          ${otp}
                        </div>
                        <p style="color:#6b7280; font-size:13px; margin:14px 0 0;">
                          ⏱ This code expires in <strong>3 minutes</strong>
                        </p>
                      </div>

                      <!-- Warning -->
                      <div style="background:#fffbeb; border-left: 4px solid #f59e0b; border-radius:6px; padding:14px 16px; margin-bottom:24px;">
                        <p style="color:#92400e; font-size:13px; margin:0; line-height:1.5;">
                          ⚠️ <strong>Never share this code</strong> with anyone. 
                          Our team will never ask for your OTP.
                        </p>
                      </div>

                      <p style="color:#9ca3af; font-size:13px; line-height:1.6; margin:0;">
                        If you didn't create an account, you can safely ignore this email. 
                        No account will be created without verification.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background:#f9fafb; border-top:1px solid #e5e7eb; padding:20px 40px; text-align:center;">
                      <p style="color:#9ca3af; font-size:12px; margin:0;">
                        © ${new Date().getFullYear()} Internship Tracking System · Mock University
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}

// --- Send Reset Password OTP Email ---
async function sendResetOTPEmail(email, otp, firstName) {
  const mailOptions = {
    from: `"Internship Tracking System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset - Your OTP Code",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin:0; padding:0; background-color:#fff9f2; font-family: 'Segoe UI', Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fff9f2; padding: 40px 0;">
            <tr>
              <td align="center">
                <table width="500" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 36px 40px; text-align:center;">
                      <div style="width:64px; height:64px; background:rgba(255,255,255,0.2); border-radius:50%; margin:0 auto 16px; display:flex; align-items:center; justify-content:center;">
                        <span style="font-size:32px;">🔐</span>
                      </div>
                      <h1 style="color:#ffffff; margin:0; font-size:22px; font-weight:700; letter-spacing:-0.3px;">
                        Internship Tracking System
                      </h1>
                      <p style="color:rgba(255,255,255,0.85); margin:6px 0 0; font-size:14px;">
                        Password Reset Service
                      </p>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding: 40px 40px 32px;">
                      <h2 style="color:#111827; margin:0 0 8px; font-size:20px; font-weight:700;">
                        Reset Your Password
                      </h2>
                      <p style="color:#6b7280; margin:0 0 24px; font-size:15px; line-height:1.6;">
                        Hi <strong style="color:#111827;">${firstName}</strong>, we received a request to reset your password. 
                        Please use the code below to proceed with the reset.
                      </p>

                      <!-- OTP Box -->
                      <div style="background: linear-gradient(135deg, #fffbeb, #fef3c7); border: 2px solid #fcd34d; border-radius:12px; padding: 28px; text-align:center; margin-bottom:24px;">
                        <p style="color:#b45309; font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:1.5px; margin:0 0 12px;">
                          Your Reset Code
                        </p>
                        <div style="letter-spacing: 12px; font-size: 42px; font-weight: 800; color: #92400e; font-family: 'Courier New', monospace;">
                          ${otp}
                        </div>
                        <p style="color:#6b7280; font-size:13px; margin:14px 0 0;">
                          ⏱ This code expires in <strong>3 minutes</strong>
                        </p>
                      </div>

                      <!-- Warning -->
                      <div style="background:#fef2f2; border-left: 4px solid #ef4444; border-radius:6px; padding:14px 16px; margin-bottom:24px;">
                        <p style="color:#991b1b; font-size:13px; margin:0; line-height:1.5;">
                          ⚠️ If you didn't request a password reset, please ignore this email or contact support if you're concerned about your account security.
                        </p>
                      </div>

                      <p style="color:#9ca3af; font-size:13px; line-height:1.6; margin:0;">
                        This email was sent to your registered address because a password reset was requested.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background:#f9fafb; border-top:1px solid #e5e7eb; padding:20px 40px; text-align:center;">
                      <p style="color:#9ca3af; font-size:12px; margin:0;">
                        © ${new Date().getFullYear()} Internship Tracking System · Mock University
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}

// -----------------------------------------------
// POST /api/auth/signup
// Validates, hashes password, sends OTP
// -----------------------------------------------
router.post("/signup", async (req, res) => {
  try {
    const {
      firstName, lastName, studentNumber, phoneNumber,
      email, college, course, password
    } = req.body;

    const db = await connectDB();

    // Check for duplicates simultaneously
    const existingStudent = await db.collection("users").findOne({ studentNumber });
    const existingUser = await db.collection("users").findOne({ email });

    const duplicateErrors = {};
    if (existingStudent && !existingStudent.isRejected) {
      duplicateErrors.studentNumber = "Student number is already registered.";
    }
    if (existingUser && !existingUser.isRejected) {
      duplicateErrors.email = "Email is already registered.";
    }

    if (Object.keys(duplicateErrors).length > 0) {
      return res.status(400).json({ errors: duplicateErrors });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate OTP
    const otp = generateOTP();
    const expiry = Date.now() + 3 * 60 * 1000; // 3 minutes

    // Store OTP + user data temporarily
    otpStore.set(email, {
      otp,
      expiry,
      type: "signup",
      userData: {
        firstName,
        lastName,
        studentNumber,
        phoneNumber,
        email,
        college,
        course,
        password: hashedPassword,
        role: "student",
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Send OTP email
    await sendOTPEmail(email, otp, firstName);

    res.json({ message: "OTP sent to your email." });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// -----------------------------------------------
// POST /api/auth/verify-otp
// Verifies OTP, saves user to MongoDB
// -----------------------------------------------
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const stored = otpStore.get(email);

    // Check if OTP exists
    if (!stored) {
      return res.status(400).json({ error: "OTP expired or not found. Please sign up again." });
    }

    // Check if OTP expired
    if (Date.now() > stored.expiry) {
      otpStore.delete(email);
      return res.status(400).json({ error: "OTP has expired. Please resend." });
    }

    // Check if OTP matches
    if (stored.otp !== otp) {
      return res.status(400).json({ error: "Incorrect OTP. Please try again." });
    }

    // Save user to MongoDB
    const db = await connectDB();
    const userData = { ...stored.userData, isVerified: false };

    // If returning from a rejection, delete the old rejected record first
    await db.collection("users").deleteOne({
      studentNumber: userData.studentNumber,
      isRejected: true
    });

    const result = await db.collection("users").insertOne(userData);

    // Clean up OTP store
    otpStore.delete(email);

    res.json({
      message: "Email verified! Account created successfully.",
      id: result.insertedId,
      role: userData.role,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      college: userData.college,
      token: jwt.sign(
        { id: result.insertedId, role: userData.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      ),
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// -----------------------------------------------
// POST /api/auth/resend-otp
// Resends a new OTP
// -----------------------------------------------
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;

    const stored = otpStore.get(email);
    if (!stored) {
      return res.status(400).json({ error: "Session expired. Please sign up again." });
    }

    // Generate new OTP
    const otp = generateOTP();
    const expiry = Date.now() + 3 * 60 * 1000;

    otpStore.set(email, { ...stored, otp, expiry });

    await sendOTPEmail(email, otp, stored.userData.firstName);

    res.json({ message: "New OTP sent to your email." });
  } catch (err) {
    console.error("Resend OTP error:", err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// -----------------------------------------------
// POST /api/auth/login
// Checks credentials and returns role
// -----------------------------------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const db = await connectDB();

    // Find user by email
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Wrong credentials. Please try again." });
    }

    // Check if user is softly rejected
    if (user.isRejected) {
      return res.status(403).json({
        error: "rejected",
        reason: user.rejectionReason || "No specific reason provided.",
        college: user.college || "your College"
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Wrong credentials. Please try again." });
    }

    // Block students who haven't been verified by admin yet
    if (user.role === "student" && user.isVerified === false) {
      return res.status(403).json({ error: "pending" });
    }

    // Return role so the frontend can redirect correctly
    res.json({
      message: "Login successful.",
      id: user._id,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      college: user.college,
      course: user.course,
      isVerified: user.isVerified,
      token: jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      ),
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// -----------------------------------------------
// POST /api/auth/forgot-password
// Checks if email exists, sends reset OTP
// -----------------------------------------------
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    const db = await connectDB();
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "Email not found." });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiry = Date.now() + 3 * 60 * 1000; // 3 minutes

    // Store OTP temporarily
    otpStore.set(email, {
      otp,
      expiry,
      type: "reset",
      userData: { firstName: user.firstName }
    });

    // Send OTP email
    await sendResetOTPEmail(email, otp, user.firstName);

    res.json({ message: "Reset code sent to your email." });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// -----------------------------------------------
// POST /api/auth/verify-reset-otp
// Verifies password reset OTP
// -----------------------------------------------
router.post("/verify-reset-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const stored = otpStore.get(email);

    if (!stored || stored.type !== "reset") {
      return res.status(400).json({ error: "OTP expired or not found." });
    }

    if (Date.now() > stored.expiry) {
      otpStore.delete(email);
      return res.status(400).json({ error: "OTP has expired." });
    }

    if (stored.otp !== otp) {
      return res.status(400).json({ error: "Incorrect OTP." });
    }

    // Mark as verified but don't delete yet, we need it for reset-password
    otpStore.set(email, { ...stored, isVerified: true });

    res.json({ message: "OTP verified. You can now reset your password." });
  } catch (err) {
    console.error("Verify reset OTP error:", err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// -----------------------------------------------
// POST /api/auth/reset-password
// Resets user password
// -----------------------------------------------
router.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const stored = otpStore.get(email);

    if (!stored || stored.type !== "reset" || !stored.isVerified) {
      return res.status(400).json({ error: "Unauthorized session." });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const db = await connectDB();

    await db.collection("users").updateOne(
      { email },
      { $set: { password: hashedPassword, updatedAt: new Date() } }
    );

    // Clean up OTP store
    otpStore.delete(email);

    res.json({ message: "Password reset successful! You can now log in." });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// -----------------------------------------------
// GET /api/auth/profile/:id
// Fetches user profile by ID
// -----------------------------------------------
router.get("/profile/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const db = await connectDB();
    const user = await db.collection("users").findOne({ _id: new ObjectId(id) });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Don't send the password
    const { password, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    console.error("Fetch profile error:", err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// -----------------------------------------------
// PUT /api/auth/profile/:id
// Updates user profile by ID
// -----------------------------------------------
router.put("/profile/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove immutable or sensitive fields if they exist in body
    delete updateData._id;
    delete updateData.password;
    delete updateData.email; // Usually email update requires separate flow
    delete updateData.role;
    delete updateData.isVerified;

    const db = await connectDB();
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({ message: "Profile updated successfully." });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

export default router;
