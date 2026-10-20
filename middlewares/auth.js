const crypto = require("crypto");

// Password login for the dashboard. The session is a signed, HttpOnly cookie:
// "<expiry>.<hmac>", so no session store is needed (works on serverless).

const COOKIE = "bs_admin";
const SESSION_MS = 1000 * 60 * 60 * 8; // 8 hours

const getSecret = () =>
  process.env.SESSION_SECRET ||
  crypto.createHash("sha256").update(`bstudio:${process.env.ADMIN_PASSWORD || ""}`).digest("hex");

const sign = (value) => crypto.createHmac("sha256", getSecret()).update(value).digest("hex");

const safeEqual = (a, b) => {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
};

const readCookie = (req, name) => {
  const header = req.headers.cookie || "";
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return null;
};

const isConfigured = () => Boolean(process.env.ADMIN_PASSWORD);

const isAuthenticated = (req) => {
  if (!isConfigured()) return false;
  const token = readCookie(req, COOKIE);
  if (!token) return false;
  const [expires, signature] = token.split(".");
  return Number(expires) > Date.now() && safeEqual(signature, sign(expires));
};

const cookieOptions = (req) => ({
  httpOnly: true,
  sameSite: "strict",
  secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  path: "/",
});

const startSession = (req, res) => {
  const expires = String(Date.now() + SESSION_MS);
  res.cookie(COOKIE, `${expires}.${sign(expires)}`, { ...cookieOptions(req), maxAge: SESSION_MS });
};

const endSession = (req, res) => {
  res.clearCookie(COOKIE, cookieOptions(req));
};

const checkPassword = (password) => isConfigured() && safeEqual(password, process.env.ADMIN_PASSWORD);

// Simple in-memory limit: 5 failed attempts per IP every 15 minutes.
const attempts = new Map();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const isRateLimited = (ip) => {
  const entry = attempts.get(ip);
  if (!entry || entry.resetAt < Date.now()) return false;
  return entry.count >= MAX_ATTEMPTS;
};

const recordFailure = (ip) => {
  const entry = attempts.get(ip);
  if (!entry || entry.resetAt < Date.now()) {
    attempts.set(ip, { count: 1, resetAt: Date.now() + WINDOW_MS });
  } else {
    entry.count += 1;
  }
};

const clearFailures = (ip) => attempts.delete(ip);

// Middlewares
const requireAuthPage = (req, res, next) =>
  isAuthenticated(req) ? next() : res.redirect("/dashboard/login");

const requireAuthApi = (req, res, next) =>
  isAuthenticated(req) ? next() : res.status(401).json({ error: "Not authenticated" });

module.exports = {
  isConfigured,
  isAuthenticated,
  startSession,
  endSession,
  checkPassword,
  isRateLimited,
  recordFailure,
  clearFailures,
  requireAuthPage,
  requireAuthApi,
};
