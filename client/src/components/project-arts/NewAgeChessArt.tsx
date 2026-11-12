import React from "react";

// ---- Board projection: a ground-plane chessboard seen from its a1 corner ----
const YAW = (30 * Math.PI) / 180;
const FOCAL = 360;
const CAM_H = 2.4;
const CX = 170;
const HORIZON = 44;
const Z0 = 5.2;
const X0 = -0.15;

type Pt = { x: number; y: number; z: number };

// Board square units: u runs along the files (a -> h), v along the ranks (1 -> 8).
const project = (u: number, v: number): Pt => {
  const X = u * Math.cos(YAW) - v * Math.sin(YAW) + X0;
  const Z = Z0 + u * Math.sin(YAW) + v * Math.cos(YAW);
  return { x: CX + (FOCAL * X) / Z, y: HORIZON + (FOCAL * CAM_H) / Z, z: Z };
};

const f = (n: number) => n.toFixed(1);
const quad = (u: number, v: number): string => {
  const a = project(u, v);
  const b = project(u + 1, v);
  const c = project(u + 1, v + 1);
  const d = project(u, v + 1);
  return `M${f(a.x)} ${f(a.y)} L${f(b.x)} ${f(b.y)} L${f(c.x)} ${f(c.y)} L${f(d.x)} ${f(d.y)} Z`;
};

const BOARD_N = 8;
const SQUARES = Array.from({ length: BOARD_N * BOARD_N }, (_, i) => {
  const u = i % BOARD_N;
  const v = Math.floor(i / BOARD_N);
  return { key: i, d: quad(u, v), light: (u + v) % 2 === 1 };
});

const FRAME = (() => {
  const pad = 0.18;
  const a = project(-pad, -pad);
  const b = project(BOARD_N, -pad);
  const d = project(-pad, BOARD_N);
  return { a, b, d };
})();

// Knight jumps b2 -> d1 (two files over, one rank back).
const FROM_SQ = { u: 1, v: 1 };
const TO_SQ = { u: 3, v: 0 };
const FROM = project(FROM_SQ.u + 0.5, FROM_SQ.v + 0.5);
const TO = project(TO_SQ.u + 0.5, TO_SQ.v + 0.5);
const KNIGHT_UNITS = 1.6; // piece height in board squares
const KNIGHT_PATH_H = 102;
const knightScale = (p: Pt) => ((FOCAL / p.z) * KNIGHT_UNITS) / KNIGHT_PATH_H;

// Knight silhouette, drawn facing left (mirrored when placed), base centred on (0, 0).
const KNIGHT =
  "M-30 0 L30 0 L30 -8 L24 -13 L24 -18 L20 -18 C22 -34 27 -50 23 -64 C19 -79 10 -90 -2 -94 " +
  "L-5 -103 L-11 -93 C-21 -88 -28 -78 -32 -66 L-39 -54 C-41 -48 -37 -43 -31 -45 L-18 -50 " +
  "C-12 -51 -8 -46 -12 -38 C-18 -30 -20 -24 -20 -18 L-24 -18 L-24 -13 L-30 -8 Z";

// Move arc: a circular arc from the knight's head to the destination square.
const ARC_START = { x: FROM.x + 6, y: FROM.y - (FOCAL / FROM.z) * KNIGHT_UNITS - 8 };
const ARC_END = { x: TO.x, y: TO.y - 4 };
const ARC_SAG = 30; // height of the apex above the chord midpoint
const ARC = (() => {
  const mx = (ARC_START.x + ARC_END.x) / 2;
  const my = (ARC_START.y + ARC_END.y) / 2;
  const dx = ARC_END.x - ARC_START.x;
  const dy = ARC_END.y - ARC_START.y;
  const half = Math.hypot(dx, dy) / 2;
  const r = (half * half + ARC_SAG * ARC_SAG) / (2 * ARC_SAG);
  // Unit normal pointing "down" (away from the apex).
  let nx = -dy / (2 * half);
  let ny = dx / (2 * half);
  if (ny < 0) {
    nx = -nx;
    ny = -ny;
  }
  const cx = mx + nx * (r - ARC_SAG);
  const cy = my + ny * (r - ARC_SAG);
  const a0 = (Math.atan2(ARC_START.y - cy, ARC_START.x - cx) * 180) / Math.PI;
  const a1 = (Math.atan2(ARC_END.y - cy, ARC_END.x - cx) * 180) / Math.PI;
  const apex = { x: mx - nx * ARC_SAG, y: my - ny * ARC_SAG };
  // Arrowhead along the tangent where the arc lands.
  const end = (a1 * Math.PI) / 180;
  const tx = -Math.sin(end);
  const ty = Math.cos(end);
  const wing = (side: number) =>
    `${f(ARC_END.x - tx * 10 + side * ty * 6)} ${f(ARC_END.y - ty * 10 - side * tx * 6)}`;
  const arrow = `M${wing(1)} L${f(ARC_END.x)} ${f(ARC_END.y)} L${wing(-1)}`;
  return { cx, cy, r, sweep: a1 - a0, apex, arrow };
})();
const ARC_D = `M${f(ARC_START.x)} ${f(ARC_START.y)} A${f(ARC.r)} ${f(ARC.r)} 0 0 1 ${f(ARC_END.x)} ${f(ARC_END.y)}`;

