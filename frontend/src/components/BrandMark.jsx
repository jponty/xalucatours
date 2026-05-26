import React from "react";
import { Link } from "react-router-dom";

export const BrandMark = ({ inverted = false, className = "" }) => {
  const ink = inverted ? "#FDFBF7" : "#2C2621";
  return (
    <Link
      to="/"
      data-testid="brand-mark"
      className={`inline-flex items-baseline gap-2 ${className}`}
      style={{ color: ink }}
    >
      <span className="font-serif-x text-2xl md:text-[28px] leading-none tracking-tight">
        Xaluca
      </span>
      <span className="text-[#C16542] text-2xl md:text-[28px] leading-none">·</span>
      <span className="font-serif-x text-2xl md:text-[28px] leading-none tracking-tight italic">
        Tours
      </span>
      <span
        className="hidden md:inline text-[10px] tracking-[0.3em] uppercase ml-2 opacity-60"
        style={{ color: ink }}
      >
        Maroc
      </span>
    </Link>
  );
};
