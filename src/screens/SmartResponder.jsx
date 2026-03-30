import { useState, useEffect } from "react";
import { Card, Button, AILabel, PriorityBadge } from "../components/UI.jsx";
import { useReviews } from "../context/ReviewsContext.jsx";
import { SENTIMENT_COLOR } from "../utils/helpers.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { draftReviewResponse, translateText } from "../services/aiService.jsx";

const EDITOR_TOOLBAR = ["B", "I", "U", "</>", "≡", "≣"];

export default function SmartResponder() {
  const { reviews } = useReviews();
  const { user } = useAuth();
  const { dataLang, t } = useLanguage();

  const [selectedId, setSelectedId] = useState(null);
  const [response, setResponse] = useState("");
  const [drafts, setDrafts] = useState({ native: "", english: "" });
  const [showEnglish, setShowEnglish] = useState(false);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [sent, setSent] = useState(false);
  const [filter, setFilter] = useState("All");

  // 1. Auto-select first review on load
  useEffect(() => {
    if (!selectedId && reviews.length > 0) {
      setSelectedId(reviews[0].id);
    }
  }, [reviews, selectedId]);

  // 2. Filter Logic
  const filteredReviews = filter === "All"
    ? reviews
    : reviews.filter(r => r.sentiment === filter);

  const selectedReview = reviews.find(r => r.id === selectedId) || (reviews.length > 0 ? reviews[0] : null);

  // 3. Handlers
  const selectReview = (r) => {
    setSelectedId(r.id);
    setSent(false);
    setEditing(false);
    setDrafts({ native: "", english: "" });
    setShowEnglish(false);
    setResponse(t("clickRegenerate"));
  };

  const regenerate = async () => {
    if (!selectedReview) return;
    setLoading(true);
    setSent(false);

    try {
      const aiDrafts = await draftReviewResponse(selectedReview, user?.email, dataLang);
      setDrafts(aiDrafts);
      setResponse(showEnglish ? aiDrafts.english : aiDrafts.native);
    } catch (err) {
      setResponse("Error generating response. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLang = async () => {
    if (!drafts.native || loading || translating) return;

    const currentText = response;
    // Which language are we going TO?
    const targetLang = showEnglish ? dataLang : "English";
    // Which language are we coming FROM?
    const currentLangKey = showEnglish ? "english" : "native";
    const targetLangKey = showEnglish ? "native" : "english";

    const hasChanged = currentText !== drafts[currentLangKey];

    if (hasChanged) {
      setTranslating(true);
      try {
        const translated = await translateText(currentText, targetLang, selectedReview?.text);
        setDrafts(prev => ({
          ...prev,
          [currentLangKey]: currentText,
          [targetLangKey]: translated
        }));
        setResponse(translated);
      } catch (err) {
        console.error("Translation fail", err);
        setResponse(drafts[targetLangKey]);
      } finally {
        setTranslating(false);
      }
    } else {
      setResponse(drafts[targetLangKey]);
    }

    setShowEnglish(!showEnglish);
  };

  const handleSend = () => {
    setSent(true);
    setEditing(false);
    setTimeout(() => setSent(false), 3000);
  };

  const sentimentColor = selectedReview
    ? (SENTIMENT_COLOR[selectedReview.sentiment] || "var(--text-muted)")
    : "var(--text-muted)";

  return (
    <div style={{ display: "flex", gap: 20, height: "100%", animation: "fadeSlideIn 0.35s ease" }}>

      {/* Left Column: Review Selection */}
      <div style={{ width: 340, display: "flex", flexDirection: "column", gap: 14 }}>
        <Card style={{ padding: "14px 16px", display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", letterSpacing: 1.5 }}>{t("selectReview")}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div className="live-dot" />
              <span style={{ fontSize: 10, color: "var(--accent)", fontFamily: "var(--font-mono)" }}>{reviews.length} {t("live")}</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
            {["All", "Negative", "Positive"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: "4px 10px", borderRadius: 6, border: "none", fontSize: 11,
                fontWeight: filter === f ? 700 : 400,
                background: filter === f ? "var(--bg-elevated)" : "transparent",
                color: filter === f ? "var(--text-primary)" : "var(--text-muted)",
                cursor: "pointer",
              }}>{t(f.toLowerCase())}</button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
            {filteredReviews.map(r => (
              <button
                key={r.id}
                onClick={() => selectReview(r)}
                style={{
                  width: "100%", display: "flex", gap: 10, alignItems: "center",
                  padding: "10px 12px", borderRadius: 8, border: "1px solid",
                  borderColor: r.id === selectedId ? "var(--accent-glow)" : "transparent",
                  background: r.id === selectedId ? "var(--accent-bg)" : "var(--bg-elevated)",
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: 18 }}>{r.emoji}</span>
                <div style={{ textAlign: "left", flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>"{r.text}"</div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{r.department}</div>
                </div>
                <PriorityBadge level={r.priority} />
              </button>
            ))}
          </div>
        </Card>

        {selectedReview && (
          <Card>
            <div style={{ fontSize: 14, color: "var(--text-primary)", lineHeight: 1.6, marginBottom: 10 }}>"{selectedReview.text}"</div>
            <div style={{ display: "flex", gap: 6 }}>
              <span style={{ fontSize: 12, color: sentimentColor, background: sentimentColor + "20", padding: "3px 10px", borderRadius: 6 }}>{t(selectedReview.sentiment.toLowerCase())}</span>
              {selectedReview.room && <span style={{ fontSize: 12, color: "var(--text-secondary)", background: "var(--bg-elevated)", padding: "3px 10px", borderRadius: 6 }}>{t("room")} {selectedReview.room}</span>}
            </div>
          </Card>
        )}
      </div>

      {/* Right Column: AI Editor */}
      <Card style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16, paddingBottom: 14, borderBottom: "1px solid var(--border)" }}>
          <span style={{ fontSize: 20 }}>💡</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>{t("aiSuggestedResponse")}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{t("reviewAndEditBefore")}</div>
          </div>
          <button
            onClick={handleToggleLang}
            disabled={!drafts.native || loading || translating}
            style={{
              background: showEnglish ? "var(--accent)" : "transparent",
              color: showEnglish ? "#000" : "var(--accent)",
              border: "1px solid var(--accent)",
              borderRadius: 6,
              padding: "4px 12px",
              fontSize: 11,
              fontWeight: 600,
              cursor: drafts.native && !loading && !translating ? "pointer" : "not-allowed",
              marginRight: 10,
              opacity: drafts.native && !loading && !translating ? 1 : 0.5
            }}>
            {translating ? t("loading") : (showEnglish ? `🌐 ${t("translatedToEnglish")}` : `🌐 ${t("guestsLanguage")}`)}
          </button>
          <AILabel />
        </div>

        <div style={{ background: "var(--bg-elevated)", padding: "8px 12px", display: "flex", gap: 6, borderBottom: "1px solid var(--border)", borderRadius: "8px 8px 0 0" }}>
          {EDITOR_TOOLBAR.map(t => <button key={t} style={{ background: "none", border: "none", color: "var(--text-secondary)", fontSize: 13 }}>{t}</button>)}
        </div>

        <textarea
          value={loading ? t("analyzingReview") : (translating ? "Translating..." : response)}
          onChange={e => setResponse(e.target.value)}
          readOnly={!editing || loading || translating}
          style={{
            flex: 1, width: "100%", padding: "24px 28px", fontSize: 16, lineHeight: 1.8,
            fontFamily: "var(--font-body)", letterSpacing: "0.2px",
            background: "var(--bg-input)", color: "#000000", fontWeight: 500,
            border: "1px solid var(--border)", borderRadius: "0 0 10px 10px", resize: "none",
            outline: "none",
            transition: "border 0.2s ease, box-shadow 0.2s ease",
            boxShadow: editing ? "inset 0 2px 8px rgba(0,0,0,0.05), 0 0 0 2px var(--accent)" : "none",
            borderColor: editing ? "var(--accent)" : "var(--border)"
          }}
        />

        {sent && (
          <div style={{ marginTop: 10, padding: 10, borderRadius: 8, background: "var(--accent-bg)", color: "var(--accent)", textAlign: "center" }}>
            ✓ {t("responseSent")}
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <Button variant="ghost" onClick={regenerate} style={{ flex: 1 }} disabled={loading || !selectedReview}>🔄 {t("regenerate")}</Button>
          <Button variant="secondary" onClick={() => setEditing(!editing)} style={{ flex: 1 }} disabled={!response}>✏️ {editing ? t("lock") : t("edit")}</Button>
          <Button variant="primary" onClick={handleSend} style={{ flex: 1.5 }} disabled={loading || !response}>✓ {t("sendResponse")}</Button>
        </div>
      </Card>
    </div>
  );
}