import React from "react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getCurrentUserMongoId } from "../services/user";
import axios from "axios";
import "../styles/Chat.css";
import socket from "../services/socket";
import { useRef } from "react";

const backendURL = import.meta.env.VITE_API_BASE_URL;

const Chat = () => {
  const { user, loading } = useAuth();
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [mongoUserId, setMongoUserId] = useState(null);

  useEffect(() => {
    if (user && mongoUserId) {
      socket.emit("user_connected", { uid: user.uid, mongoId: mongoUserId });
    }
  }, [user, mongoUserId]);

  useEffect(() => {
    socket.on("update_online_users", (onlineIds) => {
      setOnlineUsers(onlineIds);
    });
    return () => socket.off("update_online_users");
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (loading || !user) return;
      try {
        const token = await user.getIdToken();
        const id = await getCurrentUserMongoId(user.uid);
        setMongoUserId(id);

        const res = await axios.get(`${backendURL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const filtered = res.data.filter((u) => u.uid !== user.uid);
        setUsers(filtered);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchData();
  }, [user, loading]);

  
  const selectedUserRef = useRef(null);

  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  useEffect(() => {
    if (!socket) return;

    socket.on("receive-message", (message) => {
      if (
        selectedUserRef.current &&
        message.senderId === selectedUserRef.current._id
      ) {
        setMessages((prev) => [...prev, message]);

        socket.emit("mark_as_received", {
          messageId: message._id,
          senderId: message.sender,
          receiverId: message.receiver,
        });
      }
    });

    socket.on("message_status_update", ({ messageId }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, status: "delivered" } : msg
        )
      );
    });

    return () => {
      socket.off("receive-message");
      socket.off("message_status_update");
    };
  }, [selectedUser, mongoUserId, selectedUser?._id]);

  const handleSend = () => {
    if (!newMsg.trim() || !mongoUserId || !selectedUser) return;
    const payload = {
      senderId: mongoUserId,
      receiverId: selectedUser._id,
      content: newMsg,
    };
    socket.emit("send-message", payload);
    const tempMessage = {
      ...payload,
      _id: Date.now(),
      createdAt: new Date(),
      status: "sent",
    };
    setMessages((prev) => [...prev, tempMessage]);
    setNewMsg("");
  };
  const handleUserSelect = async (userObj) => {
    if (!userObj?._id || !mongoUserId) {
      console.warn("User or mongoUserId missing");
      return;
    }

    setSelectedUser({ ...userObj }); 

    try {
      const res = await axios.get(
        `${backendURL}/api/chat/${mongoUserId}/${userObj._id}`
      );
      const msgs = Array.isArray(res.data.messages) ? res.data.messages : [];
      setMessages(msgs);

      msgs
        .filter((m) => m.receiverId === mongoUserId && m.status !== "delivered")
        .forEach((m) => {
          socket.emit("mark_as_received", {
            messageId: m._id,
            senderId: m.senderId,
            receiverId: m.receiverId,
          });
        });
    } catch (err) {
      console.error("Failed to load messages", err);
      setMessages([]); // fallback if error occurs
    }
  };

  if (loading || !mongoUserId) return <div>Loading chat...</div>;

  return (
    <div className="chat-wrapper">
      <div className="sidebar">
        <h2>Users</h2>
        <ul className="user-list">
          {mongoUserId &&
            users.map((u) => {
              const isOnline = onlineUsers.includes(u._id);
              return (
                <li
                  key={u._id}
                  onClick={() => handleUserSelect(u)}
                  className={`user-item ${
                    selectedUser?._id === u._id ? "active" : ""
                  }`}
                >
                  <span
                    className={`status-dot ${isOnline ? "online" : "offline"}`}
                  ></span>
                  {u.name}
                </li>
              );
            })}
        </ul>
      </div>

      <div className="main-chat">
        {selectedUser ? (
          <>
            <div className="chat-header">
              <div className="user-name">{selectedUser.name}</div>
              <div className="user-status">
                {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
              </div>
            </div>{" "}
            <div className="messages">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`message-bubble ${
                    msg.sender === mongoUserId ? "sent" : "received"
                  }`}
                >
                  <span className="content">{msg.content}</span>
                  {msg.sender === mongoUserId && (
                    <span className="tick">
                      {msg.status === "delivered" ? "✓✓" : "✓"}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="input-area">
              <input
                type="text"
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                placeholder="Type a message"
              />
              <button onClick={handleSend}>Send</button>
            </div>
          </>
        ) : (
          <div className="no-user">Select a user to start chatting</div>
        )}
      </div>
    </div>
  );
};

export default Chat;
