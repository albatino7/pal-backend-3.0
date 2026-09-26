import { cartModel } from "../model/cart.model.js";
import { productModel } from "../model/product.model.js";

export const addToCart = async (req, res, next) => {
  const { productId, quantity, sizes } = req.body;

  const product = await productModel.findById(productId);

  if (!product) {
    const error = new Error("product id not found in ProductModel");
    error.status = 400;
    throw error;
  }
  const selectedSize = product.sizes.find((vale) => vale.size === sizes);

  if (!selectedSize) {
    const error = new Error("inavalid Size");
    error.status = 400;
    throw error;
  }

  if (selectedSize.stock < quantity) {
    const error = new Error("insufficent Stock");
    error.status(400);
    throw error;
  }

  const cart =
    (await cartModel.findOne({ user: req.user.userId })) ??
    (await cartModel.create({ user: req.user.userId }));

  const productInCart =
    cart.products.find((p) => p.product.toString() === productId) &&
    p.size === sizes;

  if (productInCart) {
    if (productInCart.quantity + quantity > selectedSize.stock) {
      return res.status(400).json({
        message: "Insufficient stock",
      });
    }

    await cartModel.updateOne(
      {
        user: req.user.userId,
        "products.product": productId,
        "products.size": sizes,
      },
      {
        $inc: {
          "products.$.quantity": quantity,
        },
      },
    );

    return res.status(200).json({
      message: "Product quantity updated in cart",
    });
  }
  await cartModel.findOneAndUpdate(
    { user: req.user.userId },
    {
      $push: {
        products: {
          product: productId,
          quantity: quantity,
          size: sizes,
        },
      },
    },
  );

  return res.status(200).json({
    message: "Product added to cart",
  });
};

export const getCart = async (req, res) => {
  const cart =
    (await cartModel.findOne({ user: req.user.userId })) ??
    (await cartModel.create({ user: req.user.userId }));

  return res.status(200).json({
    message: "Cart retrieved successfully",
    data: {
      cart: cart,
    },
  });
};
