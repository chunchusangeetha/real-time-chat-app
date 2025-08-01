import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { Server } from "socket.io";
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import userRoutes from "./routes/userRoutes.js";
import socketHandler from './socket.js';

dotenv.config();

// Debug logs
console.log("Using MONGO_URI:", process.env.MONGO_URI);
console.log("Frontend URI for CORS:", process.env.FRONTEND_URI);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

const app = express();

// CORS setup
// app.use(cors({
//   origin: process.env.FRONTEND_URI,
//   credentials: true,
// }));
const allowedOrigin = process.env.FRONTEND_URI || "http://localhost:5173"; 

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigin.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));


// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api", userRoutes);

// HTTP + Socket Server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URI,
    methods: ["GET", "POST"],
    credentials: true,
  },
});
socketHandler(io);

// Start Server
const PORT = process.env.PORT || 5003;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
