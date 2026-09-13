import mongoose from "mongoose";
import Users from "../models/userModel.js";
import { sendNotFound, sendServerError } from "../utils/httpResponses.js";

export const updateUser = async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    contact,
    location,
    profileUrl,
    jobTitle,
    about,
    cvUrl,
  } = req.body;

  try {
    if (!firstName || !lastName || !email || !contact || !jobTitle || !about) {
      next("Please provide all required fields");
      return;
    }

    const id = req.body.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendNotFound(res, "Aday bulunamadı.");
    }

    const updateUser = {
      firstName,
      lastName,
      email,
      contact,
      location,
      profileUrl,
      jobTitle,
      about,
      cvUrl,
      _id: id,
    };

    const user = await Users.findByIdAndUpdate(id, updateUser, { new: true });

    if (!user) {
      return sendNotFound(res, "Aday bulunamadı.");
    }

    const token = user.createJWT();

    user.password = undefined;

    res.status(200).json({
      success: true,
      message: "Profil başarıyla güncellendi.",
      user,
      token,
    });
  } catch (error) {
    sendServerError(res, error, "Profil güncellenemedi.");
  }
};

export const getUser = async (req, res, next) => {
  try {
    const id = req.body.user.userId;

    const user = await Users.findById({ _id: id });

    if (!user) {
      return sendNotFound(res, "Aday bulunamadı.");
    }

    user.password = undefined;

    res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    sendServerError(res, error, "Aday profili getirilemedi.");
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendNotFound(res, "Aday bulunamadı.");
    }

    const user = await Users.findById(id).select(
      "-password -passwordResetToken -passwordResetExpires"
    );

    if (!user) {
      return sendNotFound(res, "Aday bulunamadı.");
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    sendServerError(res, error, "Aday profili getirilemedi.");
  }
};
