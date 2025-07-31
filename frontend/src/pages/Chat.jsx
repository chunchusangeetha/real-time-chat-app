import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Chat = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  const backendURL = "http://localhost:5003/api"; 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${backendURL}/users`);
        console.log("Fetched users response:", res.data);
        const users = res.data.users;
        const filteredUsers = users.filter((u) => u.email !== user.email);
        setUsers(filteredUsers);
      } catch (err) {
        console.error("Failed to load users", err);
      }
    };
    fetchUsers();
  }, [user]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) return;
      try {
        const res = await axios.get(
          `${backendURL}/chat/${user.uid}/${selectedUser._id}`
        );
        setMessages(res.data.messages);
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };
    fetchMessages();
  }, [selectedUser, user]);

  const sendMessage = async () => {
    if (!newMsg.trim() || !selectedUser) return;
    try {
      await axios.post(`${backendURL}/chat/send`, {
        senderId: user.uid,
        receiverId: selectedUser._id,
        content: newMsg,
      });
      setNewMsg("");
      setMessages([...messages, { senderId: user.uid, content: newMsg }]);
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Left: User List */}
      <div
        style={{ width: "30%", borderRight: "1px solid gray", padding: "10px" }}
      >
        <h3>Users</h3>
        {users.map((u) => (
          <div
            key={u._id}
            style={{
              padding: "8px",
              cursor: "pointer",
              backgroundColor: selectedUser?._id === u._id ? "#eee" : "#fff",
            }}
            onClick={() => setSelectedUser(u)}
          >
            {u.name}
          </div>
        ))}
      </div>

      <div style={{ width: "70%", padding: "10px" }}>
        {selectedUser ? (
          <>
            <h3>Chat with {selectedUser.name}</h3>
            <div
              style={{
                border: "1px solid #ccc",
                height: "400px",
                overflowY: "auto",
                padding: "10px",
              }}
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    textAlign: msg.senderId === user.uid ? "right" : "left",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      padding: "6px 12px",
                      margin: "4px 0",
                      backgroundColor:
                        msg.senderId === user.uid ? "#daf0da" : "#f0f0f0",
                      borderRadius: "10px",
                    }}
                  >
                    {msg.content}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "10px", display: "flex" }}>
              <input
                type="text"
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                placeholder="Type your message"
                style={{ flex: 1, padding: "10px" }}
              />
              <button onClick={sendMessage} style={{ padding: "10px" }}>
                Send
              </button>
            </div>
          </>
        ) : (
          <p>Select a user to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default Chat;
