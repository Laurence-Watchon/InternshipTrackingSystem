import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();
const app = express();

// Manual CORS middleware — works reliably with Express 5
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Immediately respond to preflight OPTIONS requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
