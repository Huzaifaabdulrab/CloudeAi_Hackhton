import React, { useState, useRef, useEffect } from 'react';

const styles = {
  // Floating button
  floatingButton: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4299e1 0%, #667eea 100%)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 20px rgba(66, 153, 225, 0.4)',
    transition: 'all 0.3s ease',
    zIndex: 1000,
  },
  floatingButtonHover: {
    transform: 'scale(1.1)',
    boxShadow: '0 6px 30px rgba(66, 153, 225, 0.6)',
  },
  buttonIcon: {
    fontSize: '28px',
    lineHeight: 1,
  },
  // Chat window
  chatWindow: {
    position: 'fixed',
    bottom: '100px',
    right: '24px',
    width: '380px',
    maxWidth: 'calc(100vw - 48px)',
    height: '500px',
    maxHeight: 'calc(100vh - 150px)',
    background: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    zIndex: 1001,
    animation: 'slideUp 0.3s ease-out',
  },
  chatWindowDark: {
    background: '#2d3748',
  },
  // Chat header
  chatHeader: {
    background: 'linear-gradient(135deg, #4299e1 0%, #667eea 100%)',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: 600,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  closeButton: {
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#ffffff',
    fontSize: '18px',
    transition: 'background 0.2s ease',
  },
  // Chat messages
  chatMessages: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  message: {
    maxWidth: '80%',
    padding: '12px 16px',
    borderRadius: '16px',
    fontSize: '0.9rem',
    lineHeight: 1.5,
  },
  botMessage: {
    alignSelf: 'flex-start',
    background: '#edf2f7',
    color: '#2d3748',
    borderBottomLeftRadius: '4px',
  },
  botMessageDark: {
    background: '#4a5568',
    color: '#e2e8f0',
  },
  userMessage: {
    alignSelf: 'flex-end',
    background: 'linear-gradient(135deg, #4299e1 0%, #667eea 100%)',
    color: '#ffffff',
    borderBottomRightRadius: '4px',
  },
  // Chat input
  chatInputContainer: {
    padding: '16px',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    gap: '8px',
  },
  chatInputContainerDark: {
    borderTop: '1px solid #4a5568',
  },
  chatInput: {
    flex: 1,
    padding: '12px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '24px',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  chatInputDark: {
    background: '#4a5568',
    border: '1px solid #4a5568',
    color: '#e2e8f0',
  },
  sendButton: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    border: 'none',
    background: 'linear-gradient(135deg, #4299e1 0%, #667eea 100%)',
    color: '#ffffff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    transition: 'transform 0.2s ease',
  },
  // Typing indicator
  typingIndicator: {
    display: 'flex',
    gap: '4px',
    padding: '12px 16px',
    alignSelf: 'flex-start',
  },
  typingDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#a0aec0',
    animation: 'bounce 1.4s infinite ease-in-out both',
  },
};

// CSS keyframes for animations
const keyframesStyle = `
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes bounce {
    0%, 80%, 100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
`;

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: "Hello! I'm your Physical AI assistant. How can I help you learn about robotics today?",
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Check for dark mode
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    };

    checkDarkMode();

    // Observer for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setMessages((prev) => [...prev, { type: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      // Call your backend /chat endpoint
      const response = await fetch('/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          { type: 'bot', text: data.reply || data.message || 'I received your message!' },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            type: 'bot',
            text: "I'm having trouble connecting right now. Please try again later.",
          },
        ]);
      }
    } catch (error) {
      // Fallback response when backend is not available
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          text: "Thanks for your question! The chat backend is currently being set up. In the meantime, explore our course chapters to learn about Physical AI and Humanoid Robotics.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Inject keyframes */}
      <style>{keyframesStyle}</style>

      {/* Floating Button */}
      <button
        style={{
          ...styles.floatingButton,
          ...(isHovered ? styles.floatingButtonHover : {}),
          ...(isOpen ? { transform: 'rotate(90deg)' } : {}),
        }}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        <span style={styles.buttonIcon}>{isOpen ? '✕' : '🤖'}</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            ...styles.chatWindow,
            ...(isDark ? styles.chatWindowDark : {}),
          }}
        >
          {/* Header */}
          <div style={styles.chatHeader}>
            <h3 style={styles.headerTitle}>
              <span>🤖</span> Physical AI Assistant
            </h3>
            <button
              style={styles.closeButton}
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div style={styles.chatMessages}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  ...styles.message,
                  ...(msg.type === 'bot'
                    ? { ...styles.botMessage, ...(isDark ? styles.botMessageDark : {}) }
                    : styles.userMessage),
                }}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div style={styles.typingIndicator}>
                <div style={{ ...styles.typingDot, animationDelay: '0s' }} />
                <div style={{ ...styles.typingDot, animationDelay: '0.2s' }} />
                <div style={{ ...styles.typingDot, animationDelay: '0.4s' }} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              ...styles.chatInputContainer,
              ...(isDark ? styles.chatInputContainerDark : {}),
            }}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask about Physical AI..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{
                ...styles.chatInput,
                ...(isDark ? styles.chatInputDark : {}),
              }}
            />
            <button
              style={styles.sendButton}
              onClick={handleSend}
              disabled={isLoading}
              aria-label="Send message"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
