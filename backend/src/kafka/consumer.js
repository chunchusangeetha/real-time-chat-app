// src/kafka/consumer.js
import { Kafka } from "kafkajs";
import Message from "../models/message.js";

const kafka = new Kafka({ clientId: "chat-app", brokers: ["localhost:9092"] });
const consumer = kafka.consumer({ groupId: "chat-group" });

export const startConsumer = async (io) => {
  await consumer.connect();
  await consumer.subscribe({ topic: "chat-messages", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const parsedMessage = JSON.parse(message.value.toString());

      const saved = await Message.create(parsedMessage);

      // Emit to receiver socket if they are online
      io.to(parsedMessage.receiverId).emit("receive_message", saved);
    },
  });
};
