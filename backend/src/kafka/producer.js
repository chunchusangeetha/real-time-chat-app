import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "chat-app",
  brokers: ["localhost:9092"],
});

export const kafkaProducer = kafka.producer();

export const connectKafkaProducer = async () => {
  try {
    await kafkaProducer.connect();
    console.log("Kafka producer connected");
  } catch (err) {
    console.error("Failed to connect Kafka producer:", err.message);
  }
};

export const sendMessageToKafka = async (message) => {
  try {
    await kafkaProducer.send({
      topic: "chat-messages",
      messages: [
        {
          key: message.senderId,
          value: JSON.stringify(message),
        },
      ],
    });
    console.log("Message sent to Kafka:", message);
  } catch (err) {
    console.error("Failed to send message to Kafka:", err.message);
  }
};
