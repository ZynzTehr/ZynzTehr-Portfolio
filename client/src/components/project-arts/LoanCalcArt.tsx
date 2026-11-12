import React from "react";

/*
 * FinPulse loan calculator: a real 30-year amortization schedule drawn as
 * stacked two-year bars. Every bar is the same payment; the interest share
 * (amber) shrinks while principal (sapphire) grows until they cross. A
 * principal-vs-interest donut and the calculator's range sliders sit beside it.
 */

// 30-year fixed loan at 6.5%, aggregated into 15 two-year buckets.
const RATE = 0.065 / 12;
const MONTHS = 360;
const BUCKET = 24;
const PAYMENT = RATE / (1 - Math.pow(1 + RATE, -MONTHS));

const INTEREST_SHARE: number[] = (() => {
  const shares: number[] = [];
  let balance = 1;
  for (let k = 0; k < MONTHS / BUCKET; k += 1) {
    let interest = 0;
    for (let m = 0; m < BUCKET; m += 1) {
      const i = balance * RATE;
      interest += i;
      balance -= PAYMENT - i;
    }
    shares.push(interest / (BUCKET * PAYMENT));
  }
  return shares;
})();

const TOTAL_INTEREST_SHARE = (PAYMENT * MONTHS - 1) / (PAYMENT * MONTHS);

// Chart geometry.
const X0 = 60;
const BAR_W = 17;
const STEP = 23;
const BASE_Y = 226;
const BAR_H = 142;
const barCenter = (k: number): number => X0 + STEP * k + BAR_W / 2;
const splitY = (share: number): number => BASE_Y - BAR_H * (1 - share);

// Smooth line through the principal/interest boundary of each bar.
const BOUNDARY_PATH = INTEREST_SHARE.map(
  (share, k) => `${k === 0 ? "M" : "L"} ${barCenter(k).toFixed(1)},${splitY(share).toFixed(1)}`,
).join(" ");

// Where interest and principal cross (share = 0.5), interpolated between bars.
const CROSS = (() => {
  const k = INTEREST_SHARE.findIndex((s) => s < 0.5);
  const a = INTEREST_SHARE[k - 1];
  const b = INTEREST_SHARE[k];
  const t = (a - 0.5) / (a - b);
  return { x: barCenter(k - 1) + STEP * t, y: splitY(0.5) };
})();

// Donut: principal vs total interest over the life of the loan.
const DONUT_CX = 522;
const DONUT_CY = 114;
const DONUT_R = 32;
const DONUT_C = 2 * Math.PI * DONUT_R;

// Calculator sliders: [y, fill fraction].
const SLIDERS: Array<[number, number]> = [
  [182, 0.62],
  [206, 0.38],
  [230, 0.8],
];
const SLIDER_X = 462;
const SLIDER_W = 120;

