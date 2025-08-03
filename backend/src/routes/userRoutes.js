import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.get("/users", async (req, res) => {
  const { uid } = req.query;
  try {
    const users = await User.find({ uid: { $ne: uid } }); 
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Error fetching users" });
  }
});
router.get("/by-uid/:uid", async (req, res) => {
  const { uid } = req.params;
  try {
    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ mongoId: user._id });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
