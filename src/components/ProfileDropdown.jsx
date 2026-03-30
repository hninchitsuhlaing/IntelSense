import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function ProfileDropdown({ onNavigateSettings }) {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [open, setOpen]  = useState(false);
  const ref              = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = user?.avatar || user?.name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Avatar button */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: 36, height: 36, borderRadius: "50%",
          background: open ? "var(--accent)" : "var(--bg-elevated)",
          border: `2px solid ${open ? "var(--accent)" : "var(--border)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 800,
          color: open ? "#000" : "var(--accent)",
          fontFamily: "var(--font-mono)",
          cursor: "pointer", transition: "all 0.2s",
          flexShrink: 0,
        }}
      >
        {initials}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 10px)", right: 0,
          width: 260, zIndex: 1000,
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: 14, boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)",
          animation: "fadeSlideIn 0.2s ease",
          overflow: "hidden",
        }}>
          {/* User info header */}
          <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--border)", background: "var(--bg-elevated)" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{
                width: 42, height: 42, borderRadius: "50%",
                background: "var(--accent-bg)", border: "2px solid var(--accent-glow)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 800, color: "var(--accent)",
                fontFamily: "var(--font-mono)", flexShrink: 0,
              }}>
                {initials}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user?.name}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user?.email}
                </div>
                <div style={{ fontSize: 10, color: "var(--accent)", fontFamily: "var(--font-mono)", marginTop: 2 }}>
                  {user?.role}
                </div>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div style={{ padding: "8px 0" }}>
            <MenuItem icon="👤" label={t("profile") + " & " + t("settings")} onClick={() => { onNavigateSettings(); setOpen(false); }} />
            
            <div style={{ height: 1, background: "var(--border)", margin: "6px 12px" }} />
            
            <MenuItem icon="🚪" label={t("signOut")} onClick={logout} color="var(--danger)" />
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon, label, onClick, badge, color }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: 10,
        padding: "9px 18px", border: "none",
        background: hover ? "var(--bg-elevated)" : "transparent",
        cursor: "pointer", textAlign: "left", transition: "background 0.1s",
      }}
    >
      <span style={{ fontSize: 15, flexShrink: 0 }}>{icon}</span>
      <span style={{ fontSize: 13, color: color || "var(--text-secondary)", flex: 1 }}>{label}</span>
      {badge && (
        <span style={{ background: "var(--danger)", color: "#fff", fontSize: 9, fontWeight: 700, borderRadius: 8, padding: "1px 6px", fontFamily: "var(--font-mono)" }}>
          {badge}
        </span>
      )}
    </button>
  );
}
