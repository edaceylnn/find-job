import Users from "../models/userModel.js";
import { requestPasswordReset, applyPasswordReset } from "../utils/passwordReset.js";
import { sendServerError } from "../utils/httpResponses.js";

export const register = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  // validate fields

  if (!firstName) {
    next("First Name is required");
    return;
  }
  if (!email) {
    next("Email is required");
    return;
  }
  if (!lastName) {
    next("Last Name is required");
    return;
  }
  if (!password) {
    next("Password is required");
    return;
  }

  try {
    const userExist = await Users.findOne({ email });

    if (userExist) {
      next({ statusCode: 409, message: "Email Address already exists" });
      return;
    }

    const user = await Users.create({
      firstName,
      lastName,
      email,
      password,
    });

    // user token
    const token = await user.createJWT();

    res.status(201).send({
      success: true,
      message: "Account created successfully",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        accountType: user.accountType,
      },
      token,
    });
  } catch (error) {
    sendServerError(res, error, "Hesap oluşturulamadı.");
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    //validation
    if (!email || !password) {
      next("Lütfen e-posta ve şifre bilgilerini gir.");
      return;
    }

    // find user by email
    const user = await Users.findOne({ email }).select("+password");

    if (!user) {
      next("Invalid -email or password");
      return;
    }

    // compare password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      next("Invalid email or password");
      return;
    }

    user.password = undefined;

    const token = user.createJWT();

    res.status(201).json({
      success: true,
      message: "Giriş başarılı.",
      user,
      token,
    });
  } catch (error) {
    sendServerError(res, error, "Giriş yapılamadı.");
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      next("E-posta adresi zorunludur.");
      return;
    }

    try {
      await requestPasswordReset({
        Model: Users,
        email,
        accountType: "seeker",
        getName: (user) => user.firstName,
      });
    } catch (error) {
      return sendServerError(
        res,
        error,
        "Şifre sıfırlama e-postası gönderilemedi."
      );
    }

    // Same response whether or not the account exists, so this endpoint
    // can't be used to check which emails are registered.
    res.status(200).json({
      success: true,
      message:
        "Bu e-posta adresiyle kayıtlı bir hesap varsa, şifre sıfırlama bağlantısı gönderildi.",
    });
  } catch (error) {
    sendServerError(res, error, "Şifre sıfırlama isteği işlenemedi.");
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, token, password } = req.body;

    if (!email || !token || !password) {
      next("E-posta, sıfırlama kodu ve yeni şifre zorunludur.");
      return;
    }

    const user = await applyPasswordReset({ Model: Users, email, token, password });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Sıfırlama kodu geçersiz veya süresi dolmuş.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Şifren başarıyla güncellendi. Yeni şifrenle giriş yapabilirsin.",
    });
  } catch (error) {
    sendServerError(res, error, "Şifre güncellenemedi.");
  }
};
