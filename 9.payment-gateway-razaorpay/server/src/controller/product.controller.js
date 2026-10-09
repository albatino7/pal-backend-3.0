import { productModel } from "../model/productSchema.model.js";
import axios from "axios";

export const createProductConrtoller = async (req, res, next) => {
  const { name, amount } = req.body;

  console.log(amount, name);

  const product = await productModel.create({
    name: name,
    amount: amount,
  });

  res.status(201).json({
    message: "Your Product is Created",
    product,
  });
};

export const seedProductsController = async (req, res) => {
  try {
    // 1. Check if products are already created
    const existingProducts = await productModel.countDocuments({
      dummyJsonId: { $exists: true },
    });

    if (existingProducts > 0) {
      return res.status(200).json({
        status: "success",
        message: "Products already created",
        totalProducts: existingProducts,
      });
    }

    // 2. Fetch products from DummyJSON using Axios
    const { data } = await axios.get("https://dummyjson.com/products?limit=0");

    if (!data.products || data.products.length === 0) {
      return res.status(404).json({
        status: "failed",
        message: "No products found in DummyJSON",
      });
    }

    // 3. Map DummyJSON data to our product schema
    const products = data.products.map((item) => ({
      dummyJsonId: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      brand: item.brand || "Unknown",
      amount: item.price,
      discountPercentage: item.discountPercentage,
      rating: item.rating,
      stock: item.stock,
      tags: item.tags || [],
      sku: item.sku,
      weight: item.weight,
      dimensions: item.dimensions,
      warrantyInformation: item.warrantyInformation,
      shippingInformation: item.shippingInformation,
      availabilityStatus: item.availabilityStatus,
      reviews: item.reviews || [],
      returnPolicy: item.returnPolicy,
      minimumOrderQuantity: item.minimumOrderQuantity,
      thumbnail: item.thumbnail,
      images: item.images || [],
    }));

    // 4. Save all products to MongoDB
    const createdProducts = await productModel.insertMany(products);

    // 5. Return success response
    return res.status(201).json({
      status: "success",
      message: "Products created successfully",
      totalProducts: createdProducts.length,
    });
  } catch (error) {
    console.error(
      "Seed products error:",
      error.response?.data || error.message,
    );

    return res.status(500).json({
      status: "failed",
      message: "Failed to create products",
      error: error.response?.data?.message || error.message,
    });
  }
};

export const getAllProductController = async (req, res, next) => {
  try {
    const products = await productModel.find().lean();

    return res.status(200).json({
      status: "success",
      products,
    });
  } catch (error) {
    next(error);
  }
};
