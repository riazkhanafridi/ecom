const bcrypt = require("bcrypt");
const { UserModel, userSchema } = require("../models/UserModel");
const { ErrorMessage, SuccessMessage } = require("../utils/ResponseMessage");
const jwt = require("jsonwebtoken");
const { isValidObjectId } = require("mongoose");
const { default: mongoose } = require("mongoose");

const getUser = async (req, res) => {
  try {
    // Retrieve the user ID from the request parameters or JWT token, depending on your authentication setup
    const id = req.params.id;
    const user = await UserModel.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });

    // Check if the user exists
    if (!user) {
      return ErrorMessage(res, 404, "User not found.");
    }

    // Return the user information
    return SuccessMessage(res, "User details retrieved successfully!", user);
  } catch (error) {
    return ErrorMessage(
      res,
      500,
      "An error occurred while retrieving user details."
    );
  }
};

const userCreate = async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);
  const validationResult = userSchema.validate({
    name,
    email,
    password: hashPassword,
    role,
  });

  if (validationResult.error) {
    return ErrorMessage(res, 400, validationResult.error.details[0].message);
  }

  try {
    const user = new UserModel({
      name,
      email,
      password: hashPassword,
      role,
    });

    const savedUser = await user.save();
    return SuccessMessage(res, "User created successfully!");
  } catch (error) {
    return ErrorMessage(res, 500, "An error occurred while creating the user.");
  }
};
//update user

const UpdateUser = async (req, res) => {
  const { id, updateData } = req.body;
  if (!isValidObjectId(id)) return ErrorMessage(res, 400, "Invalid id");
  if (!updateData) return ErrorMessage(res, 400, "Invalid Update Data");
  try {
    const data = await UserModel.findByIdAndUpdate(id, {
      ...updateData,
    });
    return SuccessMessage(res, "Updated Successfully!");
  } catch (error) {
    console.error("Error updating :", error);
    res.status(500).json({ error: "failed to update " });
  }
};
const deleteUser = async (req, res) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(400).json({ error: "user not found" });
    }
    return SuccessMessage(res, "deleted Successfully!");
  } catch (error) {
    console.error("error deleting user", error);

    res.status(500).json({ error: "failed to delete user" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await UserModel.findOne({ email });

    if (!user) {
      return ErrorMessage(res, 404, "User not found.");
    }

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return ErrorMessage(res, 401, "Invalid password.");
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      "my-new-secrete-key-riaz-khan",
      {
        expiresIn: "1h",
      }
    );

    // Send the token in the response
    return SuccessMessage(res, "Login successful!", { token, user });
  } catch (error) {
    return ErrorMessage(res, 500, "An error occurred while logging in.");
  }
};

module.exports = {
  userCreate,
  login,
  getUser,
  UpdateUser,
  deleteUser,
};
