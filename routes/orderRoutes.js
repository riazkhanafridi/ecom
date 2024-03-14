const express = require("express");
const router = express.Router();
const {
  createOrder,
  updateOrder,
  deleteOrder,
  fetchOrdersByUser,
  fetchAllOrders,
} = require("../controllers/orderController");
const protect = require("../middlewares/authMiddleware");

router.get("/orders/:id", protect, fetchOrdersByUser);
router.get("/orders", protect, fetchAllOrders);
router.post("/orders", protect, createOrder);
router.patch("/orders", protect, updateOrder);
router.delete("/orders/:id", protect, deleteOrder);

module.exports = router;
