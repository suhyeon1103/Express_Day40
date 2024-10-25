const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// 사용자 등록
router.post("/register", authController.register);

// 사용자 로그인
router.post("/login", authController.login);

// 사용자 로그아웃
router.get("/logout", authController.logout);

module.exports = router;
