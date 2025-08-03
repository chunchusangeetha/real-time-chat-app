import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import socketHandler from "./sockets/socket.js";
import { connectKafkaProducer } from "./kafka/producer.js";
import { startConsumer } from "./kafka/consumer.js";

dotenv.config();

const startServer = async () => {
  const app = express();

  try {
   await connectDB();
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB error:", err);
    process.exit(1);
  }

  // CORS
  const allowedOrigin = process.env.FRONTEND_URI || "http://localhost:5173";
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || origin === allowedOrigin) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    })
  );

  app.use(express.json());

  // Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/chat", chatRoutes);
  app.use("/api", userRoutes);
  app.use("/api/users", userRoutes);

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: allowedOrigin,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  socketHandler(io);

  // Kafka
  await connectKafkaProducer();
  await startConsumer(io).catch((err) =>
    console.error("Kafka Consumer Failed to Start:", err)
  );

  // Start Express server
  const PORT = process.env.PORT || 5003;
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
