import { body, validationResult } from "express-validator";

const validation = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      err: error.array(),
    });
  }
  next();
};

export const cartValidation = [
  body("productId")
    .exists()
    .withMessage("Product ID is required")
    .bail()
    .isString()
    .withMessage("Product ID must be a string")
    .bail()
    .isMongoId()
    .withMessage("Product ID must be a valid Mongo ID"),
  body("quantity")
    .exists()
    .withMessage("Quantity is required")
    .bail()
    .isInt({ min: 1 })
    .withMessage("Quantity must be an integer greater than 0"),
  body().custom((body) => {
    const sizeVal = body.size || body.sizes;
    if (!sizeVal) {
      throw new Error("Size is required");
    }
    if (!["XS", "S", "M", "L", "XL", "XXL"].includes(sizeVal)) {
      throw new Error("Size must be one of XS, S, M, L, XL, XXL");
    }
    return true;
  }),

  validation,
];
