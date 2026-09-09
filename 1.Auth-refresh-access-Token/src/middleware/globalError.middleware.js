export const globalError = (err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || "error is Coming ",
    stack: err.stack,
  });
};
