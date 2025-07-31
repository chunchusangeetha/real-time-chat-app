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
//import connectDB from './config/db.js';

dotenv.config();
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

const app = express();


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
//connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

socketHandler(io);
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api", userRoutes);

const PORT = process.env.PORT || 5003;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