// ---- Neural AI personalities (Elo drives the ring fill) ----
const CORE = { x: 548, y: 138 };
const PERSONAS = [
  { elo: 2450, glyph: "balanced" },
  { elo: 2200, glyph: "blade" },
  { elo: 2150, glyph: "fortress" },
  { elo: 2100, glyph: "hypermodern" },
  { elo: 2000, glyph: "gambit" },
].map((p, i) => {
  const angle = ((-90 - 72 * i) * Math.PI) / 180;
  return { ...p, x: CORE.x + 74 * Math.cos(angle), y: CORE.y + 74 * Math.sin(angle) };
});

const Glyph: React.FC<{ kind: string }> = ({ kind }) => {
  switch (kind) {
    case "balanced":
      return (
        <g>
          <circle r="5" fill="none" />
          <circle r="1.6" fill="#eaf2ff" stroke="none" />
        </g>
      );
    case "blade":
      return <path d="M-5 5 L5 -5 M1 -5 L5 -5 L5 -1" fill="none" />;
    case "fortress":
      return <path d="M-5 -4 L5 -4 L5 1 C5 4 0 6 0 6 C0 6 -5 4 -5 1 Z" fill="none" />;
    case "hypermodern":
      return <path d="M0 -6 L6 0 L0 6 L-6 0 Z M0 -2 L2 0 L0 2 L-2 0 Z" fill="none" />;
    default:
      return <path d="M-6 3 L-2 -3 L2 3 L6 -3" fill="none" />;
  }
};

