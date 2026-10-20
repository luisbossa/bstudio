const { getContent } = require("../services/contentStore");
const { isAuthenticated } = require("../middlewares/auth");

// Shared by the form controller so the page renders with the same data.
const renderHome = async (req, res, locals = {}, status = 200) => {
  const content = await getContent();
  return res
    .status(status)
    .render("pages/home", { ...content, isAdmin: isAuthenticated(req), ...locals });
};

exports.renderHome = renderHome;

exports.home = async (req, res, next) => {
  try {
    await renderHome(req, res);
  } catch (error) {
    next(error);
  }
};
