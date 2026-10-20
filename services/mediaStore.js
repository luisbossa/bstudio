const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const { GridFSBucket, ObjectId } = require("mongodb");
const { getDb, isMongoEnabled } = require("./db");

// Uploaded files go to public/uploads locally, or to MongoDB GridFS when
// MONGODB_URI is set (Vercel's filesystem is read-only).

const UPLOAD_DIR = path.join(__dirname, "..", "public", "uploads");
const BUCKET = "media";

const ALLOWED_TYPES = {
  "image/webp": ".webp",
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/gif": ".gif",
  "image/avif": ".avif",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "application/pdf": ".pdf",
};

const isAllowedType = (mimetype) => Object.hasOwn(ALLOWED_TYPES, mimetype);

const getBucket = async () => new GridFSBucket(await getDb(), { bucketName: BUCKET });

// Returns the public URL of the stored file.
const saveFile = async ({ buffer, mimetype, originalname }) => {
  const ext = ALLOWED_TYPES[mimetype];
  const base = path
    .basename(originalname, path.extname(originalname))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40) || "file";
  const filename = `${base}-${crypto.randomBytes(4).toString("hex")}${ext}`;

  if (isMongoEnabled()) {
    const bucket = await getBucket();
    const upload = bucket.openUploadStream(filename, { metadata: { contentType: mimetype } });
    await new Promise((resolve, reject) => {
      upload.on("finish", resolve).on("error", reject);
      upload.end(buffer);
    });
    return `/media/${upload.id}`;
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);
  return `/uploads/${filename}`;
};

// Streams a GridFS file, with Range support so videos can seek (and play in Safari).
const streamFile = async (id, req, res) => {
  if (!ObjectId.isValid(id)) return res.sendStatus(404);

  const bucket = await getBucket();
  const [file] = await bucket.find({ _id: new ObjectId(id) }).toArray();
  if (!file) return res.sendStatus(404);

  const type = file.metadata?.contentType || "application/octet-stream";
  const size = file.length;
  res.set({
    "Content-Type": type,
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=31536000, immutable",
    "X-Content-Type-Options": "nosniff",
  });

  const range = /bytes=(\d*)-(\d*)/.exec(req.headers.range || "");
  if (range) {
    const start = range[1] ? Number(range[1]) : 0;
    const end = range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
    if (start > end || start >= size) {
      return res.status(416).set("Content-Range", `bytes */${size}`).end();
    }
    res.status(206).set({
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Content-Length": end - start + 1,
    });
    return bucket.openDownloadStream(file._id, { start, end: end + 1 }).pipe(res);
  }

  res.set("Content-Length", size);
  return bucket.openDownloadStream(file._id).pipe(res);
};

module.exports = { saveFile, streamFile, isAllowedType, ALLOWED_TYPES };
