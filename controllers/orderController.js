const { OrderModel, orderSchemaJoi } = require("../models/OrderModel");
const { ErrorMessage, SuccessMessage } = require("../utils/ResponseMessage");
const { isValidObjectId } = require("mongoose");
const { ProductModel } = require("../models/ProductModel");
const { UserModel } = require("../models/UserModel");
const { sendMail, invoiceTemplate } = require("../services/common");

const fetchOrdersByUser = async (req, res) => {
  const { id } = req.user;
  if (!isValidObjectId(id)) return ErrorMessage(res, 400, "Invalid id");

  try {
    const orders = await OrderModel.find({ user: id });

    return SuccessMessage(res, "user order retrieve Successfully!", orders);
  } catch (err) {
    console.error("Error get user orders :", err);
    res.status(500).json({ error: "failed to orders " });
  }
};

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
const updateOrder = async (req, res) => {
  const { id, updateData } = req.body;
  if (!isValidObjectId(id)) return ErrorMessage(res, 400, "Invalid id");
  if (!updateData) return ErrorMessage(res, 400, "Invalid Update Data");
  try {
    const data = await OrderModel.findByIdAndUpdate(id, {
      ...updateData,
    });
    return SuccessMessage(res, "Updated Successfully!");
  } catch (error) {
    console.error("Error updating :", error);
    res.status(500).json({ error: "failed to update " });
  }
};
const deleteOrder = async (req, res) => {
  try {
    const order = await OrderModel.findByIdAndDelete(req.params.id);
    if (!order) {
      res.status(400).json({ error: "order not found" });
    }
    return SuccessMessage(res, "deleted Successfully!");
  } catch (error) {
    console.error("error deleting order", error);

    res.status(500).json({ error: "failed to delete order" });
  }
};
const fetchAllOrders = async (req, res) => {
  // sort = {_sort:"price",_order="desc"}
  // pagination = {_page:1,_limit=10}
  let query = OrderModel.find({ deleted: { $ne: true } });
  let totalOrdersQuery = OrderModel.find({ deleted: { $ne: true } });

  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  const totalDocs = await totalOrdersQuery.count().exec();
  console.log({ totalDocs });

  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const docs = await query.exec();
    res.set("X-Total-Count", totalDocs);
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports = {
  createOrder,
  updateOrder,
  deleteOrder,
  fetchOrdersByUser,
  fetchAllOrders,
};
