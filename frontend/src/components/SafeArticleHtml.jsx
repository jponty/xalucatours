import React, { useMemo } from "react";

// Convert provider HTML into React nodes. No scripts, event handlers, inline
// styles, embeds or unknown attributes enter the live DOM.
const ALLOWED = new Set(["p", "h2", "h3", "h4", "ul", "ol", "li", "strong", "em", "b", "i", "blockquote", "a", "img", "br", "hr", "figure", "figcaption", "table", "thead", "tbody", "tr", "th", "td"]);
const CLASSES = {
  p: "mt-5 text-base md:text-lg text-[#3F352E] leading-[1.75]",
  h2: "font-serif-x text-3xl md:text-[36px] leading-[1.12] text-[#2C2621] mt-12",
  h3: "font-serif-x text-2xl leading-[1.2] text-[#2C2621] mt-9",
  h4: "font-semibold text-xl text-[#2C2621] mt-7",
  ul: "mt-5 list-disc pl-6 space-y-2 text-[#3F352E]",
  ol: "mt-5 list-decimal pl-6 space-y-2 text-[#3F352E]",
  blockquote: "mt-10 pl-6 border-l-2 border-[#C16542] italic text-xl text-[#2C2621]",
  a: "text-[#C16542] underline underline-offset-4",
  img: "w-full h-auto mt-8",
  figure: "mt-8",
  figcaption: "mt-2 text-sm text-[#5C5248]",
  table: "w-full min-w-[580px] border-collapse text-sm md:text-base text-[#3F352E]",
  thead: "bg-[#EFE7DA] text-[#2C2621]",
  th: "border border-[#D8C8B5] px-4 py-3 text-left align-top font-semibold",
  td: "border border-[#D8C8B5] px-4 py-3 align-top leading-relaxed",
};

const safeUrl = (value) => {
  try {
    const url = new URL(value, window.location.origin);
    return ["http:", "https:"].includes(url.protocol) ? url.href : null;
  } catch { return null; }
};

function nodeToReact(node, key) {
  if (node.nodeType === 3) return node.textContent;
  if (node.nodeType !== 1) return null;
  const tag = node.tagName.toLowerCase();
  if (["script", "style", "object", "embed", "form", "svg", "math"].includes(tag)) return null;
  if (tag === "iframe") {
    const src = node.getAttribute("src") || "";
    const match = /^https:\/\/www\.youtube-nocookie\.com\/embed\/([\w-]{11})(?:\?[^#]*)?$/.exec(src);
    if (!match) return null;
    return <div key={key} className="mt-9 aspect-video overflow-hidden rounded-lg bg-[#1A1513]">
      <iframe
        title="Vídeo del artículo"
        src={`https://www.youtube-nocookie.com/embed/${match[1]}`}
        className="h-full w-full border-0"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>;
  }
  if (tag === "col" || tag === "colgroup") return null;
  const children = Array.from(node.childNodes).map((child, i) => nodeToReact(child, i));
  if (tag === "table") return <div key={key} className="mt-8 overflow-x-auto rounded-lg border border-[#D8C8B5]" role="region" aria-label="Tabla del artículo" tabIndex={0}>
    <table className={CLASSES.table}>{children}</table>
  </div>;
  if (!ALLOWED.has(tag)) return <React.Fragment key={key}>{children}</React.Fragment>;
  const props = { key, className: CLASSES[tag] };
  if (tag === "a") {
    const href = safeUrl(node.getAttribute("href"));
    if (!href) return <React.Fragment key={key}>{children}</React.Fragment>;
    props.href = href;
    props.rel = "noopener noreferrer";
    props.target = "_blank";
  }
  if (tag === "img") {
    const src = safeUrl(node.getAttribute("src"));
    if (!src || !src.startsWith("https://")) return null;
    props.src = src;
    props.alt = node.getAttribute("alt") || "";
    props.loading = "lazy";
  }
  return React.createElement(tag, props, ...children);
}

export default function SafeArticleHtml({ html }) {
  const nodes = useMemo(() => {
    const doc = new DOMParser().parseFromString(html || "", "text/html");
    return Array.from(doc.body.childNodes).map((node, i) => nodeToReact(node, i));
  }, [html]);
  return <>{nodes}</>;
}
