import mongoose from "mongoose";
import Companies from "../models/companiesModel.js";
import Jobs from "../models/jobsModel.js";
import { createSearchRegex } from "../utils/search.js";
import { requestPasswordReset, applyPasswordReset } from "../utils/passwordReset.js";
import {
  sendForbidden,
  sendNotFound,
  sendServerError,
} from "../utils/httpResponses.js";

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
      next({ statusCode: 409, message: "Email Already Registered. Please Login" });
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
    sendServerError(res, error, "Şirket hesabı oluşturulamadı.");
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
      message: "Giriş başarılı.",
      user: company,
      token,
    });
  } catch (error) {
    sendServerError(res, error, "Şirket girişi yapılamadı.");
  }
};

export const forgotCompanyPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      next("E-posta adresi zorunludur.");
      return;
    }

    try {
      await requestPasswordReset({
        Model: Companies,
        email,
        accountType: "company",
        getName: (company) => company.name,
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
    sendServerError(res, error, "Şirket şifre sıfırlama isteği işlenemedi.");
  }
};

export const resetCompanyPassword = async (req, res, next) => {
  try {
    const { email, token, password } = req.body;

    if (!email || !token || !password) {
      next("E-posta, sıfırlama kodu ve yeni şifre zorunludur.");
      return;
    }

    const company = await applyPasswordReset({
      Model: Companies,
      email,
      token,
      password,
    });

    if (!company) {
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
    sendServerError(res, error, "Şirket şifresi güncellenemedi.");
  }
};

export const updateCompanyProfile = async (req, res, next) => {
  const { name, contact, location, profileUrl, about } = req.body;

  try {
    // validation
    if (!name || !location || !about || !contact || !profileUrl) {
      next("Lütfen tüm zorunlu alanları doldur.");
      return;
    }

    const id = req.body.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendNotFound(res, "Şirket bulunamadı.");
    }

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

    if (!company) {
      return sendNotFound(res, "Şirket bulunamadı.");
    }

    const token = company.createJWT();

    company.password = undefined;

    res.status(200).json({
      success: true,
      message: "Şirket profili başarıyla güncellendi.",
      company,
      user: company,
      token,
    });
  } catch (error) {
    sendServerError(res, error, "Şirket profili güncellenemedi.");
  }
};

export const getCompanyProfile = async (req, res, next) => {
  try {
    const id = req.body.user.userId;

    const company = await Companies.findById({ _id: id });

    if (!company) {
      return sendNotFound(res, "Şirket bulunamadı.");
    }

    company.password = undefined;
    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    sendServerError(res, error, "Şirket profili getirilemedi.");
  }
};

//GET ALL COMPANIES
export const getCompanies = async (req, res, next) => {
  try {
    const { search, sort, location } = req.query;

    // Search filters
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

    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    // records count
    const total = await Companies.countDocuments(queryObject);
    const numOfPage = Math.ceil(total / limit);

    queryResult = queryResult.skip(skip).limit(limit);

    const companies = await queryResult;

    res.status(200).json({
      success: true,
      total,
      data: companies,
      page,
      numOfPage,
    });
  } catch (error) {
    sendServerError(res, error, "Şirketler getirilemedi.");
  }
};

//GET  COMPANY JOBS
export const getCompanyJobListing = async (req, res, next) => {
  const { search, sort } = req.query;
  const id = req.body.user.userId;

  try {
    const queryObject = {};

    if (search) {
      const searchRegex = createSearchRegex(search);
      queryObject.$or = [
        { jobTitle: { $regex: searchRegex, $options: "i" } },
        { location: { $regex: searchRegex, $options: "i" } },
        { jobType: { $regex: searchRegex, $options: "i" } },
      ];
    }

    let sorting = "-createdAt";

    if (sort === "Newest") {
      sorting = "-createdAt";
    }
    if (sort === "Oldest") {
      sorting = "createdAt";
    }
    if (sort === "A-Z") {
      sorting = "jobTitle";
    }
    if (sort === "Z-A") {
      sorting = "-jobTitle";
    }

    const company = await Companies.findById(id).select("-password");

    if (!company) {
      return sendForbidden(
        res,
        "İlanlarını görüntülemek için şirket hesabı kullanmalısın."
      );
    }

    const jobPosts = await Jobs.find({ company: id, ...queryObject }).sort(sorting);
    const companyWithJobs = {
      ...company.toObject(),
      jobPosts,
    };

    res.status(200).json({
      success: true,
      companies: companyWithJobs,
    });
  } catch (error) {
    sendServerError(res, error, "Şirket ilanları getirilemedi.");
  }
};

// GET SINGLE COMPANY
export const getCompanyById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendNotFound(res, "Şirket bulunamadı.");
    }

    const company = await Companies.findById({ _id: id }).populate({
      path: "jobPosts",
      options: {
        sort: "-_id",
      },
    });

    if (!company) {
      return sendNotFound(res, "Şirket bulunamadı.");
    }

    company.password = undefined;

    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    sendServerError(res, error, "Şirket profili getirilemedi.");
  }
};

export const getCompanyApplications = async (req, res, next) => {
  try {
    const id = req.body.user.userId;

    const company = await Companies.findById(id);

    if (!company) {
      return sendForbidden(
        res,
        "Başvuranları görüntülemek için şirket hesabı kullanmalısın."
      );
    }

    const jobs = await Jobs.find({ company: id })
      .select("jobTitle application applicationStatus")
      .populate({
        path: "application",
        select: "firstName lastName email jobTitle profileUrl cvUrl",
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
    sendServerError(res, error, "Şirket başvuruları getirilemedi.");
  }
};
