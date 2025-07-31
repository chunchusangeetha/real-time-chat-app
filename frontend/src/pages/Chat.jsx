import { useAuth } from "../context/AuthContext";

const Chat = () => {
  const { user } = useAuth();

  return (
    <div>
      <h2>Welcome to the Chat</h2>
      <p>Logged in as: {user?.email}</p>
    </div>
  );
};

export default Chat;
