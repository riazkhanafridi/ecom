const { OrderModel, orderSchemaJoi } = require("../models/OrderModel");
const { ErrorMessage, SuccessMessage } = require("../utils/ResponseMessage");
const { ProductModel } = require("../models/ProductModel");
const { UserModel } = require("../models/UserModel");
const { sendMail, invoiceTemplate } = require("../services/common");

const createOrder = async (req, res) => {
  // console.log("here");
  // console.log(req.user);
  const { items, totalAmount, totalItems, paymentMethod, selectedAddress } =
    req.body;

  // Validate input using Joi schema
  const { error } = orderSchemaJoi.validate({
    items,
    totalAmount,
    totalItems,
    paymentMethod,
    selectedAddress,
    user: req.user,
  });

  if (error) {
    return ErrorMessage(res, 400, error.details[0].message);
  }

  try {
    const order = new OrderModel({
      items,
      totalAmount,
      totalItems,
      paymentMethod,
      selectedAddress,
      user: req.user._id,
    });

    // Update stock for each item in the order
    for (let item of order.items) {
      try {
        let product = await ProductModel.findOne({ _id: item.product._id });
        product.stock -= item.quantity;

        await product.save();
      } catch (err) {
        console.error(err);
        return ErrorMessage(res, 500, "Failed to update stock.");
      }
    }

    await order.save(); // Save the order

    const user = await UserModel.findById(req.user._id);
    await sendMail({
      to: user.email,
      html: invoiceTemplate(order),
      subject: "Order Received",
    });

    return SuccessMessage(res, "Order created successfully!");
  } catch (err) {
    console.error(err);
    return ErrorMessage(res, 400, "Failed to create order.");
  }
};

module.exports = {
  createOrder,
};
