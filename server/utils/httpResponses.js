export const sendServerError = (
  res,
  error,
  message = "Beklenmeyen bir hata oluştu.",
  statusCode = 500
) => {
  if (process.env.NODE_ENV !== "test") {
    console.error(error);
  }

  return res.status(statusCode).json({
    success: false,
    status: "failed",
    message: error?.message || message,
  });
};

export const sendNotFound = (res, message = "Kayıt bulunamadı.") =>
  res.status(404).json({
    success: false,
    status: "failed",
    message,
  });

export const sendForbidden = (res, message = "Bu işlem için yetkin yok.") =>
  res.status(403).json({
    success: false,
    status: "failed",
    message,
  });
