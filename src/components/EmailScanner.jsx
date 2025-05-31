import React, { useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { ParticleBackground } from './ParticleBackground';
import { FaArrowLeft, FaShieldAlt } from 'react-icons/fa';
import useSound from 'use-sound';
import hoverSound from '../assets/sounds/hover.mp3';
import clickSound from '../assets/sounds/click.mp3';
import InfoButton from './common/InfoButton';
import './EmailScanner.css';

const API_KEY = "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";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

const SYSTEM_PROMPT = {
  role: "system",
  content:
    "You are a cybersecurity expert assistant. Provide precise and technically accurate responses about phishing, malware, spam, ransomware, social engineering, and other cyber threats. Be concise but clear and do not include unnecessary information.",
};

export default function EmailScanner() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);
  const [playHover] = useSound(hoverSound, { volume: 3.9 });
  const [playClick] = useSound(clickSound, { volume: 3.9 });

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    // Auto-resize textarea
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = async () => {
    const userPrompt = input.trim();
    if (!userPrompt || loading) return;

    setMessages((msgs) => [
      ...msgs,
      { text: userPrompt, isUser: true },
      { text: "Analyzing cybersecurity patterns...", isUser: false, loading: true },
    ]);
    setInput("");
    setLoading(true);

    try {
      const body = {
        model: "deepseek/deepseek-chat-v3-0324:free",
        messages: [SYSTEM_PROMPT, { role: "user", content: userPrompt }],
      };

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost",
          "X-Title": "Cyber Chat",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      setMessages((msgs) => {
        // Remove loading message
        const msgsWithoutLoading = msgs.filter((msg) => !msg.loading);
        if (data && data.choices && data.choices.length > 0) {
          return [
            ...msgsWithoutLoading,
            { text: data.choices[0].message.content, isUser: false },
          ];
        } else {
          return [
            ...msgsWithoutLoading,
            { text: "⚠️ Threat intel unavailable. Try again later.", isUser: false },
          ];
        }
      });
    } catch (err) {
      setMessages((msgs) => {
        const msgsWithoutLoading = msgs.filter((msg) => !msg.loading);
        return [
          ...msgsWithoutLoading,
          { text: "❌ Cyber link disrupted. Check console for logs.", isUser: false },
        ];
      });
      // eslint-disable-next-line
      console.error(err);
    } finally {
      setLoading(false);
      setTimeout(scrollToBottom, 100);
    }
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="auth-container">
      <ParticleBackground />
      <div className="detector-content">
        <div className="detector-box">
          <div className="header-section">
            <h2 className="login-title">EMAIL SECURITY SCANNER</h2>
            <p className="auth-subtitle">Analyze emails for spam, phishing attempts, and malicious content</p>
          </div>

          <div className="chat-interface">
            <div className="chat-messages" id="chatMessages">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`message ${msg.isUser ? "user-message" : "bot-message"} ${
                    msg.loading ? "loading" : ""
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="input-container">
              <textarea
                id="userInput"
                ref={textareaRef}
                placeholder="Paste email content to analyze for threats..."
                rows={1}
                value={input}
                onChange={handleInput}
                onKeyPress={handleKeyPress}
                disabled={loading}
                className="auth-input"
                onMouseEnter={() => playHover()}
                autoFocus
              />
              <button 
                onClick={sendMessage} 
                disabled={loading || !input.trim()}
                className="auth-button"
                onMouseEnter={() => playHover()}
              >
                <FaShieldAlt />
                <span>{loading ? 'Analyzing...' : 'Analyze'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}