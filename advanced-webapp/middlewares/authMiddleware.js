const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).send("로그인 필요");
  }
};

exports.authorizeRole = (role) => {
  return (req, res, next) => {
    if (req.session.user && req.session.user.role === role) {
      next();
    } else {
      res.status(403).send("접근 권한이 없습니다.");
    }
  };
};

exports.verifyJWT = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send("토큰이 없습니다.");
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send("토큰이 유효하지 않습니다.");
    }
    req.user = decoded;
    next();
  });
};
