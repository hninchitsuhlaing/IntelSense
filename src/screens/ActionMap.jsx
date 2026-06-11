import { useState, useEffect, useMemo } from "react";
import { Card, PriorityBadge, AILabel } from "../components/UI.jsx";
import { ROOM_COLOR } from "../utils/helpers.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import { generateSuggestedAction } from "../services/aiService.jsx";
import { useReviews } from "../context/ReviewsContext.jsx";

const FLOORS = [1,2,3, 4, 5];

export default function ActionMap() {
  const [floor, setFloor] = useState(1);
  const [selected, setSelected] = useState(null);
  const { uiLang, t } = useLanguage();
  const { reviews } = useReviews();
  const [aiAction, setAiAction] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    if (selected && selected.issue) {
      setLoadingAction(true);
      generateSuggestedAction(selected.num, selected.issue, uiLang).then(res => {
        setAiAction(res);
        setLoadingAction(false);
      });
    }
  }, [selected, uiLang]);

  const dynamicRooms = useMemo(() => {
    const layout = {};
    for (let f = 1; f <= 5; f++) {
      layout[f] = Array.from({ length: 8 }).map((_, i) => ({
        num: `${f}0${i + 1}`,
        status: "green"
      }));
    }

    const severityMap = { green: 0, yellow: 1, red: 2 };

    reviews.forEach(r => {
      const rmNum = r.room?.toString().trim();
      if (!rmNum || rmNum.length !== 3) return;
      const fNum = parseInt(rmNum[0], 10);
      
      if (fNum >= 1 && fNum <= 5 && layout[fNum]) {
        const roomObj = layout[fNum].find(rm => rm.num === rmNum);
        if (roomObj) {
           let newStatus = "green";
           if (r.priority === "HIGH" || (r.priority !== "LOW" && r.sentiment === "Negative")) {
             newStatus = "red";
           } else if (r.priority === "MEDIUM" || r.sentiment === "Negative") {
             newStatus = "yellow";
           }

           if (severityMap[newStatus] > severityMap[roomObj.status]) {
             roomObj.status = newStatus;
             roomObj.issue = r.text;
             roomObj.sentiment = r.sentiment;
             roomObj.priority = r.priority;
           }
        }
      }
    });

    return layout;
  }, [reviews]);

  const rooms = dynamicRooms[floor] || [];

  const handleRoomClick = (room) => {
    if (room.status === "green") { setSelected(null); return; }
    setSelected(prev => prev?.num === room.num ? null : room);
  };

  return (
    <div style={{ display: "flex", gap: 20, height: "100%", animation: "fadeSlideIn 0.35s ease" }}>

      {/* ── Floor Plan ── */}
      <Card style={{ flex: 1 }}>
        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22, flexWrap: "wrap" }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>{t("floor")}</span>
          <div style={{ display: "flex", gap: 4 }}>
            {FLOORS.map(f => (
              <button key={f} onClick={() => { setFloor(f); setSelected(null); }} style={{
                padding: "6px 16px", borderRadius: 8, border: "1px solid",
                borderColor: floor === f ? "var(--accent)" : "var(--border)",
                background: floor === f ? "var(--accent-bg)" : "transparent",
                color: floor === f ? "var(--accent)" : "var(--text-secondary)",
                fontSize: 13, fontWeight: floor === f ? 700 : 400,
              }}>
                {f}
              </button>
            ))}
          </div>

          {/* Legend */}
          <div style={{ marginLeft: "auto", display: "flex", gap: 16 }}>
            {[["var(--accent)", t("noIssues")], ["var(--warn)", t("medium")], ["var(--danger)", t("urgent")]].map(([c, l]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: c }} />
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Room Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {rooms.map(room => {
            const color = ROOM_COLOR[room.status];
            const isSelected = selected?.num === room.num;
            return (
              <button
                key={room.num}
                onClick={() => handleRoomClick(room)}
                style={{
                  background: `${color}18`,
                  border: `2px solid ${isSelected ? color : color + "55"}`,
                  borderRadius: 14,
                  padding: "26px 0",
                  fontSize: 20,
                  fontWeight: 800,
                  fontFamily: "var(--font-display)",
                  color: color,
                  cursor: room.status !== "green" ? "pointer" : "default",
                  transition: "all 0.2s",
                  boxShadow: isSelected ? `0 0 24px ${color}44` : "none",
                  transform: isSelected ? "scale(1.06)" : "scale(1)",
                  position: "relative",
                }}
              >
                {room.num}
                {room.status !== "green" && (
                  <div style={{
                    position: "absolute", top: 8, right: 8,
                    width: 8, height: 8, borderRadius: "50%",
                    background: color, animation: "blink 1.4s infinite",
                  }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Help text */}
        {!selected && (
          <div style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" }}>
            {t("clickHighlight")}
          </div>
        )}
      </Card>

      {/* ── Detail Panel ── */}
      <div style={{ width: 270 }}>
        <Card style={{ height: "100%", display: "flex", flexDirection: "column" }}>
          {selected ? (
            <>
              <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)", marginBottom: 20, fontFamily: "var(--font-display)" }}>
                {t("room")} {selected.num} {t("details")}
              </div>

              {[
                { label: t("issue"), value: selected.issue, color: "var(--danger)" },
                { label: t("guestSentiment"), value: `😡 ${selected.sentiment}`, color: "var(--text-primary)" },
              ].map(row => (
                <div key={row.label} style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1.5, fontFamily: "var(--font-mono)", marginBottom: 5 }}>
                    {row.label}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: row.color }}>{row.value}</div>
                </div>
              ))}

              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1.5, fontFamily: "var(--font-mono)", marginBottom: 5 }}>
                  {t("priority")}
                </div>
                <PriorityBadge level={selected.priority} />
              </div>

                <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1.5, fontFamily: "var(--font-mono)" }}>
                    {t("suggestedAction")}
                  </div>
                  <AILabel />
                </div>
                <div style={{
                  background: "var(--accent-bg)", border: "1px solid var(--accent-glow)",
                  borderRadius: 10, padding: 14,
                  fontSize: 13, color: "var(--text-primary)", lineHeight: 1.7,
                }}>
                  <span style={{ color: "var(--accent)", marginRight: 6 }}>✦</span>
                  {loadingAction ? "..." : (aiAction || selected.action)}
                </div>
              </div>

              <button
                onClick={() => setSelected(null)}
                style={{
                  marginTop: 16, width: "100%", padding: "10px 0",
                  background: "transparent", border: "1px solid var(--border)",
                  borderRadius: 8, color: "var(--text-secondary)", fontSize: 12,
                }}
              >
                ← {t("backToFloorPlan")}
              </button>
            </>
          ) : (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", height: "100%", gap: 14, textAlign: "center",
            }}>
              <div style={{ fontSize: 40 }}>🗺️</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7 }}>
                {t("selectRedYellow")}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                {[[ "var(--danger)", t("urgent") ], [ "var(--warn)", t("medium") ]].map(([c, l]) => (
                  <div key={l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--text-muted)" }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: c }} />{l}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
