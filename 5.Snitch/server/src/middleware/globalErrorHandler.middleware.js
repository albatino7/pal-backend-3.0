export const globalErrorHandler = (err, req, res, next) => {
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      message: "Access token expired rom Global error handler",
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      message: "Invalid access token from Global error handler",
    });
  }
  res.status(err.status || 500).json({
    message: err.message || "error is Coming ",
    stack: err.stack,
  });
};
