import Users from "../models/userModel.js";
import crypto from "crypto";
import { sendPasswordResetEmail } from "../utils/email.js";

export const register = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  // validate fields

  if (!firstName) {
    next("First Name is required");
  }
  if (!email) {
    next("Email is required");
  }
  if (!lastName) {
    next("Last Name is required");
  }
  if (!password) {
    next("Password is required");
  }

  try {
    const userExist = await Users.findOne({ email });

    if (userExist) {
      next("Email Address already exists");
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
    console.log(error);
    res.status(404).json({ message: error.message });
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
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      next("E-posta adresi zorunludur.");
      return;
    }

    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Bu e-posta adresiyle kayıtlı aday hesabı bulunamadı.",
      });
    }

    const resetToken = crypto.randomBytes(24).toString("hex");
    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const resetUrl = `${clientUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}&accountType=seeker`;

    try {
      await sendPasswordResetEmail({
        to: email,
        resetUrl,
        name: user.firstName,
      });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: error.message || "Şifre sıfırlama e-postası gönderilemedi.",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Şifre sıfırlama bağlantısı e-posta adresine gönderildi.",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, token, password } = req.body;

    if (!email || !token || !password) {
      next("E-posta, sıfırlama kodu ve yeni şifre zorunludur.");
      return;
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await Users.findOne({
      email,
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Sıfırlama kodu geçersiz veya süresi dolmuş.",
      });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Şifren başarıyla güncellendi. Yeni şifrenle giriş yapabilirsin.",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
