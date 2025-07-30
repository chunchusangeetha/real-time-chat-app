// socket.js
export default function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("register", (userId) => {
      socket.join(userId);
    });

    socket.on("send_message", (message) => {
      console.log("Message received:", message);
      // Forward to Kafka here
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}
