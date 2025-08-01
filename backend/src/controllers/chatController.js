import mongoose from "mongoose";
import Message from "../models/message.js";

export const sendMessage = async (req, res) => {
  const { senderId, receiverId, content } = req.body;
  if (
    !mongoose.isValidObjectId(senderId) ||
    !mongoose.isValidObjectId(receiverId)
  ) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid sender or receiver ID" });
  }
  try {
    const message = new Message({
      sender: new mongoose.Types.ObjectId(senderId),
      receiver: new mongoose.Types.ObjectId(receiverId),
      content,
    });

    await message.save();
    res.status(201).json({ success: true, message });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getMessages = async (req, res) => {
  const { senderId, receiverId } = req.params;

  if (
    !mongoose.isValidObjectId(senderId) ||
    !mongoose.isValidObjectId(receiverId)
  ) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid sender or receiver ID" });
  }

  try {
    const messages = await Message.find({
      $or: [
        {
          sender: new mongoose.Types.ObjectId(senderId),
          receiver: new mongoose.Types.ObjectId(receiverId),
        },
        {
          sender: new mongoose.Types.ObjectId(receiverId),
          receiver: new mongoose.Types.ObjectId(senderId),
        },
      ],
    }).sort({ createdAt: 1 });

    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
