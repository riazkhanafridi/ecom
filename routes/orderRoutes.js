const express = require("express");
const router = express.Router();
const { createOrder } = require("../controllers/orderController");
const protect = require("../middlewares/authMiddleware");

router.post("/orders", protect, createOrder);

module.exports = router;
