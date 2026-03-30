import { useLanguage } from "../context/LanguageContext.jsx";

export function Card({ children, style = {}, className = "", onClick }) {
  return (
    <div
      className={`card ${className}`}
      onClick={onClick}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "20px",
        boxShadow: "var(--shadow-card)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

//  LiveBadge 
export function LiveBadge() {
  const { t } = useLanguage();
  return (
    <div className="live-badge">
      <div className="live-dot" />
      {t("liveUpdating")}
    </div>
  );
}

//  SectionTitle 
export function SectionTitle({ children, sub }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 13, fontFamily: "var(--font-mono)", color: "var(--text-muted)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 3 }}>
        {sub}
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-display)", letterSpacing: 0.3 }}>
        {children}
      </h2>
    </div>
  );
}

//  PriorityBadge 
export function PriorityBadge({ level }) {
  return <span className={`priority-badge ${level}`}>{level}</span>;
}

//  Toggle 
export function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: 46, height: 26, borderRadius: 13,
        background: checked ? "var(--accent)" : "var(--bg-elevated)",
        border: `1px solid ${checked ? "var(--accent)" : "var(--border)"}`,
        position: "relative", cursor: "pointer", transition: "all 0.2s", flexShrink: 0,
      }}
    >
      <div style={{
        width: 20, height: 20, borderRadius: "50%", background: "#fff",
        position: "absolute", top: 2,
        left: checked ? 22 : 2,
        transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
      }} />
    </button>
  );
}

//  Button 
export function Button({ children, variant = "secondary", onClick, style = {}, disabled }) {
  const variants = {
    primary:   { background: "var(--accent)", color: "#000", border: "none", fontWeight: 700 },
    secondary: { background: "var(--bg-elevated)", color: "var(--text-primary)", border: "1px solid var(--border)" },
    ghost:     { background: "transparent", color: "var(--accent)", border: "1px solid var(--accent)" },
    danger:    { background: "var(--danger-bg)", color: "var(--danger)", border: "1px solid #ef444450" },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "10px 18px", borderRadius: "var(--radius-sm)",
        fontSize: 13, fontFamily: "var(--font-body)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "all 0.15s",
        ...variants[variant],
        ...style,
      }}
    >
      {children}
    </button>
  );
}

//  AlertRow 
export function AlertRow({ room, issue, sev, color }) {
  return (
    <div style={{ borderLeft: `3px solid ${color}`, paddingLeft: 10, marginBottom: 14 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>{room}</div>
      <div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 2 }}>{issue}</div>
      <span style={{ fontSize: 10, color: color, fontFamily: "var(--font-mono)", fontWeight: 700, letterSpacing: 1 }}>{sev}</span>
    </div>
  );
}

//  TabBar 
export function TabBar({ tabs, active, onChange }) {
  return (
    <div style={{
      display: "flex", gap: 2,
      background: "var(--bg-elevated)", borderRadius: 10, padding: 4,
      width: "fit-content", border: "1px solid var(--border)",
    }}>
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          style={{
            padding: "7px 16px", borderRadius: 8, border: "none", fontSize: 13,
            fontWeight: active === tab ? 700 : 400,
            background: active === tab ? "var(--bg-card)" : "transparent",
            color: active === tab ? "var(--accent)" : "var(--text-secondary)",
            borderBottom: active === tab ? "2px solid var(--accent)" : "2px solid transparent",
            transition: "all 0.15s",
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

//  AILabel 
export function AILabel() {
  const { t } = useLanguage();
  return (
    <span style={{
      fontSize: 10, color: "var(--accent)",
      background: "var(--accent-bg)", border: "1px solid var(--accent-glow)",
      borderRadius: 10, padding: "2px 8px",
      fontFamily: "var(--font-mono)", letterSpacing: 0.5,
    }}>
      {t("aiGenerated")}
    </span>
  );
}
