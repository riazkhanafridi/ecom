const { UserModel, userSchema } = require("../models/UserModel");
const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  let token = req.headers["token"];

  try {
    if (!token) return res.json({ message: "no token found" });

    const valid = jwt.verify(token, "my-new-secrete-key-riaz-khan");

    console.log("test", valid.email);

    // Assuming `valid` contains `userId` and `email`
    const user = await UserModel.findOne({ email: valid.email });

    console.log("useris", user);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports = protect;
