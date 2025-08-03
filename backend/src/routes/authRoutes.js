import express from "express";
import admin from "../config/firebase.js";
import User from "../models/User.js";
const router = express.Router();
router.post("/verify-token", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "No token provided or malformed header" });
  }

  const token = authHeader.split(" ")[1];
  console.log("token from client:", token);

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    let user = await User.findOne({ uid: decoded.uid });
   if (!user) {
     user = new User({
       uid: decoded.uid,
       name: decoded.name || decoded.email?.split("@")[0] || "Unknown",
       email: decoded.email,
     });

     await user.save();
   } else {
   }

    res.status(200).json(user);
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
});

export default router;
