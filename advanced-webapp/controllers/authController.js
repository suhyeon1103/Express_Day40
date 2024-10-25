const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send("이미 존재하는 사용자입니다.");
    }
    const user = new User({ username, password });
    await user.save();
    res.status(201).send("사용자가 등록되었습니다.");
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).send("인증 실패");
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).send("인증 실패");
    }
    // 세션에 사용자 정보 저장
    req.session.user = {
      id: user._id,
      username: user.username,
      role: user.role,
    };
    // JWT 토큰 생성
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("token", token, { httpOnly: true, secure: false }); // HTTPS 사용 시 secure: true
    res.send("로그인 성공");
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("로그아웃 중 오류가 발생했습니다.");
    }
    res.clearCookie("connect.sid");
    res.clearCookie("token");
    res.send("로그아웃 되었습니다.");
  });
};
