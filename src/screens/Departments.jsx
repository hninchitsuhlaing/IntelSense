import { useState } from "react";
import { Card, TabBar, LiveBadge } from "../components/UI.jsx";
import { MiniLineChart } from "../components/Charts.jsx";
import { useTrendData } from "../hooks/useIntel.js";
import { DEPT_DATA } from "../data/mockData.js";
import { useLanguage } from "../context/LanguageContext.jsx";

const TABS = Object.keys(DEPT_DATA);

export default function Departments() {
  const [active, setActive] = useState("Housekeeping");
  const trendData = useTrendData(32, 55, 18);
  const { t } = useLanguage();

  const dept = DEPT_DATA[active];

  // Map category names to translation keys
  const deptKeyMap = {
    "Housekeeping": "hk",
    "Front Desk": "fd",
    "Maintenance": "maint",
    "F&B": "fb"
  };
  const key = deptKeyMap[active];

  // Get translated arrays
  const translatedIssues = t(`${key}Issues`) || dept.issues;
  const translatedStrengths = t(`${key}Strengths`) || dept.strengths;

  const urgentList = dept.urgent.map((u, i) => ({
    ...u,
    translatedIssue: t(`${key}Urgent${i+1}`) || u.issue
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, height: "100%", animation: "fadeSlideIn 0.35s ease" }}>
      <TabBar tabs={TABS} active={active} onChange={setActive} />

      <div style={{ display: "flex", gap: 16, flex: 1, minHeight: 0 }}>

        {/* ── Main Column ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Score Trend */}
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", letterSpacing: 2, textTransform: "uppercase" }}>
                  {t("scoreTrend")}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
                  <span style={{ fontSize: 50, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>{dept.score}</span>
                  <span style={{ fontSize: 20, color: dept.trend === "up" ? "var(--accent)" : dept.trend === "down" ? "var(--danger)" : "var(--warn)" }}>
                    {dept.trend === "up" ? "↑" : dept.trend === "down" ? "↓" : "→"}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>/ 5.0</span>
                </div>
              </div>
              <LiveBadge />
            </div>
            <MiniLineChart data={trendData} color="var(--accent)" height={100} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              <span>1am</span><span>3am</span><span>6pm</span><span>9pm</span><span>9pm</span>
            </div>
          </Card>

          {/* Issues & Strengths */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Card style={{ borderLeft: "3px solid var(--danger)" }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)", marginBottom: 12 }}>⚠ {t("commonIssues")}</div>
              {translatedIssues.map((iss, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
                  <span style={{ color: "var(--danger)", fontSize: 12, marginTop: 2 }}>–</span>
                  <span style={{ color: "var(--text-primary)", fontSize: 13, lineHeight: 1.5 }}>{iss}</span>
                </div>
              ))}
            </Card>
            <Card style={{ borderLeft: "3px solid var(--accent)" }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)", marginBottom: 12 }}>✓ {t("strengths")}</div>
              {translatedStrengths.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
                  <span style={{ color: "var(--accent)", fontSize: 12, marginTop: 2 }}>✓</span>
                  <span style={{ color: "var(--text-primary)", fontSize: 13, lineHeight: 1.5 }}>{s}</span>
                </div>
              ))}
            </Card>
          </div>
        </div>

        {/*  Right: Urgent Issues  */}
        <div style={{ width: 270 }}>
          <Card style={{ height: "100%" }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)", marginBottom: 16 }}>🚨 {t("urgentIssues")}</div>
            {urgentList.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 120, gap: 10, color: "var(--accent)" }}>
                <div style={{ fontSize: 28 }}>✓</div>
                <div style={{ fontSize: 13 }}>{t("noUrgentIssues")}</div>
              </div>
            ) : (
              urgentList.map((u, i) => (
                <div key={i} style={{
                  borderLeft: `3px solid ${u.sev === "red" ? "var(--danger)" : "var(--warn)"}`,
                  paddingLeft: 12, marginBottom: 16,
                  paddingBottom: 16,
                  borderBottom: i < urgentList.length - 1 ? "1px solid var(--border-subtle)" : "none",
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{u.loc}</div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4, lineHeight: 1.5 }}>{u.translatedIssue}</div>
                  <span style={{
                    display: "inline-block", marginTop: 6, fontSize: 10, fontFamily: "var(--font-mono)",
                    fontWeight: 700, letterSpacing: 1,
                    color: u.sev === "red" ? "var(--danger)" : "var(--warn)",
                  }}>
                    {u.sev === "red" ? t("high") : t("medium")}
                  </span>
                </div>
              ))
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
