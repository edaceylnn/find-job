import mongoose from "mongoose";
import Companies from "../models/companiesModel.js";
import Jobs from "../models/jobsModel.js";
import { response } from "express";
import { createSearchRegex } from "../utils/search.js";
import crypto from "crypto";
import { sendPasswordResetEmail } from "../utils/email.js";

export const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  //validate fields
  if (!name) {
    next("Company Name is required!");
    return;
  }
  if (!email) {
    next("Email address is required!");
    return;
  }
  if (!password) {
    next("Password is required and must be greater than 6 characters");
    return;
  }

  try {
    const accountExist = await Companies.findOne({ email });

    if (accountExist) {
      next("Email Already Registered. Please Login");
      return;
    }

    // create a new account
    const company = await Companies.create({
      name,
      email,
      password,
    });

    // user token
    const token = company.createJWT();

    res.status(201).json({
      success: true,
      message: "Company Account Created Successfully",
      user: {
        _id: company._id,
        name: company.name,
        email: company.email,
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
      next("Please Provide AUser Credentials");
      return;
    }

    const company = await Companies.findOne({ email }).select("+password");

    if (!company) {
      next("Invalid email or Password");
      return;
    }

    //compare password
    const isMatch = await company.comparePassword(password);
    if (!isMatch) {
      next("Invalid email or Password");
      return;
    }
    company.password = undefined;

    const token = company.createJWT();

    res.status(200).json({
      success: true,
      message: "Login SUccessfully",
      user: company,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const forgotCompanyPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      next("E-posta adresi zorunludur.");
      return;
    }

    const company = await Companies.findOne({ email });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Bu e-posta adresiyle kayıtlı şirket hesabı bulunamadı.",
      });
    }

    const resetToken = crypto.randomBytes(24).toString("hex");
    company.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    company.passwordResetExpires = Date.now() + 15 * 60 * 1000;

    await company.save({ validateBeforeSave: false });

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const resetUrl = `${clientUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}&accountType=company`;

    try {
      await sendPasswordResetEmail({
        to: email,
        resetUrl,
        name: company.name,
      });
    } catch (error) {
      company.passwordResetToken = undefined;
      company.passwordResetExpires = undefined;
      await company.save({ validateBeforeSave: false });

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

export const resetCompanyPassword = async (req, res, next) => {
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

    const company = await Companies.findOne({
      email,
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!company) {
      return res.status(400).json({
        success: false,
        message: "Sıfırlama kodu geçersiz veya süresi dolmuş.",
      });
    }

    company.password = password;
    company.passwordResetToken = undefined;
    company.passwordResetExpires = undefined;

    await company.save();

    res.status(200).json({
      success: true,
      message: "Şifren başarıyla güncellendi. Yeni şifrenle giriş yapabilirsin.",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const updateCompanyProfile = async (req, res, next) => {
  const { name, contact, location, profileUrl, about } = req.body;

  try {
    // validation
    if (!name || !location || !about || !contact || !profileUrl) {
      next("Please Provide All Required Fields");
      return;
    }

    const id = req.body.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No Company with id: ${id}`);

    const updateCompany = {
      name,
      contact,
      location,
      profileUrl,
      about,
      _id: id,
    };

    const company = await Companies.findByIdAndUpdate(id, updateCompany, {
      new: true,
    });

    const token = company.createJWT();

    company.password = undefined;

    res.status(200).json({
      success: true,
      message: "Company Profile Updated SUccessfully",
      company,
      user: company,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getCompanyProfile = async (req, res, next) => {
  try {
    const id = req.body.user.userId;

    const company = await Companies.findById({ _id: id });

    if (!company) {
      return res.status(200).send({
        message: "Company Not Found",
        success: false,
      });
    }

    company.password = undefined;
    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

//GET ALL COMPANIES
export const getCompanies = async (req, res, next) => {
  try {
    const { search, sort, location } = req.query;

    //conditons for searching filters
    const queryObject = {};

    if (search) {
      queryObject.name = { $regex: createSearchRegex(search), $options: "i" };
    }

    if (location) {
      queryObject.location = {
        $regex: createSearchRegex(location),
        $options: "i",
      };
    }

    let queryResult = Companies.find(queryObject).select("-password");

    // SORTING
    if (sort === "Newest") {
      queryResult = queryResult.sort("-createdAt");
    }
    if (sort === "Oldest") {
      queryResult = queryResult.sort("createdAt");
    }
    if (sort === "A-Z") {
      queryResult = queryResult.sort("name");
    }
    if (sort === "Z-A") {
      queryResult = queryResult.sort("-name");
    }

    // PADINATIONS
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    // records count
    const total = await Companies.countDocuments(queryObject);
    const numOfPage = Math.ceil(total / limit);
    // move next page
    // queryResult = queryResult.skip(skip).limit(limit);

    // show mopre instead of moving to next page
    queryResult = queryResult.limit(limit * page);

    const companies = await queryResult;

    res.status(200).json({
      success: true,
      total,
      data: companies,
      page,
      numOfPage,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

//GET  COMPANY JOBS
export const getCompanyJobListing = async (req, res, next) => {
  const { search, sort } = req.query;
  const id = req.body.user.userId;

  try {
    //conditons for searching filters
    const queryObject = {};

    if (search) {
      queryObject.location = { $regex: createSearchRegex(search), $options: "i" };
    }

    let sorting;
    //sorting || another way
    if (sort === "Newest") {
      sorting = "-createdAt";
    }
    if (sort === "Oldest") {
      sorting = "createdAt";
    }
    if (sort === "A-Z") {
      sorting = "name";
    }
    if (sort === "Z-A") {
      sorting = "-name";
    }

    let queryResult = await Companies.findById({ _id: id }).populate({
      path: "jobPosts",
      options: { sort: sorting },
    });
    const companies = await queryResult;

    res.status(200).json({
      success: true,
      companies,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

// GET SINGLE COMPANY
export const getCompanyById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const company = await Companies.findById({ _id: id }).populate({
      path: "jobPosts",
      options: {
        sort: "-_id",
      },
    });

    if (!company) {
      return res.status(200).send({
        message: "Company Not Found",
        success: false,
      });
    }

    company.password = undefined;

    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getCompanyApplications = async (req, res, next) => {
  try {
    const id = req.body.user.userId;

    const company = await Companies.findById(id);

    if (!company) {
      return res.status(403).json({
        success: false,
        message: "Başvuranları görüntülemek için şirket hesabı kullanmalısın.",
      });
    }

    const jobs = await Jobs.find({ company: id })
      .select("jobTitle application applicationStatus")
      .populate({
        path: "application",
        select: "firstName lastName email jobTitle profileUrl",
      });

    const applications = jobs.reduce((acc, job) => {
      const statuses = job.applicationStatus || [];
      acc[job._id] = (job.application || []).map((applicant) => {
        const applicantObject = applicant.toObject();
        const statusInfo = statuses.find(
          (item) => item?.applicant?.toString() === applicantObject._id.toString()
        );

        return {
          ...applicantObject,
          applicationStatusValue: statusInfo?.status || "pending",
        };
      });
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
