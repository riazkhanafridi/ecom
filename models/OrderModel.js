const mongoose = require("mongoose");
const { Schema } = mongoose;
const Joi = require("joi");

const paymentMethods = {
  values: ["card", "cash"],
  message: "enum validator failed for payment Methods",
};

const orderSchema = new Schema(
  {
    items: { type: [Schema.Types.Mixed], required: true },
    totalAmount: { type: Number },
    totalItems: { type: Number },
    user: { type: Schema.Types.ObjectId, ref: "UserModel", required: true },
    paymentMethod: {
      type: String,
      required: true,
      enum: paymentMethods.values,
    },
    paymentStatus: { type: String, default: "pending" },
    status: { type: String, default: "pending" },
    selectedAddress: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model("OrderModel", orderSchema);

const orderSchemaJoi = Joi.object({
  items: Joi.array().items(Joi.object()).required(),
  totalAmount: Joi.number(),
  totalItems: Joi.number(),
  user: Joi.object().required(),
  paymentMethod: Joi.string()
    .valid(...paymentMethods.values)
    .required(),
  paymentStatus: Joi.string().default("pending"),
  status: Joi.string().default("pending"),
  selectedAddress: Joi.object().required(),
});

orderSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

module.exports = { OrderModel, orderSchemaJoi };
