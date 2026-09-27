export const checkSeller = (req, res, next) => {
  if (req.user.role !== "seller") {
    return res.status(400).json({
      message: "Only seller can do this request ",
    });
  }

  next();
};
