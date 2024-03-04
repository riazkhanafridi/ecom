const { UserModel, userSchema } = require("../models/UserModel");

const restrict = (roles) => {
  return async (req, res, next) => {
    //console.log("roles", roles);
    const findUserRole = await UserModel.findOne({ role: req.user?.role });

    if (!roles.includes(findUserRole?.role)) {
      return res.status(403).json({ status: "fail", message: "Forbidden" });
    }

    next();
  };
};

module.exports = restrict;
