const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  console.log("Token from cookies:", token); // Logging token for debugging

  if (!token) {
    return res.status(401).json('You are not authenticated');
  }

  jwt.verify(token, process.env.SECRET, (err, data) => {
    if (err) {
      console.log("Token verification error:", err); // Logging error for debugging
      return res.status(403).json("Token is invalid");
    }
    req.userId = data._id;
    next();
  });
};

module.exports = verifyToken;
