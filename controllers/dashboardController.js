const auth = require("../middlewares/auth");
const { getContent, saveContent, resetContent } = require("../services/contentStore");
const { saveFile, streamFile } = require("../services/mediaStore");
const { isMongoEnabled } = require("../services/db");
const sanitizeContent = require("../utils/sanitizeContent");
const defaults = require("../data/default-content");

const storageLabel = () => (isMongoEnabled() ? "MongoDB" : "data/content.json");

/*----------------- PAGES ----------------*/

exports.loginPage = (req, res) => {
  if (auth.isAuthenticated(req)) return res.redirect("/dashboard");
  res.render("pages/login", { error: null, configured: auth.isConfigured() });
};

exports.login = (req, res) => {
  const ip = req.ip;
  const render = (status, error) =>
    res.status(status).render("pages/login", { error, configured: auth.isConfigured() });

  if (!auth.isConfigured()) return render(503, null);
  if (auth.isRateLimited(ip)) return render(429, "Too many attempts. Try again in 15 minutes.");

  if (!auth.checkPassword(req.body.password || "")) {
    auth.recordFailure(ip);
    return render(401, "Wrong password.");
  }

  auth.clearFailures(ip);
  auth.startSession(req, res);
  return res.redirect("/dashboard");
};

exports.logout = (req, res) => {
  auth.endSession(req, res);
  res.redirect("/dashboard/login");
};

exports.dashboard = (req, res) => {
  res.render("pages/dashboard", { storage: storageLabel() });
};

// Renders the home page with unsaved content, for the live preview iframe.
exports.preview = (req, res) => {
  const content = sanitizeContent(req.body);
  res.render("pages/home", { ...content, preview: true });
};

/*----------------- API ----------------*/

exports.getContent = async (req, res, next) => {
  try {
    res.json({ content: await getContent(), defaults, storage: storageLabel() });
  } catch (error) {
    next(error);
  }
};

exports.saveContent = async (req, res, next) => {
  try {
    const content = sanitizeContent(req.body);
    await saveContent(content);
    res.json({ ok: true, content });
  } catch (error) {
    next(error);
  }
};

exports.resetContent = async (req, res, next) => {
  try {
    await resetContent();
    res.json({ ok: true, content: await getContent() });
  } catch (error) {
    next(error);
  }
};

exports.upload = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file received" });
    const url = await saveFile(req.file);
    res.json({ url });
  } catch (error) {
    next(error);
  }
};

exports.media = async (req, res, next) => {
  try {
    if (!isMongoEnabled()) return res.sendStatus(404);
    await streamFile(req.params.id, req, res);
  } catch (error) {
    next(error);
  }
};
