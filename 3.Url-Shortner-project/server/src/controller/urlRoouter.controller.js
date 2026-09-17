import urlModel from "../model/url.model.js";

import { genrateRandomCode } from "../utils/genrateCode.js";

export const genrateUrlConotroller = async (req, res, next) => {
  try {
    const { url } = req.body;

    if (!url) {
      res.status(400).json({
        message: "url is empty",
      });
    }

    if (!/^https?:\/\//i.test(url)) {
      return res.status(400).json({
        message: "URL must start with http:// or https://",
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
  } catch (error) {
    next(error);
  }
};

export const getAllUrl = async (req, res, next) => {
  try {
    const allUrl = await urlModel.find();

    res.status(200).json({
      allUrl,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUrl = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await urlModel.findOne({
      shortCode: id,
    });
    if (!user) {
      return res.status(404).json({
        message: "Id is not Found",
      });
    }
    const user_id = user._id;

    const final = await urlModel.findByIdAndDelete({ _id: user_id });

    res.status(200).json({
      message: "User Link deleted Sucessfully",
    });
  } catch (error) {
    next(error);
  }
};
