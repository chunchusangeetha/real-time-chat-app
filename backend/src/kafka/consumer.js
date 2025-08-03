import { Kafka } from "kafkajs";
import mongoose from "mongoose";
import Message from "../models/message.js";

const kafka = new Kafka({ clientId: "chat-app", brokers: ["localhost:9092"] });
const consumer = kafka.consumer({ groupId: "chat-group" });

export const startConsumer = async (io) => {
  await consumer.connect();
  await consumer.subscribe({ topic: "chat-messages", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const parsedMessage = JSON.parse(message.value.toString());

const { sender, receiver, content } = parsedMessage;

        if (
          !mongoose.Types.ObjectId.isValid(senderId) ||
          !mongoose.Types.ObjectId.isValid(receiverId)
        ) {
          console.error("Invalid ObjectId(s) received:", {
            sender,
            receiver,
          });
          return;
        }

        const saved = await Message.create({
          sender: new mongoose.Types.ObjectId(sender),
          receiver: new mongoose.Types.ObjectId(receiver),
          content,
        });

        io.to(receiver).emit("receive_message", saved);
      } catch (err) {
        console.error("Kafka Consumer Error:", err);
      }
    },
  });
};
