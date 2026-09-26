import mongoose from "mongoose";

const cartSchema = mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
      },
      quantity: {
        type: Number,
        deafault: 1,
        min: 1,
      },
      size: {
        type: string,
        enum: ["XS", "S", "M", "L", "XL", "XXL"],
      },
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
});

export const cartModel = mongoose.model("carts", cartSchema);
