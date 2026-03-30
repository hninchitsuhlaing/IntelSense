import { useState, useEffect } from "react";
import { Card, LiveBadge, AlertRow, AILabel } from "../components/UI.jsx";
import { MiniLineChart } from "../components/Charts.jsx";
import { useTrendData } from "../hooks/useIntel.js";
import { useReviews } from "../context/ReviewsContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { generateDailyBrief } from "../services/aiService.jsx";

export default function Dashboard() {
  const { reviews } = useReviews();
  const { user } = useAuth();
  const { dataLang, uiLang, t } = useLanguage();

  const [pulsing, setPulsing] = useState(false);
  const total = reviews.length;
  const positive = reviews.filter(r => r.sentiment === "Positive").length;
  const dynamicScore = total === 0 ? 78 : Math.round((positive / total) * 100);

  useEffect(() => {
    if (total > 0) {
      setPulsing(true);
      const t = setTimeout(() => setPulsing(false), 600);
      return () => clearTimeout(t);
    }
  }, [total]);

  const [dailyBrief, setDailyBrief] = useState([
    t("loadingAi"),
    t("analyzingLive"),
    t("checkingRecent")
  ]);
  const [briefLoaded, setBriefLoaded] = useState(false);

  useEffect(() => {
    setBriefLoaded(false);
  }, [uiLang]);

  useEffect(() => {
    if (reviews.length > 0 && !briefLoaded && user) {
      setBriefLoaded(true);
      generateDailyBrief(reviews, user?.email, uiLang).then(briefList => {
        setDailyBrief(briefList);
      }).catch(err => {
        setDailyBrief([t("failedToLoadBrief"), t("pleaseTryAgain")]);
      });
    }
  }, [reviews, briefLoaded, user, uiLang]);

  const trendData = useTrendData(28, 66, 14);

  const depts = ["Housekeeping", "Front Desk", "Maintenance", "F&B"];
  const dynamicScorecards = depts.map(deptName => {
    const dReviews = reviews.filter(r => r.department === deptName);
    const dTotal = dReviews.length;
    const dPos = dReviews.filter(r => r.sentiment === "Positive").length;

    let scoreNum = 0;
    if (dTotal === 0) {
      scoreNum = 4.0;
    } else {
      scoreNum = 1 + (dPos / dTotal) * 4;
    }
    const finalScore = scoreNum.toFixed(1);

    return {
      name: deptName,
      score: finalScore,
      trend: finalScore >= 4.0 ? "↑" : finalScore <= 2.5 ? "↓" : "↗",
      color: finalScore >= 4.0 ? "#22c55e" : finalScore <= 2.5 ? "#ef4444" : "#f59e0b"
    };
  });

  const liveAlerts = reviews
    .filter(r => r.priority === "HIGH" || r.sentiment === "Negative")
    .slice(0, 5)
    .map(r => ({
      room: r.room ? `${t("room")} ${r.room}` : t("general"),
      issue: r.text.substring(0, 40) + (r.text.length > 40 ? "..." : ""),
      sev: t(r.priority?.toLowerCase())?.toUpperCase() || r.priority || "MEDIUM",
      color: r.priority === "HIGH" ? "#ef4444" : "#f59e0b"
    }));

  const resolvedCount = Math.min(14, total);

  return (
    <div style={{ display: "flex", gap: 20, height: "100%", animation: "fadeSlideIn 0.35s ease" }}>

      {/* Left Column */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Happiness Score */}
        <Card>
          <div style={{ display: "flex", gap: 20 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-muted)", letterSpacing: 2, textTransform: "uppercase" }}>
                    {t("guestHappinessScore")}
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 6 }}>
                    <span style={{
                      fontSize: 60, fontWeight: 600, color: "var(--text-primary)",
                      fontFamily: "var(--font-display)", lineHeight: 1,
                      transition: "all 0.4s",
                      filter: pulsing ? "drop-shadow(0 0 16px var(--accent))" : "none",
                    }}>
                      {dynamicScore}
                    </span>
                    <span style={{ fontSize: 22, color: "var(--text-muted)", fontFamily: "var(--font-display)" }}>/100</span>
                  </div>
                  <div style={{ color: "var(--accent)", fontSize: 13, fontWeight: 600, marginTop: 2, fontFamily: "var(--font-mono)" }}>
                    {t("basedOnLiveReviews")} {total} {t("liveReviewsText")}
                  </div>
                </div>
                <LiveBadge />
              </div>
              <MiniLineChart data={trendData} color="var(--accent)" height={96} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                <span>1am</span><span>6am</span><span>12pm</span><span>6pm</span><span>9pm</span>
              </div>
            </div>
          </div>
        </Card>

        {/* AI Daily Brief */}
        <Card style={{ borderColor: "var(--accent)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: "var(--accent-bg)", border: "1px solid var(--accent-glow)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0,
            }}>
              💡
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>{t("aiDailyBrief")}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{briefLoaded ? t("updatedJustNow") : t("loading")}</div>
            </div>
            <AILabel />
          </div>
          {dailyBrief.map((line, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
              <span style={{ color: "var(--accent)", fontSize: 14, marginTop: 1, flexShrink: 0 }}>–</span>
              <span style={{ color: "var(--text-primary)", fontSize: 13, lineHeight: 1.6 }}>{line}</span>
            </div>
          ))}
        </Card>

        {/* Dept Scorecards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
          {dynamicScorecards.map(d => (
            <Card key={d.name} style={{ padding: "14px 18px" }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8, fontFamily: "var(--font-mono)", letterSpacing: 0.5 }}>
                {d.name}
              </div>
              <div style={{ fontSize: 40, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-display)", display: "flex", alignItems: "baseline", gap: 6 }}>
                {d.score}
                <span style={{ fontSize: 20, color: d.color }}>{d.trend}</span>
              </div>
              <div style={{
                marginTop: 8, height: 3, borderRadius: 2,
                background: `linear-gradient(to right, ${d.color}55, ${d.color})`,
                width: `${(parseFloat(d.score) / 5) * 100}%`,
              }} />
            </Card>
          ))}
        </div>
      </div>

      {/* Right Panel: Live Alerts */}
      <div style={{ width: 250 }}>
        <Card style={{ height: "100%" }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)", marginBottom: 16, display: "flex", gap: 8, alignItems: "center" }}>
            <span>{t("liveAlerts")}</span>
            <div className="live-dot" style={{ marginLeft: "auto" }} />
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>
            {liveAlerts.length > 0 ? liveAlerts.map((a, i) => (
              <AlertRow key={i} {...a} />
            )) : <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{t("noUrgentAlerts")}</span>}
          </div>

          <div style={{ marginTop: 16, padding: "12px", background: "var(--bg-elevated)", borderRadius: 10, border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6, fontFamily: "var(--font-mono)" }}>{t("quickStats")}</div>
            {[
              [t("totalReviewsToday"), total.toString()],
              [t("avgResponseTime"), "12 min"],
              [t("issuesResolved"), `${resolvedCount}/${total}`]
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{k}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>{v}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}