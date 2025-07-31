const ChatWindow = ({ messages }) => (
  <div>
    <h3>Messages</h3>
    {messages.map((msg, idx) => (
      <p key={idx}><strong>{msg.sender}:</strong> {msg.text}</p>
    ))}
  </div>
);

export default ChatWindow;
