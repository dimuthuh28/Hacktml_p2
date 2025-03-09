import React, { useState } from 'react';
import '../../styles/Chatbot.css'; // Make sure this file is now correctly imported

const API_KEY = 'AIzaSyBNirs8Bvf0mCsPuwR2xsc0J-Q7K8CsAsU'; 
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

function Chatbot() {
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const generateResponse = async (prompt) => {
    try {
      console.log('Sending request to Gemini API with prompt:', prompt);

      // Send request to Gemini API
      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      });

      // If API request is unsuccessful
      if (!response.ok) {
        throw new Error('Failed to generate response');
      }

      // Parse the response from the API
      const data = await response.json();
      console.log('Received response from Gemini:', data);

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('API Error:', error);
      return 'Sorry, I encountered an error. Please try again.';
    }
  };

  const handleUserInput = async () => {
    const trimmedMessage = userInput.trim();

    if (trimmedMessage) {
      // Update chat state with user message (only when user presses enter)
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { text: trimmedMessage, isUser: true },
      ]);

      setUserInput('');
      setIsSending(true);

      try {
        const botResponse = await generateResponse(trimmedMessage);
        // Add bot's response to the chat (after API call)
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { text: botResponse, isUser: false },
        ]);
      } catch (error) {
        console.error('Error generating bot response:', error);
      } finally {
        setIsSending(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      // Prevent default Enter key behavior (creating a new line)
      e.preventDefault();
      handleUserInput();
    }
  };

  return (
    <div className="chatbot-page"> {/* Wrapping the whole JSX in this container */}
      <div className="chat-container">
        <div className="chat-header">
          <h1>Gemini Chatbot</h1>
        </div>
        <div className="chat-messages">
          {chatMessages.map((message, index) => (
            <div key={index} className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}>
              <img className="profile-image" src={message.isUser ? 'user.jpg' : 'bot.jpg'} alt={message.isUser ? 'User' : 'Bot'} />
              <div className="message-content">{message.text}</div>
            </div>
          ))}
        </div>
        <div className="chat-input-container">
          <input
            type="text"
            id="user-input"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={handleKeyPress}  // Trigger handleKeyPress on Enter key press
          />
          <button id="send-button" onClick={handleUserInput} disabled={isSending}>
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
