import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Message } from '../types'; // Make sure this type is defined in src/types.ts

const Chatbot = () => {
  // State is now managed internally within the component
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! I'm your agricultural assistant. Ask me about crop predictions, soil health, or weather.", sender: 'bot' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Ref for the message container to enable auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Effect to scroll to the bottom whenever messages are updated
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '' || isLoading) return;

    const userMessage: Message = { id: Date.now(), text: inputMessage, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Send message to your FastAPI chatbot backend
      const response = await axios.post('http://localhost:8000/chat', {
        message: inputMessage,
      });

      const botMessage: Message = { id: Date.now() + 1, text: response.data.response, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot API error:", error);
      const errorMessage: Message = { id: Date.now() + 2, text: "Sorry, I'm having trouble connecting to my knowledge base. Please try again later.", sender: 'bot' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* This is the floating button that opens/closes the chat */}
      <div className="chatbot-toggler" onClick={() => setIsOpen(!isOpen)}>
        <i className={`fa ${isOpen ? 'fa-times' : 'fa-comment-dots'}`}></i>
      </div>

      {/* This is the main chat window, which is shown or hidden */}
      {isOpen && (
        <div className="chatbot-container shadow-lg">
          <div className="chatbot-header">
            <h5>CropYield Assistant 🌱</h5>
            <i className="fa fa-times" onClick={() => setIsOpen(false)}></i>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="message bot typing-indicator">
                <span></span><span></span><span></span>
              </div>
            )}
            {/* This empty div is the target for our auto-scroll */}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask a question..."
              disabled={isLoading}
            />
            <button onClick={handleSendMessage} disabled={isLoading}>
              <i className="fa fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;