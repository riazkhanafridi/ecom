const { CartModel, cartSchemaJoi } = require("../models/CartModel");
const { ErrorMessage, SuccessMessage } = require("../utils/ResponseMessage");
const { isValidObjectId } = require("mongoose");

// const createCart = async (req, res) => {
//   const { quantity, product, size, color } = req.body;

//   // Validate input using Joi schema
//   const { error } = cartSchemaJoi.validate({
//     quantity,
//     product,
//     size,
//     color,
//     user: req.user._id,
//   });

//   if (error) {
//     return ErrorMessage(res, 400, error.details[0].message);
//   }

//   try {
//     // Check if the product already exists in the cart for the user
//     let cartItem = await CartModel.findOne({
//       product,
//       user: req.user._id,
//     });

//     if (cartItem) {
//       // If the product exists, update the quantity
//       cartItem.quantity += quantity;
//       await cartItem.save();
//     } else {
//       // If the product doesn't exist, create a new cart item
//       cartItem = await CartModel.create({
//         quantity,
//         product,
//         user: req.user._id,
//         size,
//         color,
//       });
//     }

//     return SuccessMessage(res, "Product added to cart successfully!");
//   } catch (error) {
//     console.error(error);
//     return ErrorMessage(res, 500, "Internal Server Error");
//   }
// };

const fetchCartByUser = async (req, res) => {
  const { id } = req.user;
  if (!isValidObjectId(id)) return ErrorMessage(res, 400, "Invalid id");
  try {
    const cartItems = await CartModel.find({ user: id }).populate("product");
    return SuccessMessage(
      res,
      "user cartItems retrieve Successfully!",
      cartItems
    );
  } catch (err) {
    console.error("Error get user cartItems :", err);
    res.status(500).json({ error: "failed to cartItems " });
  }
};
const addToCart = async (req, res) => {
  const { id } = req.user;
  if (!isValidObjectId(id)) return ErrorMessage(res, 400, "Invalid id");
  const cart = new CartModel({ ...req.body, user: id });
  try {
    const doc = await cart.save();
    const result = await doc.populate("product");
    return SuccessMessage(res, "Add to cart Successfully!");
  } catch (error) {
    console.error("Error  add to cart:", error);
    res.status(500).json({ error: "failed to add to cart " });
  }
};

const updateCart = async (req, res) => {
  const { id, updateData } = req.body;
  if (!isValidObjectId(id)) return ErrorMessage(res, 400, "Invalid id");
  if (!updateData) return ErrorMessage(res, 400, "Invalid Update Data");
  try {
    const data = await CartModel.findByIdAndUpdate(id, {
      ...updateData,
    });
    return SuccessMessage(res, "Updated Successfully!");
  } catch (error) {
    console.error("Error updating :", error);
    res.status(500).json({ error: "failed to update " });
  }
};
const deleteFromCart = async (req, res) => {
  try {
    const cart = await CartModel.findByIdAndDelete(req.params.id);
    if (!cart) {
      res.status(400).json({ error: "cart not found" });
    }
    return SuccessMessage(res, "deleted Successfully!");
  } catch (error) {
    console.error("error deleting cart", error);

    res.status(500).json({ error: "failed to delete cart" });
  }
};

module.exports = {
  //createCart,
  addToCart,
  fetchCartByUser,
  deleteFromCart,
  updateCart,
};
