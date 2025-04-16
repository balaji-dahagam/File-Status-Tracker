var jwt = require("jsonwebtoken");
const JWT_SECRET = "trackingapplication";

const fetchUser = (req, res, next) => {
  const token = req.cookies.authToken;
  if (!token) {
    res.status(401).send({ error: "please use a valid token" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data;
    next();
  } catch (error) {
    res.status(401).send({ error: "please use a valid token" });
  }
};
module.exports = fetchUser;
