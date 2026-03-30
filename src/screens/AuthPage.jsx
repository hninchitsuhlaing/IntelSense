import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function AuthPage() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email.trim().toLowerCase(), password);
    } catch (err) {
      console.error("Auth Exception:", err);
      let msg = err.message;
      if (err.code === "auth/user-not-found") msg = "No account found with this email.";
      if (err.code === "auth/wrong-password") msg = "Incorrect password.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      minHeight: "100vh", width: "100vw",
      background: "var(--bg-base)", fontFamily: "var(--font-body)",
    }}>
      {/* Glow */}
      <div style={{
        position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)",
        width: 700, height: 500,
        background: "radial-gradient(ellipse, rgba(45,140,158,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ width: "100%", maxWidth: 440, padding: "0 20px", position: "relative" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 42, marginBottom: 10 }}>🏨</div>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800,
            color: "var(--text-primary)", letterSpacing: 0.5,
          }}>
            IntelSense <span style={{ color: "var(--accent)" }}>AI</span>
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 5, fontFamily: "var(--font-mono)", letterSpacing: 1.5 }}>
            HOTEL COMMAND CENTER
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)", padding: "28px 32px",
          boxShadow: "var(--shadow-card)",
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 20 }}>{t("signIn")}</h2>
          
          <form onSubmit={handleSubmit}>
            <Field label={t("email")}>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@intelsense.ai" required />
            </Field>

            <Field label={t("password")}>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            </Field>

            {error && (
              <div style={{
                background: "var(--danger-bg)", border: "1px solid var(--danger)",
                borderRadius: "var(--radius-sm)", padding: "10px 14px",
                color: "var(--danger)", fontSize: 13, marginBottom: 16,
              }}>{error}</div>
            )}

            <button
              type="submit" disabled={loading}
              style={{
                width: "100%", padding: "11px",
                background: loading ? "var(--accent-dim)" : "var(--accent)",
                border: "none", borderRadius: "var(--radius-sm)",
                color: "#fff", fontSize: 14, fontWeight: 700,
                fontFamily: "var(--font-body)", cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.2s", letterSpacing: 0.3, marginTop: 4,
              }}
            >
              {loading ? t("signingIn") : t("signIn")}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 12, marginTop: 16 }}>
          {t("internalAccessOnly")}
        </p>
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const inputStyle = {
  width: "100%", padding: "10px 14px",
  background: "var(--bg-input)", border: "1px solid var(--border)",
  borderRadius: "var(--radius-sm)", color: "var(--text-primary)",
  fontSize: 14, fontFamily: "var(--font-body)", outline: "none",
};

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 11, color: "var(--text-secondary)", marginBottom: 6, fontFamily: "var(--font-mono)", letterSpacing: 1, textTransform: "uppercase" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({ type = "text", value, onChange, placeholder, required }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type} value={value} onChange={onChange}
      placeholder={placeholder} required={required}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{ ...inputStyle, borderColor: focused ? "var(--accent)" : "var(--border)", transition: "border-color 0.2s" }}
    />
  );
}
