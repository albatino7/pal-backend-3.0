import urlModel from "../model/url.model.js";
import { genrateRandomCode } from "../utils/genrateCode.js";

export const genrateUrlConotroller = async (req, res, next) => {
  const { url } = req.body;

  if (!url) {
    res.status(400).json({
      message: "url is empty",
    });
  }
  const code = genrateRandomCode();

  const finalResult = await urlModel.create({
    orignalUrl: url,
    shortCode: code,
  });

  res.status(201).json({
    message: "Your Link is Genarted ",
    finalResult,
  });
};

export const getAllUrl = async (req, res) => {
  const allUrl = await urlModel.find();
  res.status(200).json({
    allUrl,
  });
};
