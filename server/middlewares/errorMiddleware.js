// ERROR MIDDLEWARE | NEXT FUNCTION
//
// Every controller in this codebase calls next() with a plain validation
// message string (e.g. next("Email is required")) rather than an Error
// object — real exceptions are caught and responded to directly inside each
// controller's own try/catch. So the default here is 400 (bad request), not
// 500: a string reaching this middleware is a rejected user input, not a
// server crash.

const errorMiddleware = (err, req, res, next) => {
  const defaultError = {
    statusCode: err?.statusCode || 400,
    success: false,
    status: "failed",
    message: typeof err === "string" ? err : err?.message || "Beklenmeyen bir hata oluştu.",
  };

  if (err?.name === "ValidationError") {
    defaultError.statusCode = 400;

    defaultError.message = Object.values(err.errors)
      .map((el) => el.message)
      .join(",");
  }

  //duplicate error
  if (err?.code === 11000) {
    defaultError.statusCode = 409;
    defaultError.message = `${Object.values(
      err.keyValue
    )} field has to be unique!`;
  }

  res.status(defaultError.statusCode).json({
    success: defaultError.success,
    status: defaultError.status,
    message: defaultError.message,
  });
};

export default errorMiddleware;
