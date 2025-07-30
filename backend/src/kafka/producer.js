// src/kafka/producer.js
import { Kafka } from "kafkajs";

const kafka = new Kafka({ clientId: "chat-app", brokers: ["localhost:9092"] });
const producer = kafka.producer();

await producer.connect();

export const sendMessageToKafka = async (messageData) => {
  await producer.send({
    topic: "chat-messages",
    messages: [{ value: JSON.stringify(messageData) }],
  });
};
