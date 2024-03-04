const { CartModel, cartSchemaJoi } = require("../models/CartModel");
const { ErrorMessage, SuccessMessage } = require("../utils/ResponseMessage");

const createCart = async (req, res) => {
  const { quantity, product, size, color } = req.body;

  // Validate input using Joi schema
  const { error } = cartSchemaJoi.validate({
    quantity,
    product,
    size,
    color,
    user: req.user._id,
  });

  if (error) {
    return ErrorMessage(res, 400, error.details[0].message);
  }

  try {
    // Check if the product already exists in the cart for the user
    let cartItem = await CartModel.findOne({
      product,
      user: req.user._id,
    });

    if (cartItem) {
      // If the product exists, update the quantity
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      // If the product doesn't exist, create a new cart item
      cartItem = await CartModel.create({
        quantity,
        product,
        user: req.user._id,
        size,
        color,
      });
    }

    return SuccessMessage(res, "Product added to cart successfully!");
  } catch (error) {
    console.error(error);
    return ErrorMessage(res, 500, "Internal Server Error");
  }
};

module.exports = { createCart };
