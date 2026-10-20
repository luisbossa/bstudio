const express = require("express");
const multer = require("multer");
const homeController = require("../controllers/homeController");
const formController = require("../controllers/formController");
const dashboard = require("../controllers/dashboardController");
const { requireAuthPage, requireAuthApi } = require("../middlewares/auth");
const { isAllowedType } = require("../services/mediaStore");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (isAllowedType(file.mimetype)) return cb(null, true);
    const error = new Error("File type not allowed");
    error.status = 400;
    return cb(error);
  },
});

// Public site
router.get("/", homeController.home);
router.post("/", formController.send);
router.get("/media/:id", dashboard.media);

// Dashboard pages
router.get("/dashboard/login", dashboard.loginPage);
router.post("/dashboard/login", dashboard.login);
router.post("/dashboard/logout", dashboard.logout);
router.get("/dashboard", requireAuthPage, dashboard.dashboard);
router.post("/dashboard/preview", requireAuthPage, dashboard.preview);

// Dashboard API
router.get("/api/content", requireAuthApi, dashboard.getContent);
router.put("/api/content", requireAuthApi, dashboard.saveContent);
router.delete("/api/content", requireAuthApi, dashboard.resetContent);
router.post("/api/upload", requireAuthApi, upload.single("file"), dashboard.upload);

module.exports = router;
