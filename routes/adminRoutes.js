const express = require("express");
const router = express.Router();
const { addProduct } = require("../controllers/adminController");

router.post("/add-product", addProduct);

module.exports = router;
