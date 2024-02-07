const express = require("express");
const router = express.Router();

const {
    signupUser,
    loginUser,
    resetPassword,
} = require("../controllers/authController");
const { authenticateUser } = require("../services/authService");

router.post("/login", loginUser);
router.post("/signup", signupUser);
router.post("/reset-password", authenticateUser, resetPassword);

module.exports = router;
