import { sendMessageToKafka } from "../kafka/producer.js";
import message from "../models/message.js";
import redisClient from "../utils/redisClient.js";

export default function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("register", async (userId) => {
      if (!userId) return;
      await redisClient.set(`online:${userId}`, socket.id); // Save user's socket in Redis
      socket.join(userId);
      console.log(`User ${userId} joined with socket ${socket.id}`);
    });

   socket.on("send-message", async ({ senderId, receiverId, content }) => {
     try {
       const newMessage = new message({
         sender: senderId,
         receiver: receiverId,
         content,
         status: "sent",
       });
       const saved = await newMessage.save();

       const receiverSocketId = await redisClient.get(`online:${receiverId}`);
       if (receiverSocketId) {
         io.to(receiverSocketId).emit("receive-message", saved.toObject());
       }

       const senderSocketId = await redisClient.get(`online:${senderId}`);
       if (senderSocketId) {
         io.to(senderSocketId).emit("message_status_update", {
           messageId: saved._id,
         });
       }

       await sendMessageToKafka(saved.toObject()); // optional
     } catch (err) {
       console.error("send-message error", err);
     }
   });

    socket.on("user_connected", async ({ uid, mongoId }) => {
      console.log(`User ${mongoId} is online`);

      await redisClient.set(mongoId, socket.id); // Save to Redis
      const allKeys = await redisClient.keys("*"); // all online users
      io.emit("update_online_users", allKeys);
    });
    socket.on(
      "mark_as_received",
      async ({ messageId, senderId, receiverId }) => {
        console.log(`Message ${messageId} received by ${receiverId}`);
        await message.findByIdAndUpdate(messageId, { status: "delivered" });
        const senderSocketId = await redisClient.get(`online:${senderId}`);
        if (senderSocketId) {
          io.to(senderSocketId).emit("message_status_update", {
            messageId,
          });
        }
      }
    );

    socket.on("disconnect", async () => {
      console.log("Socket disconnected:", socket.id);

      // Remove disconnected user from Redis
      const keys = await redisClient.keys("*");
      for (const key of keys) {
        const value = await redisClient.get(key);
        if (value === socket.id) {
          await redisClient.del(key);
          console.log(`User ${key} disconnected and removed from Redis`);
          break;
        }
      }
      const updatedOnline = await redisClient.keys("*");
      io.emit("update_online_users", updatedOnline);
    });
  });
}
