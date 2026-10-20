const fs = require("fs/promises");
const path = require("path");
const defaults = require("../data/default-content");
const { getDb, isMongoEnabled } = require("./db");

// Saved content lives in MongoDB when MONGODB_URI is set, otherwise in a local
// JSON file. Either way it is merged over the defaults on read.

const CONTENT_FILE = path.join(__dirname, "..", "data", "content.json");
const COLLECTION = "content";
const DOC_ID = "site";

const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

// Objects merge key by key; arrays and scalars from the saved copy win.
const mergeDefaults = (base, saved) => {
  if (!isPlainObject(base) || !isPlainObject(saved)) {
    return saved === undefined ? base : saved;
  }
  const result = { ...base };
  for (const key of Object.keys(saved)) {
    result[key] = mergeDefaults(base[key], saved[key]);
  }
  return result;
};

const readSaved = async () => {
  if (isMongoEnabled()) {
    const db = await getDb();
    const doc = await db.collection(COLLECTION).findOne({ _id: DOC_ID });
    return doc ? doc.data : null;
  }

  try {
    return JSON.parse(await fs.readFile(CONTENT_FILE, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
};

const getContent = async () => {
  const saved = await readSaved();
  return saved ? mergeDefaults(defaults, saved) : structuredClone(defaults);
};

const saveContent = async (content) => {
  if (isMongoEnabled()) {
    const db = await getDb();
    await db
      .collection(COLLECTION)
      .updateOne(
        { _id: DOC_ID },
        { $set: { data: content, updatedAt: new Date() } },
        { upsert: true }
      );
    return;
  }

  // Write to a temp file first so a crash never leaves a half-written file.
  const tmp = `${CONTENT_FILE}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(content, null, 2), "utf8");
  await fs.rename(tmp, CONTENT_FILE);
};

const resetContent = async () => {
  if (isMongoEnabled()) {
    const db = await getDb();
    await db.collection(COLLECTION).deleteOne({ _id: DOC_ID });
    return;
  }
  await fs.rm(CONTENT_FILE, { force: true });
};

module.exports = { getContent, saveContent, resetContent, mergeDefaults };
