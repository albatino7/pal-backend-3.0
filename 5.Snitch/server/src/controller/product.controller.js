import { imagekitio } from "../config/ImageKit.js";
import { toFile } from "@imagekit/nodejs";
import { productModel } from "../model/product.model.js";
// import { imageUpload } from "../config/ImageKit.js";

//create Product in DB by Seller
export const createProductController = async (req, res, next) => {
  try {
    // console.log(req.body);
    // console.log(req.files);
    const { title, description, sizes } = req.body;

    const { userId, role } = req.user;

    if (role != "seller") {
      const error = new Error("Your are not a seller");
      error.status = 403;
      throw error;
    }

    //we can also upload image like this but for loop is better for understanding and all
    //THIS IS BETTER APPROACH FOR Production
    const uploadedImages = await Promise.all(
      req.files.map(async (file) => {
        const resultFile = await imagekitio.files.upload({
          file: await toFile(file.buffer),
          fileName: file.originalname,
        });

        return resultFile.url;
      }),
    );

    // const fileUrl = [];
    // // file.originalname
    // for (let i = 0; i < req.files.length; i++) {
    //   const result = await imageUpload({
    //     buffer: req.files[i].buffer,
    //     filename: req.files[i].originalname,
    //   });

    //   fileUrl.push(result);
    //   console.log("image kit at controller ", result);
    // }

    const newProduct = await productModel.create({
      title: title,
      description: description,
      images: uploadedImages,

      // price: {
      //   amount: Number(req.body["price.amount"]),
      //   currency: req.body["price.currency"],
      // },
      price: {
        amount: req.body.price.amount,
        currency: req.body.price.currency,
      },
      sizes: sizes,
      seller: userId,
    });

    if (!newProduct) {
      const error = new Error("Unable to create Products");
      error.status = 400;
      throw error;
    }
    console.log(newProduct);

    res.status(200).json({
      message: "product Created Sucessfully",
      data: {
        newProduct,
      },
    });
  } catch (error) {
    next(error);
  }
};

//get All product including published true or false both

export const gettAllproductController = async (req, res, next) => {
  const allProduct = await productModel.find({});

  res.status(200).json({
    message: "Your all available products",
    products: allProduct,
  });
};

//get only published products //
export const publishedProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await productModel.find({ published: true })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await productModel.countDocuments({ published: true });
    
    const hasNextPage = (page * limit) < total;

    res.status(200).json({
      message: "all published true product for users",
      data: {
        products,
        nextPage: hasNextPage ? page + 1 : null,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

//make product published false by :product:ID

export const unlistProductController = async (req, res, next) => {
  const { id } = req.params;

  const product = await productModel.findById(id);

  if (!product) {
    const error = new Error("Product with this id Not found");
    error.status = 400;
    throw error;
  }

  const updatedProduct = await productModel.findByIdAndUpdate(
    {
      _id: id,
    },
    { published: false },
  );

  res.status(200).json({
    message: "Product unlist false  Sucessfully",
    data: updatedProduct,
  });
};

//make product published true by :product:ID

export const listProductController = async (req, res, next) => {
  const { id } = req.params;

  const product = await productModel.findById(id);

  if (!product) {
    const error = new Error("Product with this id Not found");
    error.status = 400;
    throw error;
  }

  const updatedProduct = await productModel.findByIdAndUpdate(
    {
      _id: id,
    },
    { published: true },
  );

  res.status(200).json({
    message: "Product list ture Sucessfully",
    data: updatedProduct,
  });
};

// get single product by ID
export const getSingleProductController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id).populate("seller", "name email");
    
    if (!product) {
      const error = new Error("Product not found");
      error.status = 404;
      throw error;
    }
    
    res.status(200).json({
      message: "Product fetched successfully",
      product
    });
  } catch (error) {
    next(error);
  }
};

// update product by ID
export const updateProductController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, price, sizes } = req.body;
    
    const product = await productModel.findById(id);
    if (!product) {
      const error = new Error("Product not found");
      error.status = 404;
      throw error;
    }

    if (product.seller.toString() !== req.user.userId.toString()) {
      const error = new Error("Unauthorized to update this product");
      error.status = 403;
      throw error;
    }

    let updatedImages = product.images;
    if (req.files && req.files.length > 0) {
      updatedImages = await Promise.all(
        req.files.map(async (file) => {
          const resultFile = await imagekitio.files.upload({
            file: await toFile(file.buffer),
            fileName: file.originalname,
          });
          return resultFile.url;
        })
      );
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      {
        title: title || product.title,
        description: description || product.description,
        price: price ? (typeof price === 'string' ? JSON.parse(price) : price) : product.price,
        sizes: sizes ? (typeof sizes === 'string' ? JSON.parse(sizes) : sizes) : product.sizes,
        images: updatedImages,
      },
      { new: true }
    );

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

// delete product by ID
export const deleteProductController = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const product = await productModel.findById(id);
    if (!product) {
      const error = new Error("Product not found");
      error.status = 404;
      throw error;
    }

    if (product.seller.toString() !== req.user.userId.toString()) {
      const error = new Error("Unauthorized to delete this product");
      error.status = 403;
      throw error;
    }

    await productModel.findByIdAndDelete(id);

    res.status(200).json({
      message: "Product deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

// get all products by a specific seller (Dashboard)
export const getSellerProductsController = async (req, res, next) => {
  try {
    const products = await productModel.find({ seller: req.user.userId });
    
    res.status(200).json({
      message: "Seller products fetched successfully",
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};
