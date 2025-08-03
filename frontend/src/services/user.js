import axios from "axios";

export const getCurrentUserMongoId = async (firebaseUid) => {
console.log(firebaseUid)
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/by-uid/${firebaseUid}`);
    return res.data.mongoId;
  } catch (err) {
    console.error("getCurrentUserMongoId failed:", err);
    throw err;
  }
};
