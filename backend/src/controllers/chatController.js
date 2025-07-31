import Message from "../models/Message.js";

export const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const sendMessage = async (req, res) => {
  const { senderId, receiverId, content } = req.body;
  try {
    const newMsg = await Message.create({ senderId, receiverId, content });
    res.status(201).json(newMsg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
