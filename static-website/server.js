const express = require("express");
const app = express();

// 정적 파일 서빙 설정
app.use(express.static("public"));

app.listen(3000, () => {
  console.log("서버가 3000번 포트에서 실행 중입니다.");
});
