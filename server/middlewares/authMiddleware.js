import JWT from "jsonwebtoken";

const authFailed = (res) =>
  res.status(401).json({ success: false, message: "Authentication failed" });

const userAuth = async (req, res, next) => {
  const authHeader = req?.headers?.authorization;

  if (!authHeader || !authHeader?.startsWith("Bearer")) {
    return authFailed(res);
  }

  const token = authHeader?.split(" ")[1];

  try {
    const userToken = JWT.verify(token, process.env.JWT_SECRET_KEY);

    req.body.user = {
      userId: userToken.userId,
    };

    next();
  } catch (error) {
    if (process.env.NODE_ENV !== "test") {
      console.error(error);
    }
    authFailed(res);
  }
};

export default userAuth;
