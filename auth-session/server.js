const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

// 미들웨어 설정
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: "mySecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true }, // HTTPS 사용 시 secure: true
  })
);

// 정적 파일 서빙
app.use(express.static(path.join(__dirname, "views")));

// 로그인 페이지
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

// 로그인 처리
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // 간단한 인증 로직 (실제 애플리케이션에서는 데이터베이스 조회 필요)
  if (username === "tngus7450" && password === "password123") {
    req.session.user = { username, role: "admin" };
    res.redirect("/dashboard");
  } else {
    res.status(401).send("인증 실패");
  }
});

// 대시보드 페이지
app.get("/dashboard", (req, res) => {
  if (req.session.user) {
    res.sendFile(path.join(__dirname, "views", "dashboard.html"));
  } else {
    res.redirect("/login");
  }
});

// 사용자 정보 API
app.get("/api/user", (req, res) => {
  if (req.session.user) {
    res.json({ username: req.session.user.username });
  } else {
    res.status(401).json({ message: "로그인 필요" });
  }
});

// 로그아웃 처리
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("로그아웃 중 오류가 발생했습니다.");
    }
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
});

app.listen(3000, () => {
  console.log("서버가 3000번 포트에서 실행 중입니다.");
});
