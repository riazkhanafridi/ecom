const mongoose = require("mongoose");
const { Schema } = mongoose;
const Joi = require("joi");

const brandSchema = new Schema({
  label: { type: String, required: true, unique: true },
  value: { type: String, required: true, unique: true },
});

const BrandModel = mongoose.model("BrandModel", brandSchema);

const brandSchemaJoi = Joi.object({
  label: Joi.string().required(),
  value: Joi.string().required(),
});

brandSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

module.exports = { BrandModel, brandSchemaJoi };
