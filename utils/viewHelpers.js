// Helpers available in every view (registered on app.locals in index.js).

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// Escapes the text, then turns *words* into <tag class="...">words</tag>.
const rich = (text, tag = "em", className = "accent") =>
  escapeHtml(text).replace(/\*([^*]+)\*/g, `<${tag} class="${className}">$1</${tag}>`);

// Only allows links that cannot run script: http(s), mailto, tel, anchors and site paths.
const safeUrl = (url, fallback = "#") => {
  const value = String(url || "").trim();
  if (/^(https?:|mailto:|tel:)/i.test(value)) return value;
  if (/^(#|\/(?!\/))/.test(value)) return value;
  return fallback;
};

// The project recordings include their own browser mockup. These crops (in video
// pixels) keep only the website, at the same 16:10 ratio as the page frame.
const VIDEO_CROPS = {
  "mockup-500": { x: 14, y: 64, width: 458, height: 286, sourceWidth: 500, sourceHeight: 500 },
  "mockup-1080": { x: 30, y: 128, width: 994, height: 621, sourceWidth: 1080, sourceHeight: 1080 },
};

const cropStyle = (preset) => {
  const crop = VIDEO_CROPS[preset];
  if (!crop) return "";
  const pct = (value) => `${(value * 100).toFixed(2)}%`;
  return [
    `width:${pct(crop.sourceWidth / crop.width)}`,
    `height:${pct(crop.sourceHeight / crop.height)}`,
    `left:${pct(-crop.x / crop.width)}`,
    `top:${pct(-crop.y / crop.height)}`,
  ].join(";");
};

// Theme colours as CSS custom properties (values are validated on save).
const themeCss = (theme = {}) => {
  const map = {
    orange: "--clr-orange",
    cream: "--clr-cream",
    blue: "--clr-blue",
    mate: "--clr-mate",
    light: "--clr-light",
  };
  const rules = Object.entries(map)
    .filter(([key]) => /^#[0-9a-f]{6}$/i.test(theme[key] || ""))
    .map(([key, prop]) => `${prop}:${theme[key]}`);
  return rules.length ? `:root{${rules.join(";")}}` : "";
};

const pad = (n) => String(n).padStart(2, "0");

module.exports = { rich, safeUrl, cropStyle, themeCss, pad, VIDEO_CROPS };