const NewAgeChessArt: React.FC = () => {
  const fromScale = knightScale(FROM);
  const ringRx = (FOCAL / TO.z) * 0.42;
  const ringRy = ringRx * (CAM_H / TO.z) * 1.15;
  const lead = PERSONAS[0];
  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-full h-full"
        style={{ width: "100%", height: "100%", display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="newagechess-bg" cx="40%" cy="60%" r="80%">
            <stop offset="0%" stopColor="#0b1328" />
            <stop offset="55%" stopColor="#060a18" />
            <stop offset="100%" stopColor="#020308" />
          </radialGradient>

          <pattern id="newagechess-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#4474ff" strokeWidth="0.6" />
          </pattern>

          <radialGradient
            id="newagechess-boardFade"
            gradientUnits="userSpaceOnUse"
            cx={FROM.x}
            cy={FROM.y + 20}
            r="330"
          >
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="55%" stopColor="#ffffff" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <mask
            id="newagechess-boardMask"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="640"
            height="320"
          >
            <rect width="640" height="320" fill="url(#newagechess-boardFade)" />
          </mask>

          <linearGradient id="newagechess-light" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a2b5e" />
            <stop offset="100%" stopColor="#22377a" />
          </linearGradient>

          <linearGradient id="newagechess-knight" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#eaf2ff" />
            <stop offset="45%" stopColor="#93c5fd" />
            <stop offset="100%" stopColor="#2c5cd9" />
          </linearGradient>

          <linearGradient id="newagechess-arc" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#eaf2ff" />
          </linearGradient>

          <radialGradient id="newagechess-core">
            <stop offset="0%" stopColor="#eaf2ff" />
            <stop offset="45%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#0d59ff" stopOpacity="0" />
          </radialGradient>

          <filter id="newagechess-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="newagechess-soft" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <style>{`
          @keyframes newagechessHop {
            0% { transform: rotate(0deg); opacity: 0; }
            8% { opacity: 1; }
            62% { transform: rotate(${f(ARC.sweep)}deg); opacity: 1; }
            70%, 100% { transform: rotate(${f(ARC.sweep)}deg); opacity: 0; }
          }
          @keyframes newagechessGhost {
            0%, 45% { opacity: 0.2; }
            65% { opacity: 0.7; }
            100% { opacity: 0.2; }
          }
          @keyframes newagechessPing {
            0% { transform: scale(0.6); opacity: 0.9; }
            100% { transform: scale(1.8); opacity: 0; }
          }
          .newagechess-hop {
            transform-origin: ${f(ARC.cx)}px ${f(ARC.cy)}px;
            animation: newagechessHop 4.5s ease-in-out infinite;
          }
          .newagechess-ghost {
            opacity: 0.45;
            animation: newagechessGhost 4.5s ease-in-out infinite;
          }
          .newagechess-ping {
            transform-box: fill-box;
            transform-origin: center;
            opacity: 0;
            animation: newagechessPing 3s ease-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .newagechess-hop, .newagechess-ghost, .newagechess-ping { animation: none; }
            .newagechess-hop { transform: rotate(${f(ARC.sweep * 0.5)}deg); }
          }
        `}</style>

        {/* Background */}
        <rect width="640" height="320" fill="url(#newagechess-bg)" />
        <rect width="640" height="320" fill="url(#newagechess-grid)" opacity="0.07" />

        {/* ===== Perspective board corner ===== */}
        <g mask="url(#newagechess-boardMask)">
          <path
            d={`M${f(FRAME.d.x)} ${f(FRAME.d.y)} L${f(FRAME.a.x)} ${f(FRAME.a.y)} L${f(FRAME.b.x)} ${f(FRAME.b.y)}`}
            fill="none"
            stroke="#60a5fa"
            strokeWidth="2.5"
            strokeLinejoin="round"
            filter="url(#newagechess-soft)"
          />
          {SQUARES.map((s) => (
            <path
              key={s.key}
              d={s.d}
              fill={s.light ? "url(#newagechess-light)" : "#070d22"}
              stroke="#4474ff"
              strokeWidth="0.7"
              strokeOpacity="0.45"
            />
          ))}
          {/* Destination square highlight */}
          <path className="newagechess-ghost" d={quad(TO_SQ.u, TO_SQ.v)} fill="#60a5fa" />
          <path d={quad(FROM_SQ.u, FROM_SQ.v)} fill="#0d59ff" opacity="0.35" />
        </g>

        {/* Target radar ring */}
        <ellipse
          cx={TO.x}
          cy={TO.y}
          rx={ringRx}
          ry={ringRy}
          fill="none"
          stroke="#93c5fd"
          strokeWidth="1.6"
          filter="url(#newagechess-soft)"
        />
        <ellipse
          className="newagechess-ping"
          cx={TO.x}
          cy={TO.y}
          rx={ringRx}
          ry={ringRy}
          fill="none"
          stroke="#60a5fa"
          strokeWidth="1.4"
        />

        {/* Knight */}
        <ellipse
          cx={FROM.x}
          cy={FROM.y}
          rx={(FOCAL / FROM.z) * 0.38}
          ry={(FOCAL / FROM.z) * 0.38 * (CAM_H / FROM.z) * 1.15}
          fill="#0d59ff"
          opacity="0.35"
          filter="url(#newagechess-soft)"
        />
        <g
          transform={`translate(${f(FROM.x)} ${f(FROM.y)}) scale(${(-fromScale).toFixed(3)} ${fromScale.toFixed(3)})`}
        >
          <path
            d={KNIGHT}
            fill="url(#newagechess-knight)"
            stroke="#eaf2ff"
            strokeWidth={1.4 / fromScale}
            strokeLinejoin="round"
            filter="url(#newagechess-glow)"
          />
          <path
            d="M14 -24 C17 -38 19 -52 15 -64 C12 -74 6 -82 -2 -86"
            fill="none"
            stroke="#0d1a3a"
            strokeWidth={2.2 / fromScale}
            strokeLinecap="round"
            opacity="0.55"
          />
          <circle cx="-16" cy="-74" r="3.2" fill="#0b1328" />
          <line
            x1="-24"
            y1="-13"
            x2="24"
            y2="-13"
            stroke="#0d1a3a"
            strokeWidth={1.5 / fromScale}
            opacity="0.6"
          />
        </g>

        {/* Move arc with travelling spark */}
        <path
          d={ARC_D}
          fill="none"
          stroke="url(#newagechess-arc)"
          strokeWidth="2.4"
          strokeDasharray="6 5"
          strokeLinecap="round"
          filter="url(#newagechess-soft)"
        />
        <path
          d={ARC.arrow}
          fill="none"
          stroke="#eaf2ff"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <g className="newagechess-hop">
          <circle
            cx={ARC_START.x}
            cy={ARC_START.y}
            r="4"
            fill="#eaf2ff"
            filter="url(#newagechess-glow)"
          />
        </g>

        {/* ===== Neural AI personality ring ===== */}
        <line
          x1={lead.x}
          y1={lead.y}
          x2={ARC.apex.x}
          y2={ARC.apex.y}
          stroke="#4474ff"
          strokeWidth="1"
          strokeDasharray="2 4"
          opacity="0.6"
        />
        <circle
          cx={CORE.x}
          cy={CORE.y}
          r="74"
          fill="none"
          stroke="#4474ff"
          strokeWidth="0.8"
          opacity="0.25"
        />
        <g stroke="#4474ff" strokeWidth="1.1" opacity="0.55">
          {PERSONAS.map((p, i) => (
            <line key={i} x1={CORE.x} y1={CORE.y} x2={p.x} y2={p.y} />
          ))}
        </g>
        <circle cx={CORE.x} cy={CORE.y} r="22" fill="url(#newagechess-core)" opacity="0.55" />
        <circle cx={CORE.x} cy={CORE.y} r="9" fill="#0d1a3a" stroke="#93c5fd" strokeWidth="2" />
        <circle cx={CORE.x} cy={CORE.y} r="3.5" fill="#eaf2ff" />

        {PERSONAS.map((p, i) => {
          const isLead = i === 0;
          const r = isLead ? 19 : 15;
          const fill = (p.elo - 1700) / 800;
          return (
            <g key={p.glyph}>
              {isLead && (
                <circle
                  className="newagechess-ping"
                  cx={p.x}
                  cy={p.y}
                  r={r + 2}
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="1.5"
                />
              )}
              <circle
                cx={p.x}
                cy={p.y}
                r={r}
                fill="#0a1330"
                stroke="#4474ff"
                strokeWidth="1.2"
                opacity={isLead ? 1 : 0.9}
              />
              {/* Elo ring */}
              <circle
                cx={p.x}
                cy={p.y}
                r={r - 4}
                fill="none"
                stroke={isLead ? "#eaf2ff" : "#60a5fa"}
                strokeWidth="2.6"
                pathLength={100}
                strokeDasharray={`${(fill * 100).toFixed(1)} 100`}
                strokeLinecap="round"
                transform={`rotate(-90 ${f(p.x)} ${f(p.y)})`}
                filter={isLead ? "url(#newagechess-soft)" : undefined}
              />
              <g
                transform={`translate(${f(p.x)} ${f(p.y)})`}
                stroke={isLead ? "#eaf2ff" : "#93c5fd"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Glyph kind={p.glyph} />
              </g>
            </g>
          );
        })}

        {/* Caption */}
        <g transform="translate(210, 272)">
          <rect
            width="220"
            height="28"
            rx="6"
            fill="rgba(13, 89, 255, 0.12)"
            stroke="#4474ff"
            strokeWidth="1.2"
          />
          <text
            x="110"
            y="14"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#93c5fd"
            fontSize="10"
            fontFamily="'JetBrains Mono', ui-monospace, monospace"
            fontWeight="bold"
            letterSpacing="1"
          >
            NEW-AGE-CHESS // 5 NEURAL AIS
          </text>
        </g>
      </svg>
    </div>
  );
};

export default NewAgeChessArt;
