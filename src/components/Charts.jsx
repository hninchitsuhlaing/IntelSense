import { useMemo } from "react";
import { buildLinePath } from "../utils/helpers.js";

export function MiniLineChart({ data, color = "#22c55e", height = 80, showArea = true, strokeWidth = 2.5 }) {
  const W = 400;
  const { path, area } = useMemo(() => buildLinePath(data, W, height), [data, height]);
  const gradId = `grad-${color.replace(/[^a-z0-9]/gi, "")}`;

  return (
    <svg
      viewBox={`0 0 ${W} ${height}`}
      style={{ width: "100%", height, display: "block" }}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {showArea && <path d={area} fill={`url(#${gradId})`} />}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BarChart({ data, color = "#22c55e", height = 120, altColor }) {
  const W   = 400;
  const max = Math.max(...data.map(d => d.v), 1);
  const barW = W / data.length - 6;

  return (
    <svg viewBox={`0 0 ${W} ${height}`} style={{ width: "100%", height, display: "block" }} preserveAspectRatio="none">
      {data.map((d, i) => {
        const barH = (d.v / max) * (height - 12);
        const x    = (i / data.length) * W + 3;
        const fill = altColor && i % 2 === 0 ? altColor : color;
        return (
          <rect
            key={i}
            x={x} y={height - barH - 4}
            width={barW} height={barH}
            rx="3" fill={fill} opacity="0.85"
          />
        );
      })}
    </svg>
  );
}

export function DualBarChart({ groups, colorA = "#ef4444", colorB = "#22c55e", height = 130 }) {
  const W   = 300;
  const max = 100;

  return (
    <svg viewBox={`0 0 ${W} ${height}`} style={{ width: "100%", height, display: "block" }} preserveAspectRatio="none">
      {groups.map((g, i) => {
        const x  = (i / groups.length) * W + 4;
        const bw = 20;
        const h1 = (g.v1 / max) * (height - 20);
        const h2 = (g.v2 / max) * (height - 20);
        return (
          <g key={i}>
            <rect x={x}      y={height - h1 - 14} width={bw} height={h1} rx="3" fill={colorA} opacity="0.85" />
            <rect x={x + 24} y={height - h2 - 14} width={bw} height={h2} rx="3" fill={colorB} opacity="0.85" />
            <text x={x + 20} y={height - 2} textAnchor="middle" fontSize="9" fill="var(--text-muted)">{g.label}</text>
          </g>
        );
      })}
    </svg>
  );
}
