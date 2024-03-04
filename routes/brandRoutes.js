const express = require("express");
const router = express.Router();
const { createBrand, getBrand } = require("../controllers/brandController");

router.post("/brand", createBrand);
router.get("/brand", getBrand);

// Other routes...

module.exports = router;
