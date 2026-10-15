import { cartModel } from "../model/cart.model.js";
import { productModel } from "../model/product.model.js";

// Add item to cart or increment quantity
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const size = req.body.size || req.body.sizes;

    const parsedQty = parseInt(quantity, 10) || 1;

    const product = await productModel.findById(productId);
    if (!product) {
      const error = new Error("Product not found");
      error.status = 404;
      throw error;
    }

    const selectedSize = product.sizes?.find((val) => val.size === size);
    if (!selectedSize) {
      const error = new Error("Invalid size for this product");
      error.status = 400;
      throw error;
    }

    if (selectedSize.stock < parsedQty) {
      const error = new Error(`Insufficient stock. Only ${selectedSize.stock} available.`);
      error.status = 400;
      throw error;
    }

    let cart = await cartModel.findOne({ user: req.user.userId });
    if (!cart) {
      cart = await cartModel.create({ user: req.user.userId, products: [] });
    }

    const productInCart = cart.products.find(
      (p) => p.product.toString() === productId && p.size === size
    );

    if (productInCart) {
      const newQty = productInCart.quantity + parsedQty;
      if (newQty > selectedSize.stock) {
        return res.status(400).json({
          message: `Cannot add more. Total in cart exceeds available stock (${selectedSize.stock}).`,
        });
      }

      await cartModel.updateOne(
        {
          user: req.user.userId,
          "products.product": productId,
          "products.size": size,
        },
        {
          $inc: { "products.$.quantity": parsedQty },
        }
      );
    } else {
      await cartModel.findOneAndUpdate(
        { user: req.user.userId },
        {
          $push: {
            products: {
              product: productId,
              quantity: parsedQty,
              size: size,
            },
          },
        }
      );
    }

    const updatedCart = await cartModel
      .findOne({ user: req.user.userId })
      .populate("products.product");

    return res.status(200).json({
      message: "Product added to cart",
      cart: updatedCart,
    });
  } catch (error) {
    next(error);
  }
};

// Get current user's cart populated with products
export const getCart = async (req, res, next) => {
  try {
    let cart = await cartModel
      .findOne({ user: req.user.userId })
      .populate({
        path: "products.product",
        select: "title price images sizes published seller",
      });

    if (!cart) {
      cart = await cartModel.create({ user: req.user.userId, products: [] });
    }

    return res.status(200).json({
      message: "Cart retrieved successfully",
      data: {
        cart,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update cart item quantity directly
export const updateCartQuantity = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const size = req.body.size || req.body.sizes;
    const parsedQty = parseInt(quantity, 10);

    if (parsedQty <= 0) {
      return removeFromCart(req, res, next);
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const sizeObj = product.sizes?.find((s) => s.size === size);
    if (!sizeObj || sizeObj.stock < parsedQty) {
      return res.status(400).json({
        message: `Only ${sizeObj ? sizeObj.stock : 0} units available in size ${size}`,
      });
    }

    await cartModel.updateOne(
      {
        user: req.user.userId,
        "products.product": productId,
        "products.size": size,
      },
      {
        $set: { "products.$.quantity": parsedQty },
      }
    );

    const updatedCart = await cartModel
      .findOne({ user: req.user.userId })
      .populate("products.product");

    return res.status(200).json({
      message: "Cart quantity updated",
      cart: updatedCart,
    });
  } catch (error) {
    next(error);
  }
};

// Remove single product variant from cart
export const removeFromCart = async (req, res, next) => {
  try {
    const productId = req.body.productId || req.params.productId;
    const size = req.body.size || req.params.size;

    await cartModel.updateOne(
      { user: req.user.userId },
      {
        $pull: {
          products: {
            product: productId,
            size: size,
          },
        },
      }
    );

    const updatedCart = await cartModel
      .findOne({ user: req.user.userId })
      .populate("products.product");

    return res.status(200).json({
      message: "Item removed from cart",
      cart: updatedCart,
    });
  } catch (error) {
    next(error);
  }
};

// Clear entire cart for user
export const clearCart = async (req, res, next) => {
  try {
    const cart = await cartModel.findOneAndUpdate(
      { user: req.user.userId },
      { $set: { products: [] } },
      { new: true }
    );

    return res.status(200).json({
      message: "Cart cleared",
      cart,
    });
  } catch (error) {
    next(error);
  }
};
