import { body, validationResult } from "express-validator";

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  next();
};

export const productvalidateResult = [
  // title
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  // description
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .bail()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters"),

  // images
  body("images")
    .optional()
    .isArray({ max: 5 })
    .withMessage("Images must be an array with maximum 5 images"),

  body("images.*")
    .optional()
    .isURL()
    .withMessage("Each image must be a valid URL"),

  // price.amount
  body("price.amount")
    .notEmpty()
    .withMessage("Price amount is required")
    .bail()
    .isFloat({ min: 0 })
    .withMessage("Price amount must be a positive number"),

  // price.currency
  body("price.currency")
    .optional()
    .isIn(["INR", "USD"])
    .withMessage("Currency must be INR or USD"),

  // sizes
  body("sizes").optional().isArray().withMessage("Sizes must be an array"),

  // sizes.size
  body("sizes.*.size")
    .optional()
    .isIn(["XS", "S", "M", "L", "XL", "XXL"])
    .withMessage("Invalid size"),

  // sizes.stock
  body("sizes.*.stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be 0 or greater"),

  // finally run validationResult
  validate,
];
