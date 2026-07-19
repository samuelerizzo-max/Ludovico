// baby-registry.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Baby,
  Bath,
  Utensils,
  Shirt,
  Package,
  Heart,
  Gift,
  Settings,
  Plus,
  X,
  Check,
  Lock,
  Pencil,
  Trash2,
  ExternalLink,
  Sparkles,
  Loader2,
  RotateCcw
} from "lucide-react";
var C = {
  ink: "#0D3B52",
  inkSoft: "#164B66",
  linen: "#E7F4F6",
  card: "#F8FCFD",
  cardBorder: "#CFE6EA",
  brass: "#C9A15A",
  brassSoft: "#EFE1BE",
  sage: "#1D8A9B",
  sageSoft: "#D2EDF1",
  text: "#153140",
  textMuted: "#5C7C87",
  textOnInk: "#EFF8FA",
  textOnInkMuted: "#A9CDD6"
};
var CATEGORY_META = {
  nursery: { label: "Cameretta", icon: Baby },
  passeggio: { label: "Passeggio & uscite", icon: Package },
  bagnetto: { label: "Bagnetto", icon: Bath },
  pappa: { label: "Pappa", icon: Utensils },
  corredino: { label: "Corredino", icon: Shirt },
  altro: { label: "Altro", icon: Gift }
};
var CATEGORY_ORDER = ["nursery", "passeggio", "bagnetto", "pappa", "corredino", "altro"];
var DEFAULT_SETTINGS = {
  babyName: "Ludovico",
  dueLabel: "Settembre 2026",
  welcomeMessage: "Un piccolo aiuto per accoglierlo \xE8 gi\xE0 un regalo bellissimo.",
  paypalHandle: "",
  currency: "AED",
  eurRate: 0.238,
  adminPasscode: "",
  shippingAddress: "Samuele Rizzo\nBurj Khalifa St - adjacent to Al Ghafoor Mosque\nBurj Khalifa - Downtown Dubai\nDubai"
};
function uid() {
  return "g" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}
