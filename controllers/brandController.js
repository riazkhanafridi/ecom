const { BrandModel, brandSchemaJoi } = require("../models/BrandModel");
const { ErrorMessage, SuccessMessage } = require("../utils/ResponseMessage");

const getBrand = async (req, res) => {
  try {
    const Brand = await BrandModel.find();
    return SuccessMessage(res, Brand, " Brand data retrieved successfully!");
  } catch (error) {
    console.error("Error retrieving Brand data:", error);
    return ErrorMessage(res, 500, "Failed to retrieve Brand data");
  }
};

const createBrand = async (req, res) => {
  const { label, value } = req.body;

  // Validate input using Joi schema
  const { error } = brandSchemaJoi.validate({ label, value });

  if (error) {
    return ErrorMessage(res, 400, error.details[0].message);
  }

  try {
    const Brand = await BrandModel.create({ label, value });

    return SuccessMessage(res, "Brand created successfully!");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { createBrand, getBrand };
