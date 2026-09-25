import { imagekitio } from "../config/ImageKit.js";
import { toFile } from "@imagekit/nodejs";
import { productModel } from "../model/product.model.js";
import { imageUpload } from "../config/ImageKit.js";

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

    // const uploadedImages = await Promise.all(
    //   req.files.map(async (file) => {
    //     const resultFile = await imagekitio.files.upload({
    //       file: await toFile(file.buffer),
    //       fileName: file.originalname,
    //     });

    //     return resultFile.url;
    //   }),
    // );

    const fileUrl = [];
    // file.originalname
    for (let i = 0; i < req.files.length; i++) {
      const result = await imageUpload({
        buffer: req.files[i].buffer,
        filename: req.files[i].originalname,
      });

      fileUrl.push(result);
      console.log("image kit at controller ", result);
    }

    const newProduct = await productModel.create({
      title: title,
      description: description,
      images: fileUrl,

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

export const gettAllproductController = async (req, res, next) => {
  const allProduct = await productModel.find();

  res.status(200).json({
    message: "Your all available products",
    products: allProduct,
  });
};
