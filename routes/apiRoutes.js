const express = require("express");
const router = express.Router();

const {
    fetchUserDetails,
    fetchProducts,
    fetchProduct,
    addToCart,
    fetchCart,
} = require("../controllers/apiController");
const { authenticateUser } = require("../services/authService");
router.get("/user/get-cart", authenticateUser, fetchCart);
router.get("/get-user/:token", authenticateUser, fetchUserDetails);
router.get("/:category", fetchProducts);
router.get("/product/:prodId", fetchProduct);
router.post("/add-to-cart", authenticateUser, addToCart);

module.exports = router;
