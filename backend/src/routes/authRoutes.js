import express from "express";
import admin from "../config/firebase.js";

const router = express.Router();

router.post("/verify-token", async (req, res) => {
  const { token } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;
    return res.status(200).json({ uid, decodedToken });
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
});

export default router;