function paypalLinkFor(handleRaw, amount) {
  if (!handleRaw) return null;
  const handle = handleRaw.trim().replace(/^@/, "").replace(/^https?:\/\/(www\.)?paypal\.me\//i, "").replace(/\/$/, "");
  if (!handle) return null;
  const amt = amount ? `/${amount}` : "";
  return `https://paypal.me/${handle}${amt}`;
}
function formatDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "";
  }
}
function formatDual(amount, settings) {
  if (amount == null) return "\u2014";
  const eur = Math.round(amount * (settings.eurRate || 0));
  return `${amount} ${settings.currency} \xB7 \u2248${eur} \u20AC`;
}
function latticePattern(stroke, opacity, size) {
  const half = size / 2;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 ${size} ${size}'><g fill='none' stroke='${stroke}' stroke-width='1' opacity='${opacity}'><path d='M${half} 2 L${size - 2} ${half} L${half} ${size - 2} L2 ${half} Z'/><circle cx='${half}' cy='${half}' r='4'/></g></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
function archDividerPattern(fillColor, tileWidth, tileHeight) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${tileWidth}' height='${tileHeight}' viewBox='0 0 ${tileWidth} ${tileHeight}'><path d='M0 ${tileHeight} Q0 0 ${tileWidth / 2} 0 Q${tileWidth} 0 ${tileWidth} ${tileHeight} Z' fill='${fillColor}'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
var HERO_LATTICE = latticePattern(C.brass, 0.4, 64);
var BODY_LATTICE = latticePattern(C.brass, 0.07, 72);
var ARCH_DIVIDER = archDividerPattern(C.linen, 48, 26);
var CAMEL_D = "M 60 112 L 62 78 C 58 62 62 48 74 42 C 80 32 88 22 96 22 C 104 22 110 30 108 42 C 118 44 128 46 134 52 C 138 44 146 34 156 26 C 163 20 171 18 176 22 C 180 25 178 30 172 31 C 168 32 165 29 166 26 C 158 32 150 42 146 52 C 144 58 142 64 140 70 L 138 112 M 122 78 L 120 112 M 96 80 L 94 112 M 78 80 L 76 112 M 58 68 C 52 70 48 76 50 82";
var GAZELLE_BODY_D = "M 40 70 C 40 62 46 58 54 58 C 66 56 80 55 92 56 C 104 54 116 48 124 38 C 128 33 132 28 136 26 C 130 24 126 20 126 15 M 136 26 C 138 30 140 26 142 22 M 126 15 C 122 18 120 22 121 27 L 136 26 C 132 32 128 38 130 46 L 128 66 M 92 56 L 96 66";
var GAZELLE_LEGS_D = "M 50 66 L 48 100 M 62 66 L 60 100 M 108 62 L 110 100 M 122 60 L 126 100";
var GAZELLE_TAIL_D = "M 42 62 C 36 64 33 68 34 73";
var POODLE_HEAD_D = "M 62 38 a 6 6 0 0 1 5 -9 a 6 6 0 0 1 9 -4 a 6 6 0 0 1 10 0 a 6 6 0 0 1 9 4 a 6 6 0 0 1 5 9 a 7 7 0 0 1 2 10 a 7 7 0 0 1 -3 9 a 7 7 0 0 1 -8 5 a 8 8 0 0 1 -20 0 a 7 7 0 0 1 -8 -5 a 7 7 0 0 1 -3 -9 a 7 7 0 0 1 2 -10 Z";
var POODLE_EAR_D = "M 58 40 C 50 44 48 54 52 62 C 55 66 60 65 61 60";
var POODLE_BODY_D = "M 50 72 a 7 7 0 0 1 4 -8 a 8 8 0 0 1 10 -5 a 9 9 0 0 1 12 -2 a 9 9 0 0 1 12 2 a 8 8 0 0 1 10 5 a 7 7 0 0 1 4 8 a 8 8 0 0 1 2 10 a 8 8 0 0 1 -3 10 a 9 9 0 0 1 -48 0 a 8 8 0 0 1 -3 -10 a 8 8 0 0 1 2 -10 Z";
var POODLE_LEG1_D = "M 58 100 L 56 118";
var POODLE_LEG2_D = "M 104 100 L 106 118";
var POODLE_TAIL_D = "M 108 78 C 118 74 124 66 122 58";
function IconCamel(props) {
  return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 200 120", ...props }, /* @__PURE__ */ React.createElement("path", { d: CAMEL_D, fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round" }));
}
function IconGazelle(props) {
  return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 200 120", ...props }, /* @__PURE__ */ React.createElement("path", { d: GAZELLE_BODY_D, fill: "none", stroke: "currentColor", strokeWidth: "2.3", strokeLinecap: "round", strokeLinejoin: "round" }), /* @__PURE__ */ React.createElement("path", { d: GAZELLE_LEGS_D, fill: "none", stroke: "currentColor", strokeWidth: "2.3", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("path", { d: GAZELLE_TAIL_D, fill: "none", stroke: "currentColor", strokeWidth: "2.3", strokeLinecap: "round" }));
}
function IconPoodle(props) {
  return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 160 140", ...props }, /* @__PURE__ */ React.createElement("path", { d: POODLE_HEAD_D, fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinejoin: "round" }), /* @__PURE__ */ React.createElement("path", { d: POODLE_EAR_D, fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("path", { d: POODLE_BODY_D, fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinejoin: "round" }), /* @__PURE__ */ React.createElement("path", { d: POODLE_LEG1_D, fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("circle", { cx: "55", cy: "122", r: "4", fill: "none", stroke: "currentColor", strokeWidth: "2.2" }), /* @__PURE__ */ React.createElement("path", { d: POODLE_LEG2_D, fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("circle", { cx: "107", cy: "122", r: "4", fill: "none", stroke: "currentColor", strokeWidth: "2.2" }), /* @__PURE__ */ React.createElement("path", { d: POODLE_TAIL_D, fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("circle", { cx: "122", cy: "54", r: "6", fill: "none", stroke: "currentColor", strokeWidth: "2.2" }));
}
function IconFlagUAE(props) {
  return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 60 36", ...props }, /* @__PURE__ */ React.createElement("rect", { x: "0", y: "0", width: "15", height: "36", fill: "#B85C4A" }), /* @__PURE__ */ React.createElement("rect", { x: "15", y: "0", width: "45", height: "12", fill: "#7A8F5C" }), /* @__PURE__ */ React.createElement("rect", { x: "15", y: "12", width: "45", height: "12", fill: "#EFE6D3" }), /* @__PURE__ */ React.createElement("rect", { x: "15", y: "24", width: "45", height: "12", fill: "#2A3138" }));
}
function IconFlagItaly(props) {
  return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 60 36", ...props }, /* @__PURE__ */ React.createElement("rect", { x: "0", y: "0", width: "20", height: "36", fill: "#7A8F5C" }), /* @__PURE__ */ React.createElement("rect", { x: "20", y: "0", width: "20", height: "36", fill: "#EFE6D3" }), /* @__PURE__ */ React.createElement("rect", { x: "40", y: "0", width: "20", height: "36", fill: "#B85C4A" }));
}
function animalsPattern(color, opacity, size) {
  const grp = (paths, x, y, s) => {
    const sw = (2.4 / s).toFixed(2);
    const tags = paths.map((d) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`).join("");
    return `<g transform="translate(${x} ${y}) scale(${s})">${tags}</g>`;
  };
  const camel = (x, y, s) => grp([CAMEL_D], x, y, s);
  const gazelle = (x, y, s) => grp([GAZELLE_BODY_D, GAZELLE_LEGS_D, GAZELLE_TAIL_D], x, y, s);
  const poodle = (x, y, s) => grp([POODLE_HEAD_D, POODLE_EAR_D, POODLE_BODY_D, POODLE_LEG1_D, POODLE_LEG2_D, POODLE_TAIL_D], x, y, s);
  const content = [
    camel(4, 6, 0.22),
    gazelle(196, 12, 0.2),
    poodle(70, 40, 0.22),
    camel(230, 130, 0.19),
    gazelle(20, 170, 0.19),
    poodle(160, 190, 0.21),
    camel(90, 250, 0.2),
    gazelle(260, 260, 0.18),
    poodle(0, 290, 0.2)
  ].join("");
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 ${size} ${size}'><g opacity='${opacity}'>${content}</g></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
var BODY_ANIMALS = animalsPattern(C.brass, 0.16, 340);
function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [message, onDone]);
  if (!message) return null;
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full shadow-lg flex items-center gap-2",
      style: { backgroundColor: C.ink, color: C.textOnInk }
    },
    /* @__PURE__ */ React.createElement(Check, { className: "w-4 h-4", style: { color: C.brassSoft } }),
    /* @__PURE__ */ React.createElement("span", { className: "text-sm font-medium" }, message)
  );
}
function Ribbon({ tone, children }) {
  const bg = tone === "sage" ? C.sageSoft : C.brassSoft;
  const fg = tone === "sage" ? C.sage : C.brass;
  return /* @__PURE__ */ React.createElement(
    "span",
    {
      className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold",
      style: { backgroundColor: bg, color: fg }
    },
    children
  );
}
function ProgressBar({ value }) {
  const pct = Math.max(0, Math.min(100, value * 100));
  return /* @__PURE__ */ React.createElement("div", { className: "w-full h-1.5 rounded-full overflow-hidden", style: { backgroundColor: C.brassSoft } }, /* @__PURE__ */ React.createElement("div", { className: "h-full rounded-full", style: { width: `${pct}%`, backgroundColor: C.brass } }));
}
function GiftCard({ item, settings, isAdmin, onReserve, onContribute, onUnreserve, onToggleComplete, onEdit, onDelete }) {
  const [mode, setMode] = useState(null);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [noteCopied, setNoteCopied] = useState(false);
  const meta = CATEGORY_META[item.category] || CATEGORY_META.altro;
  const Icon = meta.icon;
  const suggestedNote = `Gift Card per: ${item.name}`;
  const copyNote = async () => {
    try {
      await navigator.clipboard.writeText(suggestedNote);
      setNoteCopied(true);
      setTimeout(() => setNoteCopied(false), 2e3);
    } catch {
      setNoteCopied(false);
    }
  };
  const status = item.reservedBy ? "reserved" : item.price != null && item.contributed >= item.price ? "funded" : item.completed ? "completed" : "open";
  const closeForm = () => {
    setMode(null);
    setName("");
    setAmount("");
  };
  const submitReserve = () => {
    onReserve(item.id, name);
    if (item.productUrl) window.open(item.productUrl, "_blank", "noopener");
    closeForm();
  };
  const submitContribute = () => {
    const amt = Number(amount);
    if (!amt || amt <= 0) return;
    onContribute(item.id, name, amt);
    const link = paypalLinkFor(settings.paypalHandle, amt);
    if (link) window.open(link, "_blank", "noopener");
    closeForm();
  };
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "relative rounded-2xl p-5 pt-6 flex flex-col gap-3",
      style: { backgroundColor: C.card, border: `1px solid ${C.cardBorder}` }
    },
    /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "absolute -top-2.5 left-6 w-3.5 h-3.5 rounded-full",
        style: { border: `2px solid ${C.brass}`, backgroundColor: C.linen }
      }
    ),
    /* @__PURE__ */ React.createElement("div", { className: "absolute -top-1 left-7 w-px h-2", style: { backgroundColor: C.brass, opacity: 0.5 } }),
    item.imageUrl && /* @__PURE__ */ React.createElement("div", { className: "-mx-5 -mt-6 mb-1 rounded-t-2xl overflow-hidden", style: { backgroundColor: C.linen } }, /* @__PURE__ */ React.createElement(
      "img",
      {
        src: item.imageUrl,
        alt: item.name,
        className: "w-full h-40 object-cover",
        onError: (e) => {
          e.currentTarget.parentElement.style.display = "none";
        }
      }
    )),
    /* @__PURE__ */ React.createElement("div", { className: "flex items-start justify-between gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2.5" }, /* @__PURE__ */ React.createElement("div", { className: "w-9 h-9 rounded-full flex items-center justify-center shrink-0", style: { backgroundColor: C.sageSoft } }, /* @__PURE__ */ React.createElement(Icon, { className: "w-4 h-4", style: { color: C.sage } })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-xs font-medium uppercase tracking-wide", style: { color: C.textMuted } }, meta.label))), isAdmin && /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1" }, /* @__PURE__ */ React.createElement("button", { onClick: () => onEdit(item), className: "p-1.5 rounded-lg hover:opacity-70", style: { color: C.textMuted }, "aria-label": "Modifica" }, /* @__PURE__ */ React.createElement(Pencil, { className: "w-3.5 h-3.5" })), /* @__PURE__ */ React.createElement("button", { onClick: () => onDelete(item.id), className: "p-1.5 rounded-lg hover:opacity-70", style: { color: C.textMuted }, "aria-label": "Elimina" }, /* @__PURE__ */ React.createElement(Trash2, { className: "w-3.5 h-3.5" })))),
    /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-display text-lg leading-snug", style: { color: C.text } }, item.name), item.notes && /* @__PURE__ */ React.createElement("p", { className: "text-sm mt-1", style: { color: C.textMuted } }, item.notes)),
    item.price != null && /* @__PURE__ */ React.createElement("p", { className: "text-sm font-semibold", style: { color: C.text } }, formatDual(item.price, settings)),
    item.price != null && item.contributed > 0 && status !== "reserved" && /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-1" }, /* @__PURE__ */ React.createElement(ProgressBar, { value: item.contributed / item.price }), /* @__PURE__ */ React.createElement("p", { className: "text-xs", style: { color: C.textMuted } }, formatDual(item.contributed, settings), " raccolti su ", formatDual(item.price, settings))),
    status === "reserved" && /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between gap-2" }, /* @__PURE__ */ React.createElement(Ribbon, { tone: "brass" }, /* @__PURE__ */ React.createElement(Gift, { className: "w-3 h-3" }), " Riservato da ", item.reservedBy), isAdmin && /* @__PURE__ */ React.createElement("button", { onClick: () => onUnreserve(item.id), className: "text-xs underline flex items-center gap-1", style: { color: C.textMuted } }, /* @__PURE__ */ React.createElement(RotateCcw, { className: "w-3 h-3" }), " annulla")),
    status === "funded" && /* @__PURE__ */ React.createElement(Ribbon, { tone: "sage" }, /* @__PURE__ */ React.createElement(Sparkles, { className: "w-3 h-3" }), " Regalo finanziato"),
    status === "completed" && /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between gap-2" }, /* @__PURE__ */ React.createElement(Ribbon, { tone: "sage" }, /* @__PURE__ */ React.createElement(Check, { className: "w-3 h-3" }), " Completato"), isAdmin && /* @__PURE__ */ React.createElement("button", { onClick: () => onToggleComplete(item.id, false), className: "text-xs underline", style: { color: C.textMuted } }, "riapri")),
    status === "open" && mode === null && /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setMode("choice"),
        className: "px-4 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 mt-1 transition hover:-translate-y-0.5",
        style: { backgroundColor: C.ink, color: C.textOnInk }
      },
      "Partecipa a questo regalo ",
      /* @__PURE__ */ React.createElement(Gift, { className: "w-3.5 h-3.5" })
    ),
    status === "open" && mode === "choice" && /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-2 mt-1" }, item.productUrl && /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setMode("address"),
        className: "flex-1 min-w-[130px] px-3 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition hover:-translate-y-0.5",
        style: { backgroundColor: C.ink, color: C.textOnInk }
      },
      "Lo compro io ",
      /* @__PURE__ */ React.createElement(ExternalLink, { className: "w-3.5 h-3.5" })
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setMode("contribute"),
        className: "flex-1 min-w-[130px] px-3 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 border transition hover:-translate-y-0.5",
        style: { borderColor: C.brass, color: C.brass, backgroundColor: "transparent" }
      },
      "Manda Gift Card ",
      /* @__PURE__ */ React.createElement(Heart, { className: "w-3.5 h-3.5" })
    ), /* @__PURE__ */ React.createElement("button", { onClick: () => setMode(null), className: "text-xs underline w-full text-left", style: { color: C.textMuted } }, "annulla"), isAdmin && item.price == null && /* @__PURE__ */ React.createElement("button", { onClick: () => onToggleComplete(item.id, true), className: "text-xs underline w-full text-left", style: { color: C.textMuted } }, "segna come completato")),
    mode === "address" && /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", style: { backgroundColor: "rgba(13,59,82,0.55)" } }, /* @__PURE__ */ React.createElement("div", { className: "w-full max-w-sm rounded-2xl p-6", style: { backgroundColor: C.card } }, /* @__PURE__ */ React.createElement("h3", { className: "font-display text-lg mb-1", style: { color: C.text } }, "Indirizzo di spedizione"), /* @__PURE__ */ React.createElement("p", { className: "text-sm mb-3", style: { color: C.textMuted } }, "Usa questo indirizzo quando completi l'ordine sul sito del negozio:"), /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "p-3 rounded-xl text-sm whitespace-pre-line mb-4",
        style: { backgroundColor: C.linen, color: C.text, border: `1px solid ${C.cardBorder}` }
      },
      settings.shippingAddress
    ), /* @__PURE__ */ React.createElement("label", { className: "text-xs font-medium", style: { color: C.textMuted } }, "Il tuo nome (facoltativo)"), /* @__PURE__ */ React.createElement(
      "input",
      {
        value: name,
        onChange: (e) => setName(e.target.value),
        placeholder: "Nome",
        className: "w-full px-3 py-2 rounded-lg text-sm border outline-none mt-1 mb-1",
        style: { borderColor: C.cardBorder }
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 mt-3" }, /* @__PURE__ */ React.createElement("button", { onClick: submitReserve, className: "flex-1 px-3 py-2 rounded-lg text-sm font-semibold", style: { backgroundColor: C.ink, color: C.textOnInk } }, "Ho capito, vai al sito"), /* @__PURE__ */ React.createElement("button", { onClick: closeForm, className: "px-3 py-2 rounded-lg text-sm", style: { color: C.textMuted } }, "Annulla")))),
    mode === "contribute" && /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-2 mt-1 p-3 rounded-xl", style: { backgroundColor: C.linen } }, /* @__PURE__ */ React.createElement("p", { className: "text-sm font-semibold", style: { color: C.text } }, "Manda una Gift Card via PayPal"), /* @__PURE__ */ React.createElement("label", { className: "text-xs font-medium", style: { color: C.textMuted } }, "Il tuo nome (facoltativo)"), /* @__PURE__ */ React.createElement(
      "input",
      {
        value: name,
        onChange: (e) => setName(e.target.value),
        placeholder: "Nome",
        className: "px-3 py-2 rounded-lg text-sm border outline-none",
        style: { borderColor: C.cardBorder }
      }
    ), /* @__PURE__ */ React.createElement("label", { className: "text-xs font-medium mt-1", style: { color: C.textMuted } }, "Quanto vuoi inviare (", settings.currency, ")"), /* @__PURE__ */ React.createElement(
      "input",
      {
        value: amount,
        onChange: (e) => setAmount(e.target.value),
        placeholder: "100",
        type: "number",
        min: "1",
        className: "px-3 py-2 rounded-lg text-sm border outline-none",
        style: { borderColor: C.cardBorder }
      }
    ), Number(amount) > 0 && /* @__PURE__ */ React.createElement("p", { className: "text-xs", style: { color: C.sage } }, "\u2248 ", Math.round(Number(amount) * (settings.eurRate || 0)), " \u20AC circa"), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between gap-2 p-2 rounded-lg", style: { backgroundColor: C.card, border: `1px solid ${C.cardBorder}` } }, /* @__PURE__ */ React.createElement("span", { className: "text-xs truncate", style: { color: C.text } }, 'Nota per PayPal: "', suggestedNote, '"'), /* @__PURE__ */ React.createElement("button", { onClick: copyNote, className: "text-xs font-semibold shrink-0", style: { color: C.brass } }, noteCopied ? "Copiato \u2713" : "Copia")), /* @__PURE__ */ React.createElement("p", { className: "text-xs", style: { color: C.textMuted } }, "PayPal non permette di precompilare la nota da un link: copiala e incollala tu nel campo note quando arrivi su PayPal."), /* @__PURE__ */ React.createElement("p", { className: "text-xs", style: { color: C.textMuted } }, "La Gift Card viene segnata come inviata quando confermi qui sotto. Il pagamento vero e proprio avviene su PayPal."), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 mt-1" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: submitContribute,
        disabled: !settings.paypalHandle,
        className: "flex-1 px-3 py-2 rounded-lg text-sm font-semibold disabled:opacity-50",
        style: { backgroundColor: C.brass, color: C.textOnInk }
      },
      "Vai su PayPal e invia"
    ), /* @__PURE__ */ React.createElement("button", { onClick: closeForm, className: "px-3 py-2 rounded-lg text-sm", style: { color: C.textMuted } }, "Annulla")), !settings.paypalHandle && /* @__PURE__ */ React.createElement("p", { className: "text-xs", style: { color: C.brass } }, "Il link PayPal non \xE8 stato ancora configurato."))
  );
}
function ItemFormModal({ initial, onSave, onClose }) {
  const [name, setName] = useState(initial?.name || "");
  const [category, setCategory] = useState(initial?.category || "altro");
  const [price, setPrice] = useState(initial?.price ?? "");
  const [productUrl, setProductUrl] = useState(initial?.productUrl || "");
  const [notes, setNotes] = useState(initial?.notes || "");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl || "");
  const [imageStatus, setImageStatus] = useState("idle");
  const [err, setErr] = useState("");
  const lastFetchedUrl = useRef(initial?.productUrl || "");
  useEffect(() => {
    const trimmed = productUrl.trim();
    if (!trimmed || !/^https?:\/\//i.test(trimmed) || trimmed === lastFetchedUrl.current) return;
    const handle = setTimeout(async () => {
      setImageStatus("loading");
      try {
        const res = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(trimmed)}`);
        const json = await res.json();
        const found = json?.data?.image?.url || json?.data?.logo?.url || "";
        lastFetchedUrl.current = trimmed;
        if (found) {
          setImageUrl(found);
          setImageStatus("done");
        } else {
          setImageStatus("error");
        }
      } catch {
        lastFetchedUrl.current = trimmed;
        setImageStatus("error");
      }
    }, 700);
    return () => clearTimeout(handle);
  }, [productUrl]);
  const submit = () => {
    if (!name.trim()) {
      setErr("Inserisci un nome per il regalo.");
      return;
    }
    onSave({
      name,
      category,
      price: price === "" ? null : Number(price),
      productUrl,
      notes,
      imageUrl
    });
  };
  return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", style: { backgroundColor: "rgba(30,42,61,0.55)" } }, /* @__PURE__ */ React.createElement("div", { className: "w-full max-w-md rounded-2xl p-6 max-h-[90vh] overflow-y-auto", style: { backgroundColor: C.card } }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-4" }, /* @__PURE__ */ React.createElement("h3", { className: "font-display text-xl", style: { color: C.text } }, initial ? "Modifica regalo" : "Nuovo regalo"), /* @__PURE__ */ React.createElement("button", { onClick: onClose, style: { color: C.textMuted } }, /* @__PURE__ */ React.createElement(X, { className: "w-5 h-5" }))), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-3" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-xs font-medium", style: { color: C.textMuted } }, "Nome del regalo"), /* @__PURE__ */ React.createElement("input", { value: name, onChange: (e) => setName(e.target.value), className: "w-full px-3 py-2 rounded-lg text-sm border outline-none mt-1", style: { borderColor: C.cardBorder }, placeholder: "Es. Passeggino Stokke" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-xs font-medium", style: { color: C.textMuted } }, "Categoria"), /* @__PURE__ */ React.createElement("select", { value: category, onChange: (e) => setCategory(e.target.value), className: "w-full px-3 py-2 rounded-lg text-sm border outline-none mt-1", style: { borderColor: C.cardBorder } }, CATEGORY_ORDER.map((c) => /* @__PURE__ */ React.createElement("option", { key: c, value: c }, CATEGORY_META[c].label)))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-xs font-medium", style: { color: C.textMuted } }, "Prezzo in AED (facoltativo \u2014 lascia vuoto per offerta libera)"), /* @__PURE__ */ React.createElement("input", { value: price, onChange: (e) => setPrice(e.target.value), type: "number", min: "0", className: "w-full px-3 py-2 rounded-lg text-sm border outline-none mt-1", style: { borderColor: C.cardBorder }, placeholder: "Es. 450" }), /* @__PURE__ */ React.createElement("p", { className: "text-xs mt-1", style: { color: C.textMuted } }, "Il controvalore in EUR viene calcolato automaticamente.")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-xs font-medium", style: { color: C.textMuted } }, "Link al prodotto (facoltativo)"), /* @__PURE__ */ React.createElement("input", { value: productUrl, onChange: (e) => setProductUrl(e.target.value), className: "w-full px-3 py-2 rounded-lg text-sm border outline-none mt-1", style: { borderColor: C.cardBorder }, placeholder: "https://..." }), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 mt-2" }, imageStatus === "loading" && /* @__PURE__ */ React.createElement("span", { className: "text-xs flex items-center gap-1.5", style: { color: C.textMuted } }, /* @__PURE__ */ React.createElement(Loader2, { className: "w-3 h-3 animate-spin" }), " Recupero la foto dal sito\u2026"), imageStatus === "error" && !imageUrl && /* @__PURE__ */ React.createElement("span", { className: "text-xs", style: { color: C.textMuted } }, "Non sono riuscito a trovare una foto \u2014 puoi incollarne una qui sotto."), imageUrl && /* @__PURE__ */ React.createElement(
    "img",
    {
      src: imageUrl,
      alt: "",
      className: "w-14 h-14 rounded-lg object-cover",
      style: { border: `1px solid ${C.cardBorder}` },
      onError: () => setImageUrl("")
    }
  )), /* @__PURE__ */ React.createElement(
    "input",
    {
      value: imageUrl,
      onChange: (e) => {
        setImageUrl(e.target.value);
        lastFetchedUrl.current = productUrl.trim();
        setImageStatus("idle");
      },
      className: "w-full px-3 py-2 rounded-lg text-sm border outline-none mt-2",
      style: { borderColor: C.cardBorder },
      placeholder: "Oppure incolla qui il link diretto a una foto"
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-xs font-medium", style: { color: C.textMuted } }, "Note (facoltative)"), /* @__PURE__ */ React.createElement("textarea", { value: notes, onChange: (e) => setNotes(e.target.value), rows: 2, className: "w-full px-3 py-2 rounded-lg text-sm border outline-none mt-1", style: { borderColor: C.cardBorder }, placeholder: "Taglia, colore, dettagli utili" })), err && /* @__PURE__ */ React.createElement("p", { className: "text-xs", style: { color: "#B24444" } }, err), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 mt-2" }, /* @__PURE__ */ React.createElement("button", { onClick: submit, className: "flex-1 px-4 py-2 rounded-lg text-sm font-semibold", style: { backgroundColor: C.ink, color: C.textOnInk } }, "Salva"), /* @__PURE__ */ React.createElement("button", { onClick: onClose, className: "px-4 py-2 rounded-lg text-sm", style: { color: C.textMuted } }, "Annulla")))));
}
function AdminPanel({ settings, items, initialEditItem, onClose, onSaveSettings, onAddItem, onUpdateItem, onDeleteItem }) {
  const [formOpen, setFormOpen] = useState(!!initialEditItem);
  const [editing, setEditing] = useState(initialEditItem || null);
  const [babyName, setBabyName] = useState(settings.babyName);
  const [dueLabel, setDueLabel] = useState(settings.dueLabel);
  const [welcomeMessage, setWelcomeMessage] = useState(settings.welcomeMessage);
  const [paypalHandle, setPaypalHandle] = useState(settings.paypalHandle);
  const [currency, setCurrency] = useState(settings.currency);
  const [eurRate, setEurRate] = useState(settings.eurRate);
  const [shippingAddress, setShippingAddress] = useState(settings.shippingAddress);
  const [newPasscode, setNewPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const [passcodeErr, setPasscodeErr] = useState("");
  const saveGeneral = () => onSaveSettings({ ...settings, babyName, dueLabel, welcomeMessage, paypalHandle, currency, eurRate: Number(eurRate) || 0, shippingAddress });
  const changePasscode = () => {
    if (newPasscode.trim().length < 4) {
      setPasscodeErr("Almeno 4 caratteri.");
      return;
    }
    if (newPasscode !== confirmPasscode) {
      setPasscodeErr("Le due password non coincidono.");
      return;
    }
    onSaveSettings({ ...settings, adminPasscode: newPasscode.trim() });
    setPasscodeErr("");
    setNewPasscode("");
    setConfirmPasscode("");
  };
  const ledger = [];
  items.forEach((it) => {
    if (it.reservedBy) {
      ledger.push({ type: "reserve", itemName: it.name, name: it.reservedBy, amount: it.price, date: it.reservedAt });
    }
    (it.contributors || []).forEach((c) => {
      ledger.push({ type: "contribute", itemName: it.name, name: c.name, amount: c.amount, date: c.date });
    });
  });
  ledger.sort((a, b) => new Date(b.date) - new Date(a.date));
  const totalContributed = items.reduce((s, it) => s + (it.contributed || 0), 0);
  return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-40 flex justify-end", style: { backgroundColor: "rgba(30,42,61,0.55)" } }, /* @__PURE__ */ React.createElement("div", { className: "w-full max-w-lg h-full overflow-y-auto p-6", style: { backgroundColor: C.linen } }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-6" }, /* @__PURE__ */ React.createElement("h2", { className: "font-display text-2xl", style: { color: C.text } }, "Gestisci lista"), /* @__PURE__ */ React.createElement("button", { onClick: onClose, style: { color: C.textMuted } }, /* @__PURE__ */ React.createElement(X, { className: "w-5 h-5" }))), /* @__PURE__ */ React.createElement("section", { className: "mb-8" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-baseline justify-between mb-3" }, /* @__PURE__ */ React.createElement("h3", { className: "text-xs font-semibold uppercase tracking-wide", style: { color: C.textMuted } }, "Chi ha comprato cosa"), /* @__PURE__ */ React.createElement("span", { className: "text-sm font-semibold", style: { color: C.brass } }, formatDual(totalContributed, settings), " ricevuti")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-2" }, ledger.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "text-sm p-4 rounded-xl", style: { backgroundColor: C.card, color: C.textMuted, border: `1px solid ${C.cardBorder}` } }, "Nessuna prenotazione o Gift Card ancora registrata."), ledger.map((row, idx) => /* @__PURE__ */ React.createElement("div", { key: idx, className: "flex items-center justify-between gap-2 p-3 rounded-xl", style: { backgroundColor: C.card, border: `1px solid ${C.cardBorder}` } }, /* @__PURE__ */ React.createElement("div", { className: "min-w-0" }, /* @__PURE__ */ React.createElement("p", { className: "text-sm font-semibold truncate", style: { color: C.text } }, row.name), /* @__PURE__ */ React.createElement("p", { className: "text-xs truncate", style: { color: C.textMuted } }, row.type === "reserve" ? "Compra direttamente: " : "Gift Card per: ", row.itemName, " \xB7 ", formatDate(row.date))), /* @__PURE__ */ React.createElement("span", { className: "text-sm font-semibold shrink-0 text-right", style: { color: row.type === "reserve" ? C.textMuted : C.sage } }, row.type === "reserve" ? formatDual(row.amount, settings) : `+ ${formatDual(row.amount, settings)}`)))), /* @__PURE__ */ React.createElement("p", { className: "text-xs mt-2", style: { color: C.textMuted } }, "Gli importi con \u201C+\u201D sono contributi PayPal segnati come inviati dagli ospiti: confrontali col tuo saldo PayPal per essere sicuro che siano arrivati davvero.")), /* @__PURE__ */ React.createElement("section", { className: "mb-8" }, /* @__PURE__ */ React.createElement("h3", { className: "text-xs font-semibold uppercase tracking-wide mb-3", style: { color: C.textMuted } }, "Impostazioni generali"), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-3 p-4 rounded-2xl", style: { backgroundColor: C.card, border: `1px solid ${C.cardBorder}` } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-xs font-medium", style: { color: C.textMuted } }, "Nome del beb\xE8"), /* @__PURE__ */ React.createElement("input", { value: babyName, onChange: (e) => setBabyName(e.target.value), className: "w-full px-3 py-2 rounded-lg text-sm border outline-none mt-1", style: { borderColor: C.cardBorder } })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-xs font-medium", style: { color: C.textMuted } }, "Data prevista"), /* @__PURE__ */ React.createElement("input", { value: dueLabel, onChange: (e) => setDueLabel(e.target.value), className: "w-full px-3 py-2 rounded-lg text-sm border outline-none mt-1", style: { borderColor: C.cardBorder } })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-xs font-medium", style: { color: C.textMuted } }, "Messaggio di benvenuto"), /* @__PURE__ */ React.createElement("textarea", { value: welcomeMessage, onChange: (e) => setWelcomeMessage(e.target.value), rows: 2, className: "w-full px-3 py-2 rounded-lg text-sm border outline-none mt-1", style: { borderColor: C.cardBorder } })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-xs font-medium", style: { color: C.textMuted } }, 'Il tuo PayPal.me (es. paypal.me/nome oppure solo "nome")'), /* @__PURE__ */ React.createElement("input", { value: paypalHandle, onChange: (e) => setPaypalHandle(e.target.value), className: "w-full px-3 py-2 rounded-lg text-sm border outline-none mt-1", style: { borderColor: C.cardBorder }, placeholder: "tuonome" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-xs font-medium", style: { color: C.textMuted } }, "Valuta mostrata"), /* @__PURE__ */ React.createElement("input", { value: currency, onChange: (e) => setCurrency(e.target.value), className: "w-full px-3 py-2 rounded-lg text-sm border outline-none mt-1", style: { borderColor: C.cardBorder }, placeholder: "AED" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-xs font-medium", style: { color: C.textMuted } }, "Tasso di cambio \u2014 1 ", currency || "AED", " = ___ EUR"), /* @__PURE__ */ React.createElement("input", { value: eurRate, onChange: (e) => setEurRate(e.target.value), type: "number", step: "0.001", min: "0", className: "w-full px-3 py-2 rounded-lg text-sm border outline-none mt-1", style: { borderColor: C.cardBorder }, placeholder: "0.238" }), /* @__PURE__ */ React.createElement("p", { className: "text-xs mt-1", style: { color: C.textMuted } }, "Usato per mostrare il controvalore in euro accanto a ogni importo. Aggiornalo di tanto in tanto.")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-xs font-medium", style: { color: C.textMuted } }, "Indirizzo di spedizione"), /* @__PURE__ */ React.createElement("textarea", { value: shippingAddress, onChange: (e) => setShippingAddress(e.target.value), rows: 3, className: "w-full px-3 py-2 rounded-lg text-sm border outline-none mt-1", style: { borderColor: C.cardBorder } }), /* @__PURE__ */ React.createElement("p", { className: "text-xs mt-1", style: { color: C.textMuted } }, 'Mostrato agli ospiti che scelgono "Lo compro io", prima di aprire il sito del negozio.')), /* @__PURE__ */ React.createElement("button", { onClick: saveGeneral, className: "px-4 py-2 rounded-lg text-sm font-semibold w-fit", style: { backgroundColor: C.ink, color: C.textOnInk } }, "Salva impostazioni"))), /* @__PURE__ */ React.createElement("section", { className: "mb-8" }, /* @__PURE__ */ React.createElement("h3", { className: "text-xs font-semibold uppercase tracking-wide mb-3", style: { color: C.textMuted } }, "Password di gestione"), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-3 p-4 rounded-2xl", style: { backgroundColor: C.card, border: `1px solid ${C.cardBorder}` } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-xs font-medium", style: { color: C.textMuted } }, "Nuova password"), /* @__PURE__ */ React.createElement("input", { value: newPasscode, onChange: (e) => setNewPasscode(e.target.value), type: "password", className: "w-full px-3 py-2 rounded-lg text-sm border outline-none mt-1", style: { borderColor: C.cardBorder } })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-xs font-medium", style: { color: C.textMuted } }, "Conferma nuova password"), /* @__PURE__ */ React.createElement("input", { value: confirmPasscode, onChange: (e) => setConfirmPasscode(e.target.value), type: "password", className: "w-full px-3 py-2 rounded-lg text-sm border outline-none mt-1", style: { borderColor: C.cardBorder } })), passcodeErr && /* @__PURE__ */ React.createElement("p", { className: "text-xs", style: { color: "#B24444" } }, passcodeErr), /* @__PURE__ */ React.createElement("button", { onClick: changePasscode, className: "px-4 py-2 rounded-lg text-sm font-semibold w-fit", style: { backgroundColor: C.brass, color: C.textOnInk } }, "Aggiorna password"))), /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-3" }, /* @__PURE__ */ React.createElement("h3", { className: "text-xs font-semibold uppercase tracking-wide", style: { color: C.textMuted } }, "Regali (", items.length, ")"), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setEditing(null);
    setFormOpen(true);
  }, className: "flex items-center gap-1 text-sm font-semibold px-3 py-1.5 rounded-lg", style: { backgroundColor: C.brass, color: C.textOnInk } }, /* @__PURE__ */ React.createElement(Plus, { className: "w-3.5 h-3.5" }), " Aggiungi")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-2" }, items.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "text-sm p-4 rounded-xl", style: { backgroundColor: C.card, color: C.textMuted, border: `1px solid ${C.cardBorder}` } }, "Nessun regalo ancora. Aggiungi il primo con il pulsante qui sopra."), items.map((it) => /* @__PURE__ */ React.createElement("div", { key: it.id, className: "flex items-center justify-between gap-2 p-3 rounded-xl", style: { backgroundColor: C.card, border: `1px solid ${C.cardBorder}` } }, /* @__PURE__ */ React.createElement("div", { className: "min-w-0" }, /* @__PURE__ */ React.createElement("p", { className: "text-sm font-semibold truncate", style: { color: C.text } }, it.name), /* @__PURE__ */ React.createElement("p", { className: "text-xs", style: { color: C.textMuted } }, CATEGORY_META[it.category]?.label, " ", it.price != null ? `\xB7 ${it.price} ${settings.currency}` : "\xB7 offerta libera", it.reservedBy ? ` \xB7 riservato da ${it.reservedBy}` : "")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1 shrink-0" }, /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setEditing(it);
    setFormOpen(true);
  }, style: { color: C.textMuted } }, /* @__PURE__ */ React.createElement(Pencil, { className: "w-4 h-4" })), /* @__PURE__ */ React.createElement("button", { onClick: () => onDeleteItem(it.id), style: { color: C.textMuted } }, /* @__PURE__ */ React.createElement(Trash2, { className: "w-4 h-4" })))))))), formOpen && /* @__PURE__ */ React.createElement(
    ItemFormModal,
    {
      initial: editing,
      onClose: () => setFormOpen(false),
      onSave: (data) => {
        if (editing) onUpdateItem(editing.id, data);
        else onAddItem(data);
        setFormOpen(false);
      }
    }
  ));
}
function AdminGate({ hasPasscode, onSubmit, onClose }) {
  const [val, setVal] = useState("");
  const [confirmVal, setConfirmVal] = useState("");
  const [err, setErr] = useState("");
  const submit = () => {
    if (!hasPasscode) {
      if (val.trim().length < 4) {
        setErr("Scegli una password di almeno 4 caratteri.");
        return;
      }
      if (val !== confirmVal) {
        setErr("Le due password non coincidono.");
        return;
      }
      onSubmit(val.trim());
    } else {
      onSubmit(val, setErr);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", style: { backgroundColor: "rgba(30,42,61,0.55)" } }, /* @__PURE__ */ React.createElement("div", { className: "w-full max-w-sm rounded-2xl p-6", style: { backgroundColor: C.card } }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 mb-3" }, /* @__PURE__ */ React.createElement(Lock, { className: "w-4 h-4", style: { color: C.brass } }), /* @__PURE__ */ React.createElement("h3", { className: "font-display text-lg", style: { color: C.text } }, hasPasscode ? "Area gestione" : "Imposta una password")), /* @__PURE__ */ React.createElement("p", { className: "text-sm mb-4", style: { color: C.textMuted } }, hasPasscode ? "Inserisci la password per modificare la lista." : "Nessuna password \xE8 ancora impostata. Scegline una: la useremo per proteggere le modifiche alla lista (non \xE8 una protezione a prova di esperti, ma tiene fuori i curiosi)."), /* @__PURE__ */ React.createElement(
    "input",
    {
      value: val,
      onChange: (e) => setVal(e.target.value),
      type: "password",
      placeholder: "Password",
      className: "w-full px-3 py-2 rounded-lg text-sm border outline-none",
      style: { borderColor: C.cardBorder }
    }
  ), !hasPasscode && /* @__PURE__ */ React.createElement(
    "input",
    {
      value: confirmVal,
      onChange: (e) => setConfirmVal(e.target.value),
      type: "password",
      placeholder: "Conferma password",
      className: "w-full px-3 py-2 rounded-lg text-sm border outline-none mt-2",
      style: { borderColor: C.cardBorder }
    }
  ), err && /* @__PURE__ */ React.createElement("p", { className: "text-xs mt-2", style: { color: "#B24444" } }, err), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 mt-4" }, /* @__PURE__ */ React.createElement("button", { onClick: submit, className: "flex-1 px-4 py-2 rounded-lg text-sm font-semibold", style: { backgroundColor: C.ink, color: C.textOnInk } }, "Continua"), /* @__PURE__ */ React.createElement("button", { onClick: onClose, className: "px-4 py-2 rounded-lg text-sm", style: { color: C.textMuted } }, "Annulla"))));
}
function BabyRegistry() {
  const [settings, setSettings] = useState(null);
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("tutti");
  const [gateOpen, setGateOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [toast, setToast] = useState("");
  const [editTarget, setEditTarget] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        let s = null;
        try {
          const r = await window.storage.get("settings", true);
          s = r ? JSON.parse(r.value) : null;
        } catch {
          s = null;
        }
        if (!s) {
          s = { ...DEFAULT_SETTINGS };
          await window.storage.set("settings", JSON.stringify(s), true);
        }
        setSettings(s);
        let it = null;
        try {
          const r2 = await window.storage.get("items", true);
          it = r2 ? JSON.parse(r2.value) : null;
        } catch {
          it = null;
        }
        if (!it) {
          it = [];
          await window.storage.set("items", JSON.stringify(it), true);
        }
        setItems(it);
      } catch (e) {
        setError("Non \xE8 stato possibile caricare la lista. Ricarica la pagina.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  const persistSettings = useCallback(async (next) => {
    setSettings(next);
    try {
      await window.storage.set("settings", JSON.stringify(next), true);
    } catch {
      setError("Salvataggio non riuscito. Controlla la connessione.");
    }
  }, []);
  const persistItems = useCallback(async (next) => {
    setItems(next);
    try {
      await window.storage.set("items", JSON.stringify(next), true);
    } catch {
      setError("Salvataggio non riuscito. Controlla la connessione.");
    }
  }, []);
  const showToast = (msg) => setToast(msg);
  const addItem = (data) => {
    const newItem = { id: uid(), reservedBy: null, reservedAt: null, contributed: 0, contributors: [], completed: false, ...data };
    persistItems([...items || [], newItem]);
    showToast("Regalo aggiunto");
  };
  const updateItem = (id, patch) => {
    persistItems(items.map((i) => i.id === id ? { ...i, ...patch } : i));
  };
  const deleteItem = (id) => {
    persistItems(items.filter((i) => i.id !== id));
    showToast("Regalo eliminato");
  };
  const reserveItem = (id, name) => {
    updateItem(id, { reservedBy: name.trim() || "Un ospite", reservedAt: (/* @__PURE__ */ new Date()).toISOString() });
    showToast("Prenotazione registrata, grazie!");
  };
  const unreserveItem = (id) => updateItem(id, { reservedBy: null, reservedAt: null });
  const toggleComplete = (id, val) => updateItem(id, { completed: val });
  const contributeToItem = (id, name, amount) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const contributors = [...item.contributors, { name: name.trim() || "Un ospite", amount, date: (/* @__PURE__ */ new Date()).toISOString() }];
    updateItem(id, { contributed: item.contributed + amount, contributors });
    showToast("Contributo registrato, grazie!");
  };
  const handleGateSubmit = (val, setErr) => {
    if (!settings.adminPasscode) {
      persistSettings({ ...settings, adminPasscode: val });
      setIsAdmin(true);
      setGateOpen(false);
      setAdminOpen(true);
    } else if (val === settings.adminPasscode) {
      setIsAdmin(true);
      setGateOpen(false);
      setAdminOpen(true);
    } else if (setErr) {
      setErr("Password errata.");
    }
  };
  if (loading) {
    return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen flex items-center justify-center", style: { backgroundColor: C.linen } }, /* @__PURE__ */ React.createElement(Loader2, { className: "w-6 h-6 animate-spin", style: { color: C.brass } }));
  }
  const visibleItems = activeCategory === "tutti" ? items : items.filter((i) => i.category === activeCategory);
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen", style: { backgroundColor: C.linen, backgroundImage: `${BODY_ANIMALS}, ${BODY_LATTICE}`, backgroundRepeat: "repeat, repeat" } }, /* @__PURE__ */ React.createElement("style", null, `
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Karla:wght@400;500;600;700&display=swap');
        * { font-family: 'Karla', sans-serif; }
        .font-display { font-family: 'Fraunces', serif !important; }
      `), /* @__PURE__ */ React.createElement("header", { className: "relative px-6 py-16 overflow-hidden", style: { backgroundColor: C.ink, backgroundImage: HERO_LATTICE, backgroundRepeat: "repeat" } }, /* @__PURE__ */ React.createElement(IconCamel, { className: "hidden sm:block absolute pointer-events-none", style: { top: "10px", left: "16px", width: "132px", height: "auto", color: C.brass, opacity: 0.45 } }), /* @__PURE__ */ React.createElement(IconPoodle, { className: "hidden sm:block absolute pointer-events-none", style: { bottom: "4px", left: "40px", width: "84px", height: "auto", color: C.brass, opacity: 0.45 } }), /* @__PURE__ */ React.createElement(IconGazelle, { className: "hidden sm:block absolute pointer-events-none", style: { bottom: "14px", right: "20px", width: "128px", height: "auto", color: C.brass, opacity: 0.45 } }), /* @__PURE__ */ React.createElement("div", { className: "hidden sm:flex absolute flex-col gap-2", style: { top: "22px", right: "28px" } }, /* @__PURE__ */ React.createElement(IconFlagUAE, { className: "rounded-sm", style: { width: "38px", height: "auto", opacity: 0.8 } }), /* @__PURE__ */ React.createElement(IconFlagItaly, { className: "rounded-sm", style: { width: "38px", height: "auto", opacity: 0.8 } })), /* @__PURE__ */ React.createElement("div", { className: "max-w-4xl mx-auto text-center flex flex-col items-center gap-3 relative" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-semibold uppercase tracking-widest", style: { color: C.brassSoft } }, "Lista nascita"), /* @__PURE__ */ React.createElement("h1", { className: "font-display text-4xl sm:text-5xl", style: { color: C.textOnInk } }, settings.babyName), /* @__PURE__ */ React.createElement("p", { className: "text-sm", style: { color: C.textOnInkMuted } }, "Arriva a ", settings.dueLabel), /* @__PURE__ */ React.createElement("p", { className: "text-base max-w-xl mt-2", style: { color: C.textOnInk } }, settings.welcomeMessage), /* @__PURE__ */ React.createElement("p", { className: "text-xs max-w-md mt-1", style: { color: C.textOnInkMuted } }, "Scegli un regalo qui sotto: puoi comprarlo tu stesso sul sito del negozio, oppure mandare una Gift Card via PayPal \u2014 ci pensiamo noi.")), /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "absolute bottom-0 left-0 right-0",
      style: { height: "26px", backgroundImage: ARCH_DIVIDER, backgroundRepeat: "repeat-x", backgroundSize: "48px 26px" }
    }
  )), /* @__PURE__ */ React.createElement("main", { className: "max-w-5xl mx-auto px-6 py-10 flex flex-col gap-8" }, error && /* @__PURE__ */ React.createElement("div", { className: "px-4 py-3 rounded-xl text-sm", style: { backgroundColor: "#F5DEDE", color: "#B24444" } }, error), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-2" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setActiveCategory("tutti"),
      className: "px-3.5 py-1.5 rounded-full text-xs font-semibold transition",
      style: activeCategory === "tutti" ? { backgroundColor: C.ink, color: C.textOnInk } : { backgroundColor: C.card, color: C.textMuted, border: `1px solid ${C.cardBorder}` }
    },
    "Tutti"
  ), CATEGORY_ORDER.map((c) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: c,
      onClick: () => setActiveCategory(c),
      className: "px-3.5 py-1.5 rounded-full text-xs font-semibold transition",
      style: activeCategory === c ? { backgroundColor: C.ink, color: C.textOnInk } : { backgroundColor: C.card, color: C.textMuted, border: `1px solid ${C.cardBorder}` }
    },
    CATEGORY_META[c].label
  ))), visibleItems.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "text-center py-16 px-6 rounded-2xl", style: { backgroundColor: C.card, border: `1px dashed ${C.cardBorder}` } }, /* @__PURE__ */ React.createElement(Gift, { className: "w-6 h-6 mx-auto mb-3", style: { color: C.brass } }), /* @__PURE__ */ React.createElement("p", { className: "text-sm", style: { color: C.textMuted } }, items.length === 0 ? "La lista \xE8 ancora vuota." : "Nessun regalo in questa categoria."), items.length === 0 && /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setGateOpen(true),
      className: "mt-4 text-sm font-semibold underline",
      style: { color: C.brass }
    },
    "Aggiungi il primo regalo"
  )) : /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2" }, visibleItems.map((item) => /* @__PURE__ */ React.createElement(
    GiftCard,
    {
      key: item.id,
      item,
      settings,
      isAdmin,
      onReserve: reserveItem,
      onContribute: contributeToItem,
      onUnreserve: unreserveItem,
      onToggleComplete: toggleComplete,
      onEdit: (it) => {
        setEditTarget(it);
        setAdminOpen(true);
      },
      onDelete: deleteItem
    }
  )))), /* @__PURE__ */ React.createElement("footer", { className: "px-6 py-10 text-center" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => isAdmin ? setAdminOpen(true) : setGateOpen(true),
      className: "inline-flex items-center gap-1.5 text-xs font-medium",
      style: { color: C.textMuted }
    },
    /* @__PURE__ */ React.createElement(Settings, { className: "w-3.5 h-3.5" }),
    " Gestisci lista"
  )), gateOpen && /* @__PURE__ */ React.createElement(
    AdminGate,
    {
      hasPasscode: !!settings.adminPasscode,
      onClose: () => setGateOpen(false),
      onSubmit: (val, setErr) => {
        handleGateSubmit(val, setErr);
      }
    }
  ), adminOpen && isAdmin && /* @__PURE__ */ React.createElement(
    AdminPanel,
    {
      settings,
      items,
      initialEditItem: editTarget,
      onClose: () => {
        setAdminOpen(false);
        setEditTarget(null);
      },
      onSaveSettings: (next) => {
        persistSettings(next);
        showToast("Impostazioni salvate");
      },
      onAddItem: addItem,
      onUpdateItem: (id, patch) => {
        updateItem(id, patch);
        showToast("Regalo aggiornato");
      },
      onDeleteItem: deleteItem
    }
  ), /* @__PURE__ */ React.createElement(Toast, { message: toast, onDone: () => setToast("") }));
}
export {
  BabyRegistry as default
};
