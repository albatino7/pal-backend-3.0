import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide title"],
  },
  description: {
    type: String,
    required: [true],
  },
  images: {
    type: [{ type: String }],
    validate: {
      validator: (images) => images.length <= 5,
      message: "A product can have at most 5 images",
    },
  },

  price: {
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      enum: ["INR", "USD"],
      default: "INR",
    },
  },

  sizes: [
    {
      size: {
        type: String,
        enum: ["XS", "S", "M", "L", "XL", "XXL"],
        required: true,
      },
      stock: {
        type: Number,
        min: 0,
        default: 0,
      },
    },
  ],

  seller: {
    type: mongoose.Schema.ObjectId,
    ref: "users",
    required: true,
  },
});

export const productModel = mongoose.model("products", productSchema);
