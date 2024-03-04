const mongoose = require("mongoose");
const Joi = require("joi");

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: {
    type: Number,
    min: [1, "wrong min price"],
    max: [10000, "wrong max price"],
  },
  discountPercentage: {
    type: Number,
    min: [1, "wrong min discount"],
    max: [99, "wrong max discount"],
  },
  rating: {
    type: Number,
    min: [0, "wrong min rating"],
    max: [5, "wrong max price"],
    default: 0,
  },
  stock: {
    type: Number,
    required: true,
    min: 0, // Define the minimum allowed value for stock
  },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  thumbnail: { type: String, required: true },
  images: { type: [String], required: true },
  colors: { type: [mongoose.Schema.Types.Mixed] },
  sizes: { type: [mongoose.Schema.Types.Mixed] },
  highlights: { type: [String] },
  discountPrice: { type: Number },
  deleted: { type: Boolean, default: false },
});

const ProductModel = mongoose.model("ProductModel", productSchema);

const productSchemaJoi = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().min(1).max(10000),
  discountPercentage: Joi.number().min(1).max(99),
  rating: Joi.number().min(0).max(5).default(0),
  stock: Joi.number().min(0).default(0),
  stock: Joi.number().min(0).required(),
  brand: Joi.string().required(),
  category: Joi.string().required(),
  thumbnail: Joi.string().required(),
  images: Joi.array().items(Joi.string()).required(),
  colors: Joi.array().items(Joi.object()).required(),
  sizes: Joi.array().items(Joi.object()).required(),
  highlights: Joi.array().items(Joi.string()),
  discountPrice: Joi.number(),
  deleted: Joi.boolean().default(false),
});
productSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

module.exports = { ProductModel, productSchemaJoi };
