import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import studentRoutes from "./routes/student.js";

import cors from "cors";

dotenv.config();
const app = express();

// Use the standard CORS package
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));


app.use(express.json());

// Connect to DB on startup
connectDB();

// Health check — visit http://localhost:5000 to confirm server is up
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Internship Tracking System API is running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
