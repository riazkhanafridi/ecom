const mongoose = require("mongoose");
const { Schema } = mongoose;
const Joi = require("joi");

const categorySchema = new Schema({
  label: { type: String, required: true, unique: true },
  value: { type: String, required: true, unique: true },
});

const CategoryModel = mongoose.model("CategoryModel", categorySchema);

const categorySchemaJoi = Joi.object({
  label: Joi.string().required(),
  value: Joi.string().required(),
});

categorySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

module.exports = { CategoryModel, categorySchemaJoi };
