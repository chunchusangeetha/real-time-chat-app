import { Kafka } from "kafkajs";

const kafka = new Kafka({ clientId: "chat-app",  brokers: ["localhost:9092"],
});

export const kafkaProducer = kafka.producer();
await kafkaProducer.connect();
