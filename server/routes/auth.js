import express from "express";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { connectDB } from "../db.js";

const router = express.Router();

// Store OTPs temporarily in memory (email -> { otp, expiry, userData })
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
                        Laguna University
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
                        © ${new Date().getFullYear()} Internship Tracking System · Laguna University
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

    // Check if student number already exists
    const existingStudent = await db.collection("users").findOne({ studentNumber });
    if (existingStudent) {
      return res.status(400).json({ error: "Student number is already registered." });
    }

    // Check if email already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered." });
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
    await db.collection("users").insertOne(userData);

    // Clean up OTP store
    otpStore.delete(email);

    res.json({ message: "Email verified! Account created successfully." });
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

export default router;