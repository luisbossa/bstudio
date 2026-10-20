const defaults = require("../data/default-content");

// Cleans content sent by the dashboard using the default content as the schema:
// unknown keys are dropped, types are coerced and sizes are capped.

const MAX_STRING = 5000;
const MAX_ITEMS = 60;
const HEX_COLOR = /^#[0-9a-f]{6}$/i;

const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

// `blank` is set inside list items: a missing field there becomes empty instead
// of copying the first default item's value.
const cleanValue = (schema, value, blank = false) => {
  if (typeof schema === "string") {
    if (typeof value === "string" || typeof value === "number") {
      return String(value).slice(0, MAX_STRING);
    }
    return blank ? "" : schema;
  }

  if (typeof schema === "boolean") {
    return Boolean(value);
  }

  if (Array.isArray(schema)) {
    if (!Array.isArray(value)) return blank ? [] : schema;
    // Every item follows the shape of the first default item.
    const itemSchema = schema[0] ?? "";
    return value.slice(0, MAX_ITEMS).map((item) => cleanValue(itemSchema, item, true));
  }

  if (isPlainObject(schema)) {
    const source = isPlainObject(value) ? value : {};
    const result = {};
    for (const key of Object.keys(schema)) {
      result[key] = cleanValue(schema[key], source[key], blank);
    }
    return result;
  }

  return schema;
};

const sanitizeContent = (input) => {
  const content = cleanValue(defaults, input);

  for (const [key, color] of Object.entries(content.theme)) {
    if (!HEX_COLOR.test(color)) content.theme[key] = defaults.theme[key];
  }

  return content;
};

module.exports = sanitizeContent;
