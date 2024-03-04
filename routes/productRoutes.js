const {
  createProduct,
  fetchProductById,

  updateProduct,
  fetchAllProducts,
} = require("../controllers/productController");
const protect = require("../middlewares/authMiddleware");
const restrict = require("../middlewares/roleMiddleware");
const express = require("express");

const router = express.Router();

router.post("/products", protect, restrict("admin"), createProduct);
router.get("/products/:id", fetchProductById);
//router.get("/products", getProducts);
router.get("/products", protect, fetchAllProducts);
router.patch("/products", updateProduct);

// Other routes...

module.exports = router;
