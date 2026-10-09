import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    dummyJsonId: {
      type: Number,
      unique: true,
      sparse: true,
    },
    title: String,
    description: String,
    category: String,
    brand: String,

    // Keep this field because your payment controller uses product.amount
    amount: {
      type: Number,
      required: true,
    },

    discountPercentage: Number,
    rating: Number,
    stock: Number,
    tags: [String],
    sku: String,
    weight: Number,

    dimensions: {
      width: Number,
      height: Number,
      depth: Number,
    },

    warrantyInformation: String,
    shippingInformation: String,
    availabilityStatus: String,
    reviews: [
      {
        rating: Number,
        comment: String,
        date: Date,
        reviewerName: String,
        reviewerEmail: String,
      },
    ],
    returnPolicy: String,
    minimumOrderQuantity: Number,
    thumbnail: String,
    images: [String],
  },
  { timestamps: true },
);

export const productModel = mongoose.model("product", productSchema);
