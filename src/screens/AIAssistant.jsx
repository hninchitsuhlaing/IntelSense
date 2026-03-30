import { useState } from "react";
import { Card, Button, AILabel } from "../components/UI.jsx";
import { useReviews } from "../context/ReviewsContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { chatWithContext } from "../services/aiService.jsx"; // Note: Changed to .js to match previous files

export default function AIAssistant() {
  const { reviews } = useReviews();
  const { user } = useAuth();
  const { dataLang, t } = useLanguage();
  
  const [messages, setMessages] = useState([
    { role: "bot", text: t("askQuestions") }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatInputStyle = {
    flex: 1,
    background: "var(--bg-input)", 
    border: "1px solid var(--border)", 
    borderRadius: "12px",
    padding: "16px 20px",
    color: "#000000", 
    fontWeight: 500,
    fontSize: "15px",
    fontFamily: "var(--font-body)",
    outline: "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    caretColor: "var(--accent)",
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input; // Store it before clearing
    setInput("");
    setLoading(true);

    try {
      const aiResponse = await chatWithContext(currentInput, reviews, user?.email, dataLang);
      setMessages(prev => [...prev, { role: "bot", text: aiResponse }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "bot", text: "I encountered an error. Please check your API key." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", gap: 20, height: "100%", animation: "fadeSlideIn 0.35s ease" }}>
      
      {/* Main Chat Area */}
      <Card style={{ flex: 1, display: "flex", flexDirection: "column", padding: 0, overflow: "hidden", background: "var(--bg-elevated)" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.02)" }}>
          <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>{t("intelSenseAiAssistant")}</div>
          <AILabel />
        </div>

        {/* Scrollable Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
          {messages.map((m, i) => {
            const formatMarkdown = (text) => {
              const html = text.replace(/\\*\\*(.*?)\\*\\*/g, '<strong style="color:var(--accent); font-weight:700;">$1</strong>');
              return { __html: html };
            };
            
            return (
            <div key={i} style={{
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "85%",
              padding: "16px 20px",
              borderRadius: m.role === "user" ? "20px 20px 2px 20px" : "20px 20px 20px 2px",
              background: m.role === "user" ? "var(--accent)" : "rgba(255, 255, 255, 0.05)",
              color: m.role === "user" ? "#000" : "var(--text-primary)",
              fontWeight: m.role === "user" ? 600 : 400,
              fontSize: "14px",
              lineHeight: "1.7",
              boxShadow: m.role === "user" ? "0 4px 12px rgba(45,140,158,0.2)" : "0 4px 12px rgba(0,0,0,0.1)",
              border: m.role === "bot" ? "1px solid var(--border-subtle, #333)" : "none",
              whiteSpace: "pre-wrap",
              fontFamily: "var(--font-body)",
              letterSpacing: "0.2px"
            }} dangerouslySetInnerHTML={formatMarkdown(m.text)} />
          )})}
          {loading && (
            <div style={{ alignSelf: "flex-start", color: "var(--accent)", fontSize: 12, fontWeight: 600, fontFamily: "var(--font-mono)" }}>
              ● AI ANALYZING REVIEWS...
            </div>
          )}
        </div>

        {/* Input Area - FIXED STYLES HERE */}
        <div style={{ padding: "20px", borderTop: "1px solid var(--border)", display: "flex", gap: 10, background: "rgba(0,0,0,0.2)" }}>
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={t("typeYourQuestion")}
            style={chatInputStyle}
            autoFocus 
          />
          <Button variant="primary" onClick={handleSend} disabled={loading} style={{ padding: "0 24px" }}>
            {loading ? "..." : t("send")}
          </Button>
        </div>
      </Card>

      {/* Stats Summary Sidebar */}
      <div style={{ width: 280, display: "flex", flexDirection: "column", gap: 16 }}>
        <Card>
          <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginBottom: 12, letterSpacing: 1 }}>{t("knowledgeBase")}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>{t("totalReviews")}</span>
              <span style={{ color: "var(--accent)", fontWeight: 700, background: "var(--accent-bg)", padding: "2px 8px", borderRadius: 4 }}>{reviews.length}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>{t("criticalIssues")}</span>
              <span style={{ color: "var(--danger)", fontWeight: 700 }}>
                {reviews.filter(r => r.sentiment === "Negative").length}
              </span>
            </div>
          </div>
        </Card>
        
        <div style={{ padding: "0 10px", fontSize: 11, color: "var(--text-muted)", lineHeight: 1.5 }}>
          💡 Tip: You can ask "What are the top 3 complaints in the Maintenance department?"
        </div>
      </div>
    </div>
  );
}