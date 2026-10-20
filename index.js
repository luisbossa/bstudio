require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const viewHelpers = require("./utils/viewHelpers");

const app = express();

// Behind Vercel's proxy: needed for req.ip (login rate limit) and secure cookies.
app.set("trust proxy", 1);

// Middlewares
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.locals.icon = require("./utils/icons");
Object.assign(app.locals, viewHelpers);

// Routes
app.use(require("./routes"));

// Errors
app.use((err, req, res, next) => {
  const status = err.status || (err.code === "LIMIT_FILE_SIZE" ? 413 : 500);
  if (status >= 500) console.error(err);
  const message = status >= 500 ? "Something went wrong" : err.message;
  if (req.path.startsWith("/api/")) return res.status(status).json({ error: message });
  return res.status(status).send(message);
});

const port = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

module.exports = app;
