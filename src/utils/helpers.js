// ─── CHART DATA GENERATION ────────────────────────────────────────────────────
export function generateTrendData(points = 24, base = 70, variance = 15) {
  return Array.from({ length: points }, (_, i) => ({
    t: i,
    v: Math.min(100, Math.max(10, base + Math.sin(i * 0.5) * variance + (Math.random() - 0.5) * 10)),
  }));
}

export function generateBarData(count = 8, base = 65, variance = 25) {
  return Array.from({ length: count }, (_, i) => ({
    t: i,
    v: Math.round(Math.min(100, Math.max(10, base + (Math.random() - 0.5) * variance * 2))),
  }));
}

// ─── COLOR HELPERS ────────────────────────────────────────────────────────────
export const PRIORITY_COLOR = {
  HIGH:   "#ef4444",
  MEDIUM: "#f59e0b",
  LOW:    "#22c55e",
};

export const SENTIMENT_COLOR = {
  Positive: "#22c55e",
  Negative: "#ef4444",
  Neutral:  "#f59e0b",
};

export const ROOM_COLOR = {
  green:  "#22c55e",
  yellow: "#f59e0b",
  red:    "#ef4444",
};

// ─── SVG PATH BUILDER ─────────────────────────────────────────────────────────
export function buildLinePath(data, width, height, padding = 8) {
  const minV = Math.min(...data.map(d => d.v));
  const maxV = Math.max(...data.map(d => d.v));
  const range = maxV - minV || 1;
  const xs = data.map((_, i) => (i / (data.length - 1)) * width);
  const ys = data.map(d => height - padding - ((d.v - minV) / range) * (height - padding * 2));
  const path = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  const area = `${path} L${width},${height} L0,${height} Z`;
  return { path, area };
}

// ─── TIME FORMATTER ───────────────────────────────────────────────────────────
export function timeAgo(date) {
  const diff = Date.now() - date;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
}

// ─── RANDOM ROOM PICKER ───────────────────────────────────────────────────────
export function randomRoom() {
  const floor = Math.floor(Math.random() * 4) + 2;
  const num   = Math.floor(Math.random() * 8) + 1;
  return `${floor}0${num}`;
}

// ─── API CALLERS ──────────────────────────────────────────────────────────────
export async function callGemini(apiKey, prompt) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }
  );
  if (!res.ok) throw new Error("Gemini API error " + res.status);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

export async function callClaude(prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  return data.content?.map(b => b.text || "").join("") || "";
}

export async function callAI(apiKey, prompt) {
  if (apiKey) return callGemini(apiKey, prompt);
  return callClaude(prompt);
}

// ─── HOTEL CONTEXT FOR AI ─────────────────────────────────────────────────────
export const HOTEL_CONTEXT = `You are IntelSense AI, an intelligent hotel management assistant. 
Current hotel snapshot:
- Happiness Score: 78/100 (up +5 today)
- Urgent issues: Room 302 AC broken (HIGH), Room 305 leaking faucet (HIGH), Elevator slow (HIGH), WiFi slow Floor 5 (MEDIUM)
- Department scores: Housekeeping 4.2 (dropping), Front Desk 4.8 (rising), F&B 4.5 (stable), Maintenance 3.9 (dropping)
- 3 guests complained about elevators today
Be concise, actionable, and professional. Answer in 2-4 sentences unless asked for more.`;
