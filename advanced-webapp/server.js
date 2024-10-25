require("dotenv").config();
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const winston = require("winston");
const path = require("path");

// 라우터 임포트
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");

// 에러 핸들러 임포트
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// 데이터베이스 연결
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB에 성공적으로 연결되었습니다.");
  })
  .catch((err) => {
    console.error("MongoDB 연결 오류:", err);
  });

// 미들웨어 설정
app.use(helmet()); // 보안 헤더 설정
app.use(
  cors({
    origin: "http://localhost:3000", // 허용할 도메인 설정
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true }, // HTTPS 사용 시 secure: true
  })
);
app.use(morgan("combined")); // HTTP 요청 로깅

// 정적 파일 서빙
app.use(express.static(path.join(__dirname, "public")));

// 라우터 설정
app.use("/auth", authRouter);
app.use("/users", usersRouter);

// 에러 핸들러 설정
app.use(errorHandler);

// 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});
