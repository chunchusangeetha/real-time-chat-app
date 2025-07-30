import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: String,
  receiverId: String,
  content: String,
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ["sent", "delivered"], default: "sent" },
});

export default mongoose.model("Message", messageSchema);
