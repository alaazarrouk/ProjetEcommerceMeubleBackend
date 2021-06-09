const verifyJWT = (req, res, next) => {
  const jwt = require("jsonwebtoken");
  const token = req.headers["x-access-token"];
  if (!token) {
    console.log("no token found");
    res.send("No token was found");
  } else {
    jwt.verify(
      token,
      "jwtSecret",
      process.env.ACCESS_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          res.json({ auth: false, message: "U failed to authenticate" });
        } else {
          req.userId = decoded;
          next();
        }
      }
    );
  }
};
module.exports = { verifyJWT };
