import "../styles/Chatbot.css";

import React, { useEffect, useRef, useState } from "react";

import axios from "axios";

const ChatBot = () => {
  const [message, setMessage] = useState(""); // User input message
  const [chatHistory, setChatHistory] = useState([]); // History of messages and bot responses
  const [loading, setLoading] = useState(false); // Loading state
  const chatHistoryRef = useRef(null);

  // Auto scroll to the bottom of chat history
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  // Send message to the backend
  const sendMessage = async () => {
    if (!message.trim()) return; // Don't send empty messages

    // Add user message immediately to chat history
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { user: message, bot: null }, // Set bot to null initially while loading
    ]);
    
    const userMsg = message;
    setMessage(""); // Clear input field immediately
    setLoading(true);
    
    try {
      // Send the message to your backend API
      const response = await axios.post("http://localhost:5000/spiriter", {
        message: userMsg,
      });

      // Update the last chat item with the bot response
      setChatHistory((prevHistory) => {
        const newHistory = [...prevHistory];
        newHistory[newHistory.length - 1].bot = response.data.reply;
        return newHistory;
      });
    } catch (error) {
      console.error("Error in sending message:", error);
      // Update with error message
      setChatHistory((prevHistory) => {
        const newHistory = [...prevHistory];
        newHistory[newHistory.length - 1].bot = "Sorry, there was an error processing your request.";
        return newHistory;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot">
      <div className="chat-header">
        <h2>Spirit11 Cricket Assistant</h2>
      </div>
      <div className="chat-history" ref={chatHistoryRef}>
        {chatHistory.length === 0 ? (
          <div className="empty-chat">
            <p>Ask me anything about fantasy cricket!</p>
          </div>
        ) : (
          chatHistory.map((chat, index) => (
            <div key={index} className="chat-item">
              <div className="user-message">
                <span className="message-label">You:</span> {chat.user}
              </div>
              <div className="bot-response">
                <span className="message-label">Spirit11:</span>{" "}
                {chat.bot === null ? (
                  <span className="loading-dots">Typing...</span>
                ) : (
                  chat.bot
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <form className="chat-input" onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask something about fantasy cricket..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !message.trim()}>
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default ChatBot;