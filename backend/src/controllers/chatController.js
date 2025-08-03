import mongoose from "mongoose";
import Message from "../models/message.js";

export const sendMessage = async (req, res) => {
  const { senderId, receiverId, content } = req.body;

  if (!mongoose.Types.ObjectId.isValid(receiverId)) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid receiver ID" });
  }

  try {
    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      content,
    });

    await newMessage.save();

    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ success: false, error: "Failed to send message" });
  }
};



export const getMessages = async (req, res) => {
  const { senderId, receiverId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(receiverId)) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid receiver ID" });
  }

  try {
    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }, 
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
