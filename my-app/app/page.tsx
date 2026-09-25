"use client";

import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      text: "Hello! 👋 How can I help you today?",
      sender: "bot",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async () => {
    if (message.trim() === "") return;

    const userMessage = {
      text: message,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentMessage = message;
    setMessage("");
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentMessage }),
      });

      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        {
          text: data.reply || "Sorry, I couldn't generate a response.",
          sender: "bot",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, something went wrong. Please try again.",
          sender: "bot",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        text: "Hello! 👋 How can I help you today?",
        sender: "bot",
      },
    ]);
  };

  return (
    <main className="chat-page">
      <div className="chat-container">

        {/* Header */}
        <header className="chat-header">
          <div className="header-left">
            <div className="ai-avatar">
              AI
            </div>

            <div>
              <h1>AI Assistant</h1>

              <div className="online-status">
                <span className="status-dot"></span>
                Online
              </div>
            </div>
          </div>

          <button
            className="clear-button"
            onClick={clearChat}
          >
            Clear
          </button>
        </header>

        {/* Chat Area */}
        <section className="messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message-row ${
                msg.sender === "user"
                  ? "user-row"
                  : "bot-row"
              }`}
            >
              {msg.sender === "bot" && (
                <div className="small-avatar">
                  AI
                </div>
              )}

              <div
                className={`message ${
                  msg.sender === "user"
                    ? "user-message"
                    : "bot-message"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="message-row bot-row">
              <div className="small-avatar">
                AI
              </div>
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef}></div>
        </section>

        {/* Input Area */}
        <div className="input-section">

          <div className="input-wrapper">

            <input
              type="text"
              placeholder="Message AI Assistant..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <button
              className="send-button"
              onClick={sendMessage}
              disabled={!message.trim()}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
            </button>

          </div>

          <p className="input-hint">
            Press Enter to send
          </p>

        </div>

      </div>
    </main>
  );
}
