const { createCart } = require("../controllers/cartController");
const protect = require("../middlewares/authMiddleware");
const express = require("express");
const router = express.Router();

// Create a cart
router.post("/cart", protect, createCart);

module.exports = router;
