const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authorizeRole } = require("../middlewares/authMiddleware");

// 모든 사용자 조회 (관리자 전용)
router.get("/", authorizeRole("admin"), userController.getUsers);

// 특정 사용자 조회 (자신의 정보만 접근 가능)
router.get("/:id", userController.getUserById);

module.exports = router;
