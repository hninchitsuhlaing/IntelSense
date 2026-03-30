import { useState, useEffect } from "react";
import ProfileDropdown from "./ProfileDropdown.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function TopBar({ screen, onToggleSidebar, onNavigateSettings }) {
  const { user } = useAuth();
  const { t } = useLanguage();

  const getScreenTitle = (id) => {
    const keyMap = {
      dashboard: "dashboard",
      departments: "departments",
      actionmap: "actionMap",
      reviews: "reviewsFeed",
      ai: "aiAssistant",
      responder: "smartResponder",
      reports: "reports",
      settings: "settings",
    };
    return t(keyMap[id] || id).toUpperCase();
  };
  const title = getScreenTitle(screen);

  return (
    <header style={{
      height: 60,
      borderBottom: "1px solid var(--border)",
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "0 24px",
      background: "var(--bg-surface)",
      flexShrink: 0,
      position: "relative",
      zIndex: 100,
    }}>
      <button
        onClick={onToggleSidebar}
        style={{
          width: 34, height: 34,
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          color: "var(--text-secondary)",
          fontSize: 14,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}
      >
        ☰
      </button>

      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <h1 style={{
          fontSize: 16, fontWeight: 800, color: "var(--text-primary)",
          letterSpacing: 1.5, fontFamily: "var(--font-mono)", textTransform: "uppercase",
        }}>
          {title}
        </h1>
        
      </div>

      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16 }}>
        <CurrentTime />

        

        {user && <ProfileDropdown onNavigateSettings={onNavigateSettings} />}
      </div>
    </header>
  );
}

function CurrentTime() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);
  const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  return (
    <div style={{ textAlign: "right" }}>
      <div style={{ fontSize: 13, fontFamily: "var(--font-mono)", color: "var(--text-primary)", fontWeight: 600 }}>{time}</div>
      <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{date}</div>
    </div>
  );
}