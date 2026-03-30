import { useState } from "react";
import { Card, Button, PriorityBadge } from "../components/UI.jsx";
import { useReviews } from "../context/ReviewsContext.jsx";
import { db } from "../lib/firebase.jsx"; // Ensure this path is correct
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { SENTIMENT_COLOR, PRIORITY_COLOR } from "../utils/helpers.js";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function ReviewsFeed() {
  const { reviews } = useReviews();
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  
  // New Review Form State
  const [newReview, setNewReview] = useState({
    text: "",
    sentiment: "Neutral",
    department: "Housekeeping",
    priority: "LOW",
    room: ""
  });

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!newReview.text) return;
    setLoading(true);
    
    try {
      await addDoc(collection(db, "reviews"), {
        ...newReview,
        emoji: newReview.sentiment === "Positive" ? "✨" : newReview.sentiment === "Negative" ? "⚠️" : "💬",
        date: serverTimestamp(),
      });
      setNewReview({ text: "", sentiment: "Neutral", department: "Housekeeping", priority: "LOW", room: "" });
      setShowAdd(false);
    } catch (err) {
      console.error("Error adding document: ", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, height: "100%" }}>
      
      {/* ── Demo Controls ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: 18, color: "var(--text-primary)" }}>{t("guestFeedbackFeed")}</h2>
        <Button variant="primary" onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? `✕ ${t("close")}` : `+ ${t("addDemoReview")}`}
        </Button>
      </div>

      {/* ── Add Review Form (Demonstration Purpose) ── */}
      {showAdd && (
        <Card style={{ border: "1px solid var(--accent)", animation: "fadeSlideIn 0.2s ease" }}>
          <form onSubmit={handleAddReview} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <textarea
              placeholder={t("enterGuestFeedback")}
              value={newReview.text}
              onChange={(e) => setNewReview({...newReview, text: e.target.value})}
              style={{ ...inputStyle, height: 80, resize: "none" }}
            />
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <select style={inputStyle} value={newReview.sentiment} onChange={(e) => setNewReview({...newReview, sentiment: e.target.value})}>
                <option>Positive</option><option>Neutral</option><option>Negative</option>
              </select>
              <select style={inputStyle} value={newReview.department} onChange={(e) => setNewReview({...newReview, department: e.target.value})}>
                <option>Housekeeping</option><option>Maintenance</option><option>Front Desk</option><option>F&B</option>
              </select>
              <select style={inputStyle} value={newReview.priority} onChange={(e) => setNewReview({...newReview, priority: e.target.value})}>
                <option>LOW</option><option>MEDIUM</option><option>HIGH</option>
              </select>
              <input 
                placeholder={t("room")} style={{...inputStyle, width: 80}} 
                value={newReview.room}
                onChange={(e) => setNewReview({...newReview, room: e.target.value})}
              />
              <Button variant="primary" type="submit" disabled={loading} style={{ marginLeft: "auto" }}>
                {loading ? t("uploading") : t("pushToFirebase")}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* ── Existing Reviews List ── */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
        {reviews.map(r => (
           <Card key={r.id}>
             <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
               <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{t("room")} {r.room} • {r.department}</span>
               <PriorityBadge level={r.priority} />
             </div>
             <div style={{ color: "var(--text-primary)", fontSize: 14 }}>"{r.text}"</div>
           </Card>
        ))}
      </div>
    </div>
  );
}

const inputStyle = {
  background: "var(--bg-input)",
  border: "1px solid var(--border)",
  color: "white",
  padding: "10px",
  borderRadius: "8px",
  fontSize: "13px",
  outline: "none"
};