import { useState } from "react";
import { Card, Toggle, Button } from "../components/UI.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { seedFirestore } from "../utils/seedDatabase.js"; // Ensure this matches your filename
//import { seedFirestore, clearFirestore } from "../utils/seedDatabase.js"; // Added clearFirestore
export default function Settings({ apiKey, setApiKey }) {
  const { user, updateProfile, adminCreateUser } = useAuth();

  // Profile state
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [role, setRole] = useState(user?.role || "Staff");

  // Password state
  const [curPass, setCurPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [conPass, setConPass] = useState("");
  const [passMsg, setPassMsg] = useState(null);

  // Language state
  const { uiLang, setUiLang, dataLang, setDataLang, t } = useLanguage();

  // Privacy state
  const [maskGuest, setMaskGuest] = useState(true);
  const [anonFeedback, setAnonFeedback] = useState(false);
  const [autoReply, setAutoReply] = useState(false);

  // Save state
  const [profileSaved, setProfileSaved] = useState(false);

  // Admin: Create Account Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: "", email: "", password: "", role: "Front Desk" });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState(false);

  const isAdmin = user?.role === "Hotel Manager" || user?.role === "IT Admin";

  const handleSaveProfile = async () => {
    await updateProfile({ name, role }); // email is managed by Auth
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handleResetPassword = () => {
    if (!curPass) { setPassMsg({ type: "err", text: "Please enter your current password." }); return; }
    if (newPass.length < 6) { setPassMsg({ type: "err", text: "New password must be at least 6 characters." }); return; }
    if (newPass !== conPass) { setPassMsg({ type: "err", text: "New passwords do not match." }); return; }
    setPassMsg({ type: "ok", text: "Password updated successfully!" });
    setCurPass(""); setNewPass(""); setConPass("");
    setTimeout(() => setPassMsg(null), 3000);
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    setCreateError("");
    setCreateLoading(true);
    try {
      if (newStaff.password.length < 6) throw new Error("Password must be at least 6 characters.");
      await adminCreateUser(newStaff.email, newStaff.password, newStaff.name, newStaff.role);
      setCreateSuccess(true);
      setNewStaff({ name: "", email: "", password: "", role: "Front Desk" });
      setTimeout(() => {
        setCreateSuccess(false);
        setShowCreateModal(false);
      }, 2000);
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setCreateLoading(false);
    }
  };

  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";

  // Visibility Fix: Styled Input
  const inputStyle = {
    width: "100%",
    padding: "9px 12px",
    borderRadius: 8,
    fontSize: 13,
    boxSizing: "border-box",
    background: "#121212", // Dark background
    border: "1px solid var(--border)",
    color: "#ffffff", // Pure white text
    outline: "none"
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "fadeSlideIn 0.35s ease" }}>

      {profileSaved && (
        <div style={{ padding: "12px 20px", borderRadius: 10, fontSize: 13, background: "var(--accent-bg)", border: "1px solid var(--accent-glow)", color: "var(--accent)", textAlign: "center", fontWeight: 600, animation: "fadeSlideIn 0.2s ease" }}>
          ✓ Profile saved successfully
        </div>
      )}

      {/* Row 1: Profile + Password + Language */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>

        {/* Profile Settings */}
        <Card>
          <SectionHead icon="👤" title={t("profile")} sub="Your account details" />

          {/* Avatar */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "var(--accent-bg)", border: "2px solid var(--accent-glow)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, fontWeight: 800, color: "var(--accent)",
              fontFamily: "var(--font-mono)", flexShrink: 0,
            }}>
              {initials}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{name || "Your Name"}</div>
              <div style={{ fontSize: 10, color: "var(--accent)", fontFamily: "var(--font-mono)", marginTop: 2 }}>● {role}</div>
            </div>
          </div>

          {[
            { label: t("fullName"), val: name, set: setName, placeholder: "Your full name" },
            { label: t("email"), val: email, set: setEmail, placeholder: "you@hotel.com", type: "email" },
          ].map(f => (
            <div key={f.label} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)", letterSpacing: 1, marginBottom: 4, textTransform: "uppercase" }}>{f.label}</div>
              <input
                type={f.type || "text"}
                value={f.val}
                onChange={e => f.set(e.target.value)}
                placeholder={f.placeholder}
                style={inputStyle}
              />
            </div>
          ))}

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)", letterSpacing: 1, marginBottom: 4, textTransform: "uppercase" }}>{t("role")}</div>
            <input 
              type="text" 
              value={role} 
              readOnly 
              style={{ ...inputStyle, background: "var(--bg-elevated)", color: "var(--text-muted)", cursor: "not-allowed" }} 
            />
          </div>

          <Button variant="primary" onClick={handleSaveProfile} style={{ width: "100%" }}>
            {t("saveProfile")}
          </Button>
        </Card>

        {/* Reset Password */}
        <Card>
          <SectionHead icon="🔑" title={t("resetPassword")} sub="Change your login password" />

          {[
            { label: t("currentPassword"), val: curPass, set: setCurPass, placeholder: "Enter current password" },
            { label: t("newPassword"), val: newPass, set: setNewPass, placeholder: "Min. 6 characters" },
            { label: t("confirmPassword"), val: conPass, set: setConPass, placeholder: "Repeat new password" },
          ].map(f => (
            <div key={f.label} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)", letterSpacing: 1, marginBottom: 4, textTransform: "uppercase" }}>{f.label}</div>
              <input
                type="password"
                value={f.val}
                onChange={e => f.set(e.target.value)}
                placeholder={f.placeholder}
                style={inputStyle}
              />
            </div>
          ))}

          {passMsg && (
            <div style={{
              padding: "9px 13px", borderRadius: 8, fontSize: 12, marginBottom: 12, lineHeight: 1.5,
              background: passMsg.type === "ok" ? "var(--accent-bg)" : "var(--danger-bg)",
              border: `1px solid ${passMsg.type === "ok" ? "var(--accent-glow)" : "#ef444440"}`,
              color: passMsg.type === "ok" ? "var(--accent)" : "var(--danger)",
              animation: "fadeSlideIn 0.2s ease",
            }}>
              {passMsg.type === "ok" ? "✓" : "⚠"} {passMsg.text}
            </div>
          )}

          <Button variant="ghost" onClick={handleResetPassword} style={{ width: "100%" }}>
            {t("updatePassword")}
          </Button>
        </Card>

        {/* Language */}
        <Card>
          <SectionHead icon="🌐" title={t("language")} sub="Display & data language" />
          {[
            { label: t("uiLanguage"), val: uiLang, set: setUiLang, opts: ["English", "Thai", "Japanese", "Chinese", "Russian", "Arabic"] },
            { label: t("reviewLanguage"), val: dataLang, set: setDataLang, opts: ["Thai", "English", "Japanese", "Korean", "Auto-detect"] },
          ].map(f => (
            <div key={f.label} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)", letterSpacing: 1, marginBottom: 4, textTransform: "uppercase" }}>{f.label}</div>
              <select value={f.val} onChange={e => f.set(e.target.value)} style={{ ...inputStyle, width: "100%" }}>
                {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
          <div style={{ padding: "10px 12px", background: "var(--bg-elevated)", borderRadius: 8, fontSize: 11, color: "var(--text-muted)", lineHeight: 1.6 }}>
            💡 Gemini AI auto-translates reviews to your chosen UI language
          </div>
        </Card>
      </div>

      {/* Row 2: Privacy + Staff Management + Developer Tools */}
      <div style={{ display: "grid", gridTemplateColumns: isAdmin ? "1fr 1fr 1fr" : "1fr 1fr", gap: 16 }}>

        {/* Privacy Controls */}
        <Card>
          <SectionHead icon="🔒" title={t("privacyControls")} sub="Guest data protection" />
          {[
            { label: t("maskGuestInfo"), sub: "Hide names & contact details", val: maskGuest, set: setMaskGuest },
            { label: t("anonymousFeedback"), sub: "Remove identifiers from exports", val: anonFeedback, set: setAnonFeedback },
            { label: t("autoReplyMode"), sub: "Send AI responses automatically", val: autoReply, set: setAutoReply },
          ].map(ctrl => (
            <div key={ctrl.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 12 }}>
              <div>
                <div style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 500 }}>{ctrl.label}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{ctrl.sub}</div>
              </div>
              <Toggle checked={ctrl.val} onChange={ctrl.set} />
            </div>
          ))}
        </Card>

        {/* Staff Management (ADMIN ONLY) */}
        {isAdmin && (
          <Card>
            <SectionHead icon="👥" title={t("staffManagement")} sub={t("manageHotelAccounts")} />
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16, lineHeight: 1.5 }}>
              {t("createStaffDesc")}
            </p>
            <Button variant="primary" onClick={() => setShowCreateModal(true)} style={{ width: "100%", padding: '12px' }}>
              ➕ {t("createStaffAccount")}
            </Button>
          </Card>
        )}

        {/* Developer Seeding Tool */}
        <Card style={{ border: "1px dashed var(--border)", background: "rgba(99, 102, 241, 0.03)" }}>
            <SectionHead icon="🧪" title={t("systemTools")} sub={t("maintenanceAndDemos")} />
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16, lineHeight: 1.5 }}>
              Manage your environment. Seed to show AI analysis, or clear to reset the dashboard.
            </p>
            
            <div style={{ display: "flex", gap: 10 }}>
              <Button variant="primary" onClick={seedFirestore} style={{ flex: 1.5 }}>🚀 {t("seedDemoData")}</Button>
              <Button 
                variant="ghost" 
                onClick={() => { if(window.confirm("Delete all reviews?")) clearFirestore(); }} 
                style={{ flex: 1, color: "var(--danger)" }}
              >
                🗑️ {t("clear")}
              </Button>
            </div>
          
          <div style={{ textAlign: "right", marginTop: 24 }}>
            <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
              <span style={{ color: "var(--accent)" }}>Intel</span>Sense
            </div>
          </div>
        </Card>
      </div>

      {/* CREATE ACCOUNT MODAL */}
      {showCreateModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 2000, animation: "fadeSlideIn 0.3s ease",
        }}>
          <Card style={{ width: 400, padding: 32, position: "relative", border: "1px solid var(--accent-glow)" }}>
            <button 
              onClick={() => setShowCreateModal(false)}
              style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "var(--text-muted)", fontSize: 20, cursor: "pointer" }}
            >
              ✕
            </button>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>👥</div>
              <h3 style={{ fontSize: 20, color: "var(--text-primary)" }}>{t("createStaffAccount")}</h3>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{t("newAccountSecurely")}</p>
            </div>

            <form onSubmit={handleCreateStaff}>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 4, textTransform: "uppercase" }}>{t("fullName")}</div>
                <input 
                  required style={inputStyle} value={newStaff.name} 
                  onChange={e => setNewStaff({...newStaff, name: e.target.value})} 
                  placeholder={t("fullName")}
                />
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 4, textTransform: "uppercase" }}>{t("role")}</div>
                <select 
                  style={inputStyle} value={newStaff.role} 
                  onChange={e => setNewStaff({...newStaff, role: e.target.value})}
                >
                  {[
                    "Front Desk",
                    "Housekeeping",
                    "F&B Manager", 
                    "Concierge",
                    "Revenue Manager",
                    ...(user?.role === "Hotel Manager" ? ["Hotel Manager", "IT Admin"] : [])
                  ].map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 4, textTransform: "uppercase" }}>{t("email")}</div>
                <input 
                  type="email" required style={inputStyle} value={newStaff.email} 
                  onChange={e => setNewStaff({...newStaff, email: e.target.value})} 
                  placeholder="staff@hotel.com"
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 4, textTransform: "uppercase" }}>{t("password")}</div>
                <input 
                  type="password" required style={inputStyle} value={newStaff.password} 
                  onChange={e => setNewStaff({...newStaff, password: e.target.value})} 
                  placeholder="••••••••"
                />
              </div>

              {createError && (
                <div style={{ background: "var(--danger-bg)", color: "var(--danger)", padding: 10, borderRadius: 8, fontSize: 12, marginBottom: 16 }}>
                  ⚠ {createError}
                </div>
              )}
              {createSuccess && (
                <div style={{ background: "var(--accent-bg)", color: "var(--accent)", padding: 10, borderRadius: 8, fontSize: 12, marginBottom: 16 }}>
                  ✓ {t("accountCreatedSuccess")}
                </div>
              )}

              <Button variant="primary" type="submit" style={{ width: "100%", padding: 12 }} disabled={createLoading}>
                {createLoading ? t("loading") : t("createStaffAccount")}
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

function SectionHead({ icon, title, sub }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 18 }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--bg-elevated)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>{title}</div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>{sub}</div>
      </div>
    </div>
  );
}