import { useState, useEffect, useRef } from "react";
import axios from "axios";

function SpiriterChat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const chatEndRef = useRef(null); // reference for auto-scrolling

    // Scroll to the bottom of the chat when a new message is added
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        // Add user's message
        const newMessages = [...messages, { sender: "user", text: input }];
        setMessages(newMessages);
        setInput(""); // clear input field

        try {
            // Send message to backend and get response from Gemini API
            const response = await axios.post("http://localhost:5000/spiriter/ask", { message: input });
            
            // Add Spiriter's response
            setMessages((prevMessages) => [
                ...newMessages,
                { sender: "spiriter", text: response.data.reply }
            ]);
        } catch (error) {
            console.error("Error fetching response:", error);
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div key={index} className={msg.sender}>
                        <strong>{msg.sender === "user" ? "You" : "Spiriter"}: </strong>
                        {msg.text}
                    </div>
                ))}
                <div ref={chatEndRef} /> {/* Auto-scroll reference */}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Spiriter..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}

export default SpiriterChat;
