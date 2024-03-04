const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategory,
} = require("../controllers/categoryController");

router.post("/category", createCategory);
router.get("/category", getCategory);

// Other routes...

module.exports = router;
