export default function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("register", (userId) => {
      if (!userId) return;
      socket.join(userId);
      console.log(`User ${userId} joined with socket ${socket.id}`);
    });

    socket.on("send_message", (message) => {
      console.log("Message received from client:", message);

      const { senderId, receiverId } = message;

      socket.emit("message_sent", message);

      io.to(receiverId).emit("receive_message", message);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
}
