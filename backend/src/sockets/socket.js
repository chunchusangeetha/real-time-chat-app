// src/sockets/socket.js
import { sendMessageToKafka } from "../kafka/producer.js";

export default function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    socket.on("send_message", async (message) => {
      await sendMessageToKafka(message);
    });
  });
}