const LoanCalcArt: React.FC = () => {
  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      <svg
        viewBox="0 0 640 320"
        className="w-full h-full"
        style={{ width: "100%", height: "100%", display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="loancalculator-bg" cx="45%" cy="42%" r="80%">
            <stop offset="0%" stopColor="#0b1328" />
            <stop offset="55%" stopColor="#060a18" />
            <stop offset="100%" stopColor="#020308" />
          </radialGradient>

          <pattern id="loancalculator-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#4474ff" strokeWidth="0.6" />
          </pattern>

          <linearGradient id="loancalculator-panel" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0f1a3c" />
            <stop offset="100%" stopColor="#070d22" />
          </linearGradient>

          <linearGradient id="loancalculator-principal" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#0d59ff" />
          </linearGradient>

          <linearGradient id="loancalculator-fill" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0d59ff" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>

          <filter id="loancalculator-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="loancalculator-softGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <style>{`
          @keyframes loancalculatorPulse {
            0% { transform: scale(0.6); opacity: 0.9; }
            100% { transform: scale(2.2); opacity: 0; }
          }
          @keyframes loancalculatorThumb {
            0%, 100% { transform: translateX(0px); }
            50% { transform: translateX(-34px); }
          }
          @keyframes loancalculatorTrack {
            0%, 100% { transform: scaleX(1); }
            50% { transform: scaleX(${((SLIDERS[0][1] * SLIDER_W - 34) / (SLIDERS[0][1] * SLIDER_W)).toFixed(3)}); }
          }
          @keyframes loancalculatorTrace {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: -40; }
          }
          .loancalculator-ping {
            transform-box: fill-box;
            transform-origin: 50% 50%;
            animation: loancalculatorPulse 3s ease-out infinite;
          }
          .loancalculator-thumb {
            animation: loancalculatorThumb 8s ease-in-out infinite;
          }
          .loancalculator-track {
            transform-box: fill-box;
            transform-origin: 0% 50%;
            animation: loancalculatorTrack 8s ease-in-out infinite;
          }
          .loancalculator-trace {
            animation: loancalculatorTrace 4s linear infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .loancalculator-ping,
            .loancalculator-thumb,
            .loancalculator-track,
            .loancalculator-trace { animation: none; }
            .loancalculator-ping { opacity: 0; }
          }
        `}</style>

        {/* Background */}
        <rect width="640" height="320" fill="url(#loancalculator-bg)" />
        <rect width="640" height="320" fill="url(#loancalculator-grid)" opacity="0.07" />

        {/* ===== Amortization chart panel ===== */}
        <rect
          x="36"
          y="66"
          width="388"
          height="182"
          rx="14"
          fill="url(#loancalculator-panel)"
          stroke="#4474ff"
          strokeWidth="1.5"
        />
        {/* Gridlines */}
        <g stroke="#4474ff" strokeWidth="1" opacity="0.14">
          <line x1="52" y1={BASE_Y - BAR_H} x2="408" y2={BASE_Y - BAR_H} />
          <line x1="52" y1={BASE_Y - BAR_H * 0.75} x2="408" y2={BASE_Y - BAR_H * 0.75} />
          <line x1="52" y1={BASE_Y - BAR_H * 0.25} x2="408" y2={BASE_Y - BAR_H * 0.25} />
        </g>
        <line
          x1="52"
          y1={CROSS.y}
          x2="408"
          y2={CROSS.y}
          stroke="#93c5fd"
          strokeWidth="1"
          strokeDasharray="3 4"
          opacity="0.35"
        />

        {/* Stacked bars: interest on top, principal below, same payment each period */}
        {INTEREST_SHARE.map((share, k) => {
          const x = X0 + STEP * k;
          const top = BASE_Y - BAR_H;
          const mid = splitY(share);
          return (
            <g key={`bar${k}`}>
              <rect
                x={x}
                y={top}
                width={BAR_W}
                height={mid - top}
                rx="2"
                fill="#f59e0b"
                fillOpacity="0.35"
                stroke="#f59e0b"
                strokeOpacity="0.65"
                strokeWidth="1"
              />
              <rect
                x={x}
                y={mid + 1.5}
                width={BAR_W}
                height={BASE_Y - mid - 1.5}
                rx="2"
                fill="url(#loancalculator-principal)"
              />
            </g>
          );
        })}

        {/* Principal / interest boundary trace */}
        <path
          d={BOUNDARY_PATH}
          fill="none"
          stroke="#eaf2ff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#loancalculator-softGlow)"
        />
        <path
          className="loancalculator-trace"
          d={BOUNDARY_PATH}
          fill="none"
          stroke="#020308"
          strokeWidth="2.6"
          strokeDasharray="4 36"
          opacity="0.55"
        />

        {/* Crossover: from here on, each payment is mostly principal */}
        <line
          x1={CROSS.x}
          y1={BASE_Y - BAR_H - 6}
          x2={CROSS.x}
          y2={BASE_Y + 4}
          stroke="#eaf2ff"
          strokeWidth="1.2"
          strokeDasharray="3 3"
          opacity="0.7"
        />
        <circle
          className="loancalculator-ping"
          cx={CROSS.x}
          cy={CROSS.y}
          r="8"
          fill="none"
          stroke="#eaf2ff"
          strokeWidth="2"
        />
        <circle
          cx={CROSS.x}
          cy={CROSS.y}
          r="6"
          fill="#0b1328"
          stroke="#eaf2ff"
          strokeWidth="2.5"
          filter="url(#loancalculator-glow)"
        />

        {/* Baseline + year ticks */}
        <line x1="52" y1={BASE_Y} x2="408" y2={BASE_Y} stroke="#60a5fa" strokeWidth="1.5" />
        <g stroke="#60a5fa" strokeWidth="1" opacity="0.5">
          {[0, 5, 10, 14].map((k) => (
            <line
              key={`t${k}`}
              x1={barCenter(k)}
              y1={BASE_Y + 3}
              x2={barCenter(k)}
              y2={BASE_Y + 8}
            />
          ))}
        </g>

        {/* ===== Calculator side panel ===== */}
        <rect
          x="440"
          y="66"
          width="164"
          height="182"
          rx="14"
          fill="url(#loancalculator-panel)"
          stroke="#4474ff"
          strokeWidth="1.5"
        />

        {/* Donut: total principal vs total interest */}
        <circle
          cx={DONUT_CX}
          cy={DONUT_CY}
          r={DONUT_R}
          fill="none"
          stroke="#16234a"
          strokeWidth="14"
        />
        <g transform={`rotate(-90 ${DONUT_CX} ${DONUT_CY})`}>
          <circle
            cx={DONUT_CX}
            cy={DONUT_CY}
            r={DONUT_R}
            fill="none"
            stroke="url(#loancalculator-principal)"
            strokeWidth="14"
            strokeDasharray={`${(DONUT_C * (1 - TOTAL_INTEREST_SHARE) - 3).toFixed(1)} ${DONUT_C.toFixed(1)}`}
          />
          <circle
            cx={DONUT_CX}
            cy={DONUT_CY}
            r={DONUT_R}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="14"
            strokeDasharray={`${(DONUT_C * TOTAL_INTEREST_SHARE - 3).toFixed(1)} ${DONUT_C.toFixed(1)}`}
            strokeDashoffset={(-DONUT_C * (1 - TOTAL_INTEREST_SHARE)).toFixed(1)}
          />
        </g>
        <text
          x={DONUT_CX}
          y={DONUT_CY + 1}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#eaf2ff"
          fontSize="22"
          fontFamily="'JetBrains Mono', ui-monospace, monospace"
          fontWeight="bold"
        >
          $
        </text>

        {/* Range sliders: amount, rate, term */}
        {SLIDERS.map(([y, frac], i) => {
          const fillW = SLIDER_W * frac;
          const animated = i === 0;
          return (
            <g key={`s${y}`}>
              <rect x={SLIDER_X} y={y - 2.5} width={SLIDER_W} height="5" rx="2.5" fill="#16234a" />
              <rect
                className={animated ? "loancalculator-track" : undefined}
                x={SLIDER_X}
                y={y - 2.5}
                width={fillW}
                height="5"
                rx="2.5"
                fill="url(#loancalculator-fill)"
              />
              <g className={animated ? "loancalculator-thumb" : undefined}>
                <circle
                  cx={SLIDER_X + fillW}
                  cy={y}
                  r="7"
                  fill="#eaf2ff"
                  stroke="#0d59ff"
                  strokeWidth="2.5"
                  filter={animated ? "url(#loancalculator-softGlow)" : undefined}
                />
              </g>
            </g>
          );
        })}

        {/* Caption */}
        <g transform="translate(190, 272)">
          <rect
            width="260"
            height="28"
            rx="6"
            fill="rgba(13, 89, 255, 0.12)"
            stroke="#4474ff"
            strokeWidth="1.2"
          />
          <text
            x="130"
            y="14"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#93c5fd"
            fontSize="10"
            fontFamily="'JetBrains Mono', ui-monospace, monospace"
            fontWeight="bold"
            letterSpacing="1"
          >
            LOAN-CALCULATOR // AMORTIZATION
          </text>
        </g>
      </svg>
    </div>
  );
};

export default LoanCalcArt;
