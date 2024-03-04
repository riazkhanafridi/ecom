const { CategoryModel, categorySchemaJoi } = require("../models/CategoryModel");
const { ErrorMessage, SuccessMessage } = require("../utils/ResponseMessage");

const getCategory = async (req, res) => {
  try {
    const Category = await CategoryModel.find();
    return SuccessMessage(
      res,
      Category,
      " Category data retrieved successfully!"
    );
  } catch (error) {
    console.error("Error retrieving Category data:", error);
    return ErrorMessage(res, 500, "Failed to retrieve Category data");
  }
};

const createCategory = async (req, res) => {
  const { label, value } = req.body;

  // Validate input using Joi schema
  const { error } = categorySchemaJoi.validate({ label, value });

  if (error) {
    return ErrorMessage(res, 400, error.details[0].message);
  }

  try {
    const category = await CategoryModel.create({ label, value });

    return SuccessMessage(res, "Category created successfully!");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { createCategory, getCategory };
