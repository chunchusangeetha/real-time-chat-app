import { useState } from "react";

const MessageInput = ({ onSend }) => {
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            onSend(message);
            setMessage("");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your message..." />
            <button type="submit">Send</button>
        </form>
    );
};

export default MessageInput;
