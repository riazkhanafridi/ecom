const {
  createCart,
  addToCart,
  fetchCartByUser,
  deleteFromCart,
  updateCart,
} = require("../controllers/cartController");
const protect = require("../middlewares/authMiddleware");
const express = require("express");
const router = express.Router();

// Create a cart
router.get("/", protect, fetchCartByUser);

router.post("/cart", protect, createCart);
router.post("/", protect, addToCart);
router.delete("/:id", protect, deleteFromCart);
router.patch("/", protect, updateCart);

module.exports = router;
