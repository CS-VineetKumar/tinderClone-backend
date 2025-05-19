const adminAuth = (req, res, next) => {
  console.log("Admin Auth Middleware");
  const token = "auth";
  const isAuthenticated = token === "auth";

  if (isAuthenticated) {
    next();
  } else {
    res.status(401).send("Unauthorized Request");
  }
};

const userAuth = (req, res, next) => {
  console.log("User Auth Middleware");
  const token = "auth";
  const isAuthenticated = token === "auth";

  if (isAuthenticated) {
    next();
  } else {
    res.status(401).send("Unauthorized Request");
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
