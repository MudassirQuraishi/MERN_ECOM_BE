const express = require("express");
const router = express.Router();

const { fetchUserDetails } = require("../controllers/apiController");
const { authenticateUser } = require("../services/authService");
router.get("/get-user/:token", authenticateUser, fetchUserDetails);

module.exports = router;
