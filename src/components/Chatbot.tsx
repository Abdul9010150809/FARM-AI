// src/components/Chatbot.tsx

import React, { useState, useEffect, useRef, CSSProperties } from 'react';

// Define the structure of a message
interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

// SVG Icon Components (remain the same)
const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);


interface ChatbotProps {
  isApiHealthy: boolean;
}

export const Chatbot: React.FC<ChatbotProps> = ({ isApiHealthy }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Hello! How can I help you today?', sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  
  // State for handling hover effects on buttons
  const [isIconHovered, setIsIconHovered] = useState(false);
  const [isSendHovered, setIsSendHovered] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    const userMessage: Message = { id: Date.now(), text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    setTimeout(() => {
      const botResponse: Message = { id: Date.now() + 1, text: 'This is a simulated response.', sender: 'bot' };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };
  
  // --- Start of Styles ---
  // We define all styles as JavaScript objects here
  const styles: { [key: string]: CSSProperties } = {
    chatIcon: {
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      backgroundColor: '#007bff',
      color: 'white',
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      border: 'none',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
      cursor: 'pointer',
      zIndex: 1000,
      transition: 'transform 0.2s ease-in-out',
    },
    chatIconHover: {
      transform: 'scale(1.1)',
    },
    chatWindow: {
      position: 'fixed',
      bottom: '100px',
      right: '30px',
      width: '350px',
      maxWidth: '90vw',
      height: '500px',
      backgroundColor: '#ffffff',
      borderRadius: '15px',
      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.15)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      zIndex: 999,
      opacity: 0,
      transform: 'translateY(20px)',
      visibility: 'hidden',
      transition: 'opacity 0.3s ease, transform 0.3s ease, visibility 0.3s',
    },
    chatWindowOpen: {
      opacity: 1,
      transform: 'translateY(0)',
      visibility: 'visible',
    },
    chatHeader: {
      backgroundColor: '#007bff',
      color: 'white',
      padding: '15px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerTitle: {
      margin: 0,
      fontSize: '1.1em',
    },
    closeButton: {
      background: 'none',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      padding: 0,
    },
    messageList: {
      flexGrow: 1,
      padding: '20px',
      overflowY: 'auto',
      backgroundColor: '#f9f9f9',
    },
    message: {
      padding: '10px 15px',
      borderRadius: '20px',
      marginBottom: '10px',
      maxWidth: '80%',
      lineHeight: 1.4,
    },
    bot: {
      backgroundColor: '#e9e9eb',
      color: '#333',
      alignSelf: 'flex-start',
    },
    user: {
      backgroundColor: '#007bff',
      color: 'white',
      alignSelf: 'flex-end',
      marginLeft: 'auto',
    },
    chatInputArea: {
      display: 'flex',
      padding: '10px 20px',
      borderTop: '1px solid #ddd',
      backgroundColor: '#fff',
    },
    chatInput: {
      flexGrow: 1,
      border: '1px solid #ccc',
      borderRadius: '20px',
      padding: '10px 15px',
      fontSize: '1em',
      outline: 'none',
    },
    sendButton: {
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '20px',
      padding: '10px 20px',
      marginLeft: '10px',
      cursor: 'pointer',
      fontWeight: 'bold',
      transition: 'background-color 0.2s',
    },
    sendButtonHover: {
      backgroundColor: '#0056b3',
    },
  };
  // --- End of Styles ---

  return (
    <div>
      {/* The Chat Window */}
      <div style={{ ...styles.chatWindow, ...(isOpen ? styles.chatWindowOpen : {}) }}>
        <div style={styles.chatHeader}>
          <h2 style={styles.headerTitle}>Chat with Us</h2>
          <button onClick={toggleChat} style={styles.closeButton}>
            <CloseIcon />
          </button>
        </div>
        <div style={styles.messageList}>
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                ...styles.message,
                ...(message.sender === 'user' ? styles.user : styles.bot)
              }}
            >
              {message.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSendMessage} style={styles.chatInputArea}>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Type a message..."
            style={styles.chatInput}
          />
          <button 
            type="submit" 
            style={{ ...styles.sendButton, ...(isSendHovered ? styles.sendButtonHover : {}) }}
            onMouseEnter={() => setIsSendHovered(true)}
            onMouseLeave={() => setIsSendHovered(false)}
          >
            Send
          </button>
        </form>
      </div>

      {/* The Floating Icon Button */}
      <button 
        onClick={toggleChat} 
        style={{ ...styles.chatIcon, ...(isIconHovered ? styles.chatIconHover : {}) }}
        onMouseEnter={() => setIsIconHovered(true)}
        onMouseLeave={() => setIsIconHovered(false)}
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </button>
    </div>
  );
};
export default Chatbot;