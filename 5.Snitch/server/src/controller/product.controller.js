import { imagekitio } from "../config/ImageKit.js";
import { toFile } from "@imagekit/nodejs";
import { productModel } from "../model/product.model.js";

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

    // console.log(userId, role);

    const uploadedImages = await Promise.all(
      req.files.map(async (file) => {
        const resultFile = await imagekitio.files.upload({
          file: await toFile(file.buffer),
          fileName: file.originalname,
        });

        return resultFile.url;
      }),
    );

    console.log(uploadedImages);

    if (!uploadedImages) {
      const error = new Error("Unable to upload Images to image KIT");
      error.status = 400;
      throw error;
    }

    const newProduct = await productModel.create({
      title: title,
      description: description,
      images: uploadedImages,

      price: {
        amount: Number(req.body["price.amount"]),
        currency: req.body["price.currency"],
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
