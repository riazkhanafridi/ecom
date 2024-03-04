const mongoose = require("mongoose");
const { Schema } = mongoose;
const Joi = require("joi");

const cartSchema = new Schema(
  {
    quantity: { type: Number, required: true },
    product: {
      type: Schema.Types.ObjectId,
      ref: "ProductModel",
      required: true,
    },
    user: { type: Schema.Types.ObjectId, ref: "UserModel", required: true },
    size: { type: Schema.Types.Mixed },
    color: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

const CartModel = mongoose.model("CartModel", cartSchema);

const cartSchemaJoi = Joi.object({
  quantity: Joi.number().required(),
  product: Joi.string().required(),
  user: Joi.object().required(),
  size: Joi.object(),
  color: Joi.object(),
});

cartSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

module.exports = { CartModel, cartSchemaJoi };
