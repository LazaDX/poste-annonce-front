// src/chat/chat.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./chat.css";

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Faire défiler automatiquement vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Simuler des messages automatiques du bot
  useEffect(() => {
    const welcomeMessage = {
      text: "Salut, champion ! Je suis ton assistant AnnonceMada. Comment puis-je t’aider aujourd’hui ? 😄",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages([welcomeMessage]);

    const typingTimeout = setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        const autoResponse = {
          text: "Tu peux me poser des questions sur les annonces, demander des conseils, ou même discuter ! Que veux-tu faire ?",
          sender: "bot",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, autoResponse]);
        setIsTyping(false);
      }, 1500);
    }, 1000);

    return () => clearTimeout(typingTimeout);
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      const userMessage = {
        text: inputMessage,
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, userMessage]);
      setInputMessage("");
      setIsTyping(true);

      // Réponse simulée du bot après un délai
      setTimeout(() => {
        const botResponse = {
          text: `Merci pour ton message, ${inputMessage}! Je traite ta demande... Voici une réponse : Je te suggère de vérifier nos annonces récentes sur AnnonceMada ! 😊`,
          sender: "bot",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, botResponse]);
        setIsTyping(false);
      }, 2000);
    }
  };

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <div className="chat-sidebar">
        <h2 className="chat-title">Conversations</h2>
        <ul className="chat-list">
          <li className="chat-item active">
            <div className="chat-item-content">
              <div className="chat-item-avatar">
                <i className="fas fa-robot"></i>
              </div>
              <div className="chat-item-info">
                <span className="chat-item-name">Assistant AnnonceMada</span>
                <span className="chat-item-last-message">Comment puis-je t’aider ?</span>
              </div>
            </div>
          </li>
          <li className="chat-item">
            <div className="chat-item-content">
              <div className="chat-item-avatar">
                <i className="fas fa-headset"></i>
              </div>
              <div className="chat-item-info">
                <span className="chat-item-name">Support Ventes</span>
                <span className="chat-item-last-message">Disponible</span>
              </div>
            </div>
          </li>
          <li className="chat-item">
            <div className="chat-item-content">
              <div className="chat-item-avatar">
                <i className="fas fa-tools"></i>
              </div>
              <div className="chat-item-info">
                <span className="chat-item-name">Aide Technique</span>
                <span className="chat-item-last-message">Disponible</span>
              </div>
            </div>
          </li>
        </ul>
      </div>

      {/* Chat Window */}
      <div className="chat-window">
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="chat-header-avatar">
              <i className="fas fa-robot"></i>
            </div>
            <div className="chat-header-details">
              <h3>Assistant AnnonceMada</h3>
              <span className="chat-status">En ligne</span>
            </div>
          </div>
          <button className="chat-close-btn" onClick={() => navigate("/")}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${msg.sender === "bot" ? "bot" : "user"}`}
            >
              <div className="message-content">
                <p>{msg.text}</p>
                <span className="message-time">{msg.timestamp}</span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="chat-message bot typing">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form className="chat-input" onSubmit={handleSendMessage}>
          <button type="button" className="chat-input-icon">
            <i className="fas fa-smile"></i>
          </button>
          <button type="button" className="chat-input-icon">
            <i className="fas fa-paperclip"></i>
          </button>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Tapez un message..."
          />
          <button type="submit">
            <i className="fas fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;