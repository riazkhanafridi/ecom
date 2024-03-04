const {
  userCreate,
  login,
  getUser,
  UpdateUser,
  deleteUser,
} = require("../controllers/userController");
const protect = require("../middlewares/authMiddleware");
const express = require("express");

const route = express.Router();
route.post("/signup", userCreate);
route.post("/login", login);
route.get("/user/:id", protect, getUser);
route.patch("/user", UpdateUser);
route.delete("/user/:id", protect, deleteUser);

module.exports = route;
