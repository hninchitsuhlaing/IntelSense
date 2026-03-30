import { NAV_ITEMS } from "../data/mockData.js";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function Sidebar({ active, onNavigate, collapsed, onToggle }) {
  const { t } = useLanguage();

  const getNavLabel = (id) => {
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
    return t(keyMap[id] || id);
  };
  return (
    <aside style={{
      width: collapsed ? 0 : 220,
      minWidth: collapsed ? 0 : 220,
      background: "var(--sidebar-bg)",
      borderRight: "1px solid var(--sidebar-border)",
      display: "flex",
      flexDirection: "column",
      transition: "all 0.25s ease",
      overflow: "hidden",
    }}>
      {/* Logo */}
      <div style={{
        padding: "22px 20px 18px",
        borderBottom: "1px solid var(--sidebar-border)",
      }}>
        <div style={{
          fontSize: 18,
          fontWeight: 800,
          fontFamily: "var(--font-display)",
          letterSpacing: 0.3,
          color: "var(--sidebar-text)",
        }}>
          <span style={{ color: "var(--sidebar-accent)" }}>Intel</span>Sense
        </div>
        <div style={{
          fontSize: 9,
          color: "var(--sidebar-text-muted)",
          letterSpacing: 3,
          marginTop: 3,
          fontFamily: "var(--font-mono)",
          textTransform: "uppercase",
        }}>
          AI Command Center
        </div>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>
        {NAV_ITEMS.map((item, idx) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: isActive ? 700 : 400,
                background: isActive ? "var(--sidebar-active)" : "transparent",
                color: isActive ? "var(--sidebar-text)" : "var(--sidebar-text-muted)",
                borderLeft: `3px solid ${isActive ? "var(--sidebar-accent)" : "transparent"}`,
                marginBottom: 2,
                transition: "all 0.15s",
                textAlign: "left",
                whiteSpace: "nowrap",
                animationDelay: `${idx * 40}ms`,
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.color = "var(--sidebar-text)";
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--sidebar-text-muted)";
                }
              }}
            >
              <span style={{ fontSize: 16, lineHeight: 1 }}>{item.icon}</span>
              <span>{getNavLabel(item.id)}</span>
              {item.id === "reviews" && (
                <span style={{
                  marginLeft: "auto",
                  background: "#E05A5A",
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 700,
                  borderRadius: 8,
                  padding: "1px 6px",
                  fontFamily: "var(--font-mono)",
                }}>
                  LIVE
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
