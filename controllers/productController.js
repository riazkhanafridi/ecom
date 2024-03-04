const { ProductModel, productSchemaJoi } = require("../models/ProductModel");
const { ErrorMessage, SuccessMessage } = require("../utils/ResponseMessage");
const { isValidObjectId } = require("mongoose");

const getProducts = async (req, res) => {
  try {
    const product = await ProductModel.find();
    return SuccessMessage(
      res,
      product,
      " product data retrieved successfully!"
    );
  } catch (error) {
    console.error("Error retrieving product data:", error);
    return ErrorMessage(res, 500, "Failed to retrieve product data");
  }
};

const fetchProductById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!isValidObjectId(id)) {
      return ErrorMessage(res, 400, "Invalid id");
    }

    const product = await ProductModel.findById(id);

    if (!product) {
      return ErrorMessage(res, 400, `No data found with id ${req.params.id}`);
    } else {
      return SuccessMessage(
        res,
        product,
        "Product data retrieved successfully!"
      );
    }
  } catch (err) {
    console.error(err);
    return ErrorMessage(res, 500, "Failed to retrieve product data");
  }
};

const createProduct = async (req, res) => {
  const {
    title,
    description,
    price,
    discountPercentage,
    rating,
    stock,
    brand,
    category,
    thumbnail,
    images,
    sizes,
    colors,
    highlights,
  } = req.body;

  // Validate input using Joi schema
  const { error } = productSchemaJoi.validate({
    title,
    description,
    price,
    discountPercentage,
    rating,
    stock,
    brand,
    category,
    thumbnail,
    images,
    sizes,
    colors,
    highlights,
  });

  if (error) {
    return ErrorMessage(res, 400, error.details[0].message);
  }

  const discountPrice = Math.round(price * (1 - discountPercentage / 100));

  try {
    const product = await ProductModel.create({
      title,
      description,
      price,
      discountPercentage,
      rating,
      stock,
      brand,
      category,
      thumbnail,
      images,
      sizes,
      colors,
      highlights,
      discountPrice,
    });

    return SuccessMessage(res, "Created Successfully!", product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const updateProduct = async (req, res) => {
  const { id, updateData } = req.body;
  if (!isValidObjectId(id)) return ErrorMessage(res, 400, "Invalid id");
  if (!updateData) return ErrorMessage(res, 400, "Invalid Update Data");
  try {
    const product = await ProductModel.findByIdAndUpdate(id, {
      ...updateData,
    });

    product.discountPrice = Math.round(
      product.price * (1 - product.discountPercentage / 100)
    );
    return SuccessMessage(res, "Updated Successfully!");
  } catch (err) {
    console.error("Error updating :", err);
    res.status(500).json({ error: "failed to update " });
  }
};
const fetchAllProducts = async (req, res) => {
  // filter = {"category":["smartphone","laptops"]}
  // sort = {_sort:"price",_order="desc"}
  // pagination = {_page:1,_limit=10}
  let condition = {};
  if (!req.query.admin) {
    condition.deleted = { $ne: true };
  }

  let query = ProductModel.find(condition);
  let totalProductsQuery = ProductModel.find(condition);

  console.log(req.query.category);

  if (req.query.category) {
    query = query.find({ category: { $in: req.query.category.split(",") } });
    totalProductsQuery = totalProductsQuery.find({
      category: { $in: req.query.category.split(",") },
    });
  }
  if (req.query.brand) {
    query = query.find({ brand: { $in: req.query.brand.split(",") } });
    totalProductsQuery = totalProductsQuery.find({
      brand: { $in: req.query.brand.split(",") },
    });
  }
  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  const totalDocs = await totalProductsQuery.count();
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
  createProduct,
  fetchProductById,
  getProducts,
  updateProduct,
  fetchAllProducts,
};
