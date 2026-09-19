import { body, validationResult } from "express-validator";

const validate = (req, res, next) => {
  const error = validationResult(req);

  if (error.isEmpty()) {
    return next();
  }

  res.status(400).json({
    message: "invalid inputs",
    error: error.array(),
  });
};

export const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is Required")
    .bail()
    .isLength({ min: 2, max: 20 })
    .withMessage("Name min will 2 and max 20"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Please enter valid email")
    .bail(),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("please enter password")
    .bail()
    .isLength({ min: 3, max: 10 })
    .withMessage("min:3 and max length:10"),
  validate,
];
