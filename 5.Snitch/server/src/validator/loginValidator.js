import { body, validationResult } from "express-validator";

const validate = (req, res, next) => {
  const error = validationResult(req);

  if (error.isEmpty()) {
    return next();
  }

  res.status(401).json({
    message: "invalid login cred",
    error: error.array(),
  });
};

export const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Donot send spaces")
    .bail()
    .isEmail()
    .withMessage("Provide proper email"),

  body("password").trim().notEmpty().withMessage("give us Proper Email"),
  validate,
];
