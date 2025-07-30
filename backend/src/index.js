import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
//import { startConsumer } from "./kafka/consumer.js";
import socketHandler from "./socket.js"; 

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"],
  },
});

socketHandler(io);

//startConsumer(io);

const PORT = 5001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
