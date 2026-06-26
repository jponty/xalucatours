/* ============================================================
   PassportStamp — a decorative, slightly-worn passport-style ink
   stamp overlaid on the enlarged story photo. Pure SVG (curved
   text + a turbulence "distress" filter) so it stays crisp and
   weightless. Non-interactive — clicks pass through.

   Props:
   - place: destination shown across the centre (e.g. "Erg Chebbi").
   - date:  month/year line (e.g. "Abril 1998").
   - rotate: tilt in degrees (default -14).
   - className: position/size overrides on the wrapper.
============================================================ */
import React, { useId } from "react";

const INK = "#FDFBF7"; // warm white ink — reads well with a dark shadow

export default function PassportStamp({ place, date, rotate = -14, className = "" }) {
  const uid = useId().replace(/:/g, "");
  const wornId = `worn-${uid}`;
  const topId = `top-${uid}`;
  const botId = `bot-${uid}`;

  return (
    <div
      data-testid="passport-stamp"
      aria-hidden="true"
      className={`pointer-events-none select-none absolute ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full" role="presentation">
        <defs>
          {/* worn / hand-stamped distress: rough edges + speckled ink gaps */}
          <filter id={wornId} x="-15%" y="-15%" width="130%" height="130%">
            <feTurbulence type="fractalNoise" baseFrequency="0.05 0.07" numOctaves="2" seed="7" result="big" />
            <feDisplacementMap in="SourceGraphic" in2="big" scale="2.6" xChannelSelector="R" yChannelSelector="G" result="disp" />
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="2" seed="4" result="speck" />
            <feColorMatrix
              in="speck"
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      1 0 0 0 -0.8"
              result="speckA"
            />
            <feComposite in="disp" in2="speckA" operator="out" />
          </filter>

          <path id={topId} d="M 36,100 A 64,64 0 0 1 164,100" fill="none" />
          <path id={botId} d="M 40,104 A 60,60 0 0 0 160,104" fill="none" />
        </defs>

        <g filter={`url(#${wornId})`} fill="none" stroke={INK} opacity="0.96">
          {/* rings */}
          <circle cx="100" cy="100" r="92" strokeWidth="4" />
          <circle cx="100" cy="100" r="80" strokeWidth="1.4" strokeDasharray="2 4" />

          {/* arc texts */}
          <text fill={INK} stroke="none" fontSize="14" fontWeight="700" letterSpacing="2.4"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            <textPath href={`#${topId}`} startOffset="50%" textAnchor="middle">
              ROYAUME DU MAROC
            </textPath>
          </text>
          <text fill={INK} stroke="none" fontSize="11" fontWeight="700" letterSpacing="3"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            <textPath href={`#${botId}`} startOffset="50%" textAnchor="middle">
              XALUCA TOURS ✦ MAROC
            </textPath>
          </text>

          {/* centre band */}
          <line x1="48" y1="84" x2="152" y2="84" strokeWidth="1.4" />
          <line x1="48" y1="120" x2="152" y2="120" strokeWidth="1.4" />

          <text x="100" y="80" fill={INK} stroke="none" fontSize="9" fontWeight="700" letterSpacing="3"
            textAnchor="middle" style={{ fontFamily: "Georgia, serif" }}>
            ✦ ENTRÉE · ENTRADA ✦
          </text>
          <text x="100" y="106" fill={INK} stroke="none" fontSize="17" fontWeight="700" letterSpacing="0.6"
            textAnchor="middle" style={{ fontFamily: "Georgia, serif" }}>
            {String(place || "").toUpperCase()}
          </text>
          <text x="100" y="134" fill={INK} stroke="none" fontSize="11" fontWeight="600" letterSpacing="1.6"
            textAnchor="middle" style={{ fontFamily: "Georgia, serif" }}>
            {String(date || "").toUpperCase()}
          </text>

          {/* little plane glyph */}
          <text x="100" y="152" fill={INK} stroke="none" fontSize="13" textAnchor="middle">
            ✈
          </text>
        </g>
      </svg>
    </div>
  );
}
