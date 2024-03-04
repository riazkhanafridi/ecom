const mongoose = require("mongoose");
const Joi = require("joi");

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: "user" },
    name: { type: String },
    salt: Buffer,
    resetPasswordToken: { type: String, default: "" },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("UserModel", UserSchema);

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string(),
  name: Joi.string(),
  salt: Joi.binary(),
  resetPasswordToken: Joi.string(),
});

module.exports = { UserModel, userSchema };
