
import { verifyFirebaseToken } from "../services/firebase.js";

export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const user = await verifyFirebaseToken(token);
    req.user = user;
    next();
  } catch (err) {
    res.status(403).json({ error: "Unauthorized" });
  }
};
