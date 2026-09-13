import mongoose from "mongoose";
import Jobs from "../models/jobsModel.js";
import Companies from "../models/companiesModel.js";
import Users from "../models/userModel.js";
import { createSearchRegex } from "../utils/search.js";
import { sendApplicationStatusEmail } from "../utils/email.js";
import { sendNotFound, sendServerError } from "../utils/httpResponses.js";

export const createJob = async (req, res, next) => {
  try {
    const {
      jobTitle,
      jobType,
      location,
      salary,
      vacancies,
      experience,
      desc,
      requirements,
    } = req.body;

    if (
      !jobTitle ||
      !jobType ||
      !location ||
      !salary ||
      !requirements ||
      !desc
    ) {
      next("Lütfen tüm zorunlu alanları doldur.");
      return;
    }

    const id = req.body.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendNotFound(res, "Şirket bulunamadı.");
    }

    const jobPost = {
      jobTitle,
      jobType,
      location,
      salary,
      vacancies,
      experience,
      detail: { desc, requirements },
      company: id,
    };

    const job = new Jobs(jobPost);
    await job.save();

    //update the company information with job id
    const company = await Companies.findById(id);

    if (!company) {
      return sendNotFound(res, "Şirket bulunamadı.");
    }

    company.jobPosts.push(job._id);
    await Companies.findByIdAndUpdate(id, company, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "İlan başarıyla yayınlandı.",
      job,
    });
  } catch (error) {
    sendServerError(res, error, "İlan yayınlanamadı.");
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const {
      jobTitle,
      jobType,
      location,
      salary,
      vacancies,
      experience,
      desc,
      requirements,
    } = req.body;
    const { jobId } = req.params;

    if (
      !jobTitle ||
      !jobType ||
      !location ||
      !salary ||
      !desc ||
      !requirements
    ) {
      next("Lütfen tüm zorunlu alanları doldur.");
      return;
    }
    const id = req.body.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendNotFound(res, "Şirket bulunamadı.");
    }

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(404).json({
        success: false,
        message: "İş ilanı bulunamadı.",
      });
    }

    const job = await Jobs.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "İş ilanı bulunamadı.",
      });
    }

    if (job.company?.toString() !== id) {
      return res.status(403).json({
        success: false,
        message: "Bu ilanı yalnızca ilanı yayınlayan şirket düzenleyebilir.",
      });
    }

    const jobPost = {
      jobTitle,
      jobType,
      location,
      salary,
      vacancies,
      experience,
      detail: { desc, requirements },
    };

    const updatedJob = await Jobs.findByIdAndUpdate(jobId, jobPost, {
      new: true,
    }).populate({
      path: "company",
      select: "-password",
    });

    res.status(200).json({
      success: true,
      message: "İlan başarıyla güncellendi.",
      data: updatedJob,
    });
  } catch (error) {
    sendServerError(res, error, "İlan güncellenemedi.");
  }
};

export const getJobPosts = async (req, res, next) => {
  try {
    const { search, sort, location, jtype, exp } = req.query;
    const types = jtype?.split(","); //full-time,part-time
    const experience = exp?.split("-"); //2-6

    let queryObject = {};

    if (location) {
      queryObject.location = {
        $regex: createSearchRegex(location),
        $options: "i",
      };
    }

    if (jtype) {
      queryObject.jobType = { $in: types };
    }

    //    [2. 6]

    if (exp) {
      queryObject.experience = {
        $gte: Number(experience[0]) - 1,
        $lte: Number(experience[1]) + 1,
      };
    }

    if (search) {
      const searchRegex = createSearchRegex(search);
      const searchQuery = {
        $or: [
          { jobTitle: { $regex: searchRegex, $options: "i" } },
          { jobType: { $regex: searchRegex, $options: "i" } },
        ],
      };
      queryObject = { ...queryObject, ...searchQuery };
    }

    let queryResult = Jobs.find(queryObject).populate({
      path: "company",
      select: "-password",
    });

    // SORTING
    if (sort === "Newest") {
      queryResult = queryResult.sort("-createdAt");
    }
    if (sort === "Oldest") {
      queryResult = queryResult.sort("createdAt");
    }
    if (sort === "A-Z") {
      queryResult = queryResult.sort("jobTitle");
    }
    if (sort === "Z-A") {
      queryResult = queryResult.sort("-jobTitle");
    }

    // pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    //records count
    const totalJobs = await Jobs.countDocuments(queryObject);
    const numOfPage = Math.ceil(totalJobs / limit);

    queryResult = queryResult.skip(skip).limit(limit);

    const jobs = await queryResult;

    res.status(200).json({
      success: true,
      totalJobs,
      data: jobs,
      page,
      numOfPage,
    });
  } catch (error) {
    sendServerError(res, error, "İlanlar getirilemedi.");
  }
};

export const getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendNotFound(res, "İş ilanı bulunamadı.");
    }

    const job = await Jobs.findById({ _id: id }).populate({
      path: "company",
      select: "-password",
    });

    if (!job) {
      return sendNotFound(res, "İş ilanı bulunamadı.");
    }

    //GET SIMILAR JOB POST
    const searchQuery = {
      $or: [
        { jobTitle: { $regex: job?.jobTitle, $options: "i" } },
        { jobType: { $regex: job?.jobType, $options: "i" } },
      ],
    };

    let queryResult = Jobs.find(searchQuery)
      .populate({
        path: "company",
        select: "-password",
      })
      .sort({ _id: -1 });

    queryResult = queryResult.limit(6);
    const similarJobs = await queryResult;

    res.status(200).json({
      success: true,
      data: job,
      similarJobs,
    });
  } catch (error) {
    sendServerError(res, error, "İlan detayı getirilemedi.");
  }
};

export const applyJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.body.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: "İş ilanı bulunamadı.",
      });
    }

    const job = await Jobs.findById(id);
    const applicant = await Users.findById(userId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "İş ilanı bulunamadı.",
      });
    }

    if (!applicant) {
      return res.status(403).json({
        success: false,
        message: "Başvuru yapmak için aday hesabı kullanmalısın.",
      });
    }

    if (job.company?.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: "Kendi ilanına başvuramazsın.",
      });
    }

    const alreadyApplied = job.application?.some(
      (applicantId) => applicantId.toString() === userId
    );

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "Bu ilana zaten başvurdun.",
      });
    }

    job.application.push(userId);
    job.applicationStatus.push({
      applicant: userId,
      status: "pending",
      updatedAt: new Date(),
    });
    await job.save();

    const updatedJob = await Jobs.findById(id).populate({
      path: "company",
      select: "-password",
    });

    res.status(200).json({
      success: true,
      message: "Başvurun başarıyla alındı.",
      data: updatedJob,
    });
  } catch (error) {
    sendServerError(res, error, "Başvuru yapılamadı.");
  }
};

export const getMyApplications = async (req, res, next) => {
  try {
    const userId = req.body.user.userId;

    const applicant = await Users.findById(userId);

    if (!applicant) {
      return res.status(403).json({
        success: false,
        message: "Başvuruları görüntülemek için aday hesabı kullanmalısın.",
      });
    }

    const jobs = await Jobs.find({ application: userId })
      .populate({
        path: "company",
        select: "-password",
      })
      .sort("-updatedAt");
    const jobsWithStatus = jobs.map((job) => {
      const jobObject = job.toObject();
      const statusInfo = jobObject.applicationStatus?.find(
        (item) => item?.applicant?.toString() === userId
      );

      return {
        ...jobObject,
        applicationStatusValue: statusInfo?.status || "pending",
      };
    });

    res.status(200).json({
      success: true,
      total: jobsWithStatus.length,
      data: jobsWithStatus,
    });
  } catch (error) {
    sendServerError(res, error, "Başvurular getirilemedi.");
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { jobId, applicantId } = req.params;
    const { status } = req.body;
    const companyId = req.body.user.userId;
    const validStatuses = ["pending", "reviewed", "accepted", "rejected"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz başvuru durumu.",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(jobId) ||
      !mongoose.Types.ObjectId.isValid(applicantId)
    ) {
      return res.status(404).json({
        success: false,
        message: "İlan veya aday bulunamadı.",
      });
    }

    const job = await Jobs.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "İş ilanı bulunamadı.",
      });
    }

    if (job.company?.toString() !== companyId) {
      return res.status(403).json({
        success: false,
        message: "Başvuru durumunu yalnızca ilan sahibi şirket güncelleyebilir.",
      });
    }

    const hasApplication = job.application?.some(
      (id) => id.toString() === applicantId
    );

    if (!hasApplication) {
      return res.status(404).json({
        success: false,
        message: "Bu ilana ait başvuru bulunamadı.",
      });
    }

    const statusIndex = job.applicationStatus.findIndex(
      (item) => item?.applicant?.toString() === applicantId
    );

    if (statusIndex >= 0) {
      job.applicationStatus[statusIndex].status = status;
      job.applicationStatus[statusIndex].updatedAt = new Date();
    } else {
      job.applicationStatus.push({
        applicant: applicantId,
        status,
        updatedAt: new Date(),
      });
    }

    await job.save();

    // Best-effort notification — a flaky email provider shouldn't fail the
    // status update itself, so this is fire-and-forget with its own catch.
    try {
      const [applicant, company] = await Promise.all([
        Users.findById(applicantId).select("email firstName"),
        Companies.findById(companyId).select("name"),
      ]);

      if (applicant?.email) {
        await sendApplicationStatusEmail({
          to: applicant.email,
          name: applicant.firstName,
          jobTitle: job.jobTitle,
          companyName: company?.name,
          status,
        });
      }
    } catch (error) {
      if (process.env.NODE_ENV !== "test") {
        console.error("Application status email failed:", error.message);
      }
    }

    res.status(200).json({
      success: true,
      message: "Başvuru durumu güncellendi.",
      data: {
        jobId,
        applicantId,
        status,
      },
    });
  } catch (error) {
    sendServerError(res, error, "Başvuru durumu güncellenemedi.");
  }
};

export const toggleSaveJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.body.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: "İş ilanı bulunamadı.",
      });
    }

    const [job, applicant] = await Promise.all([
      Jobs.findById(id),
      Users.findById(userId),
    ]);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "İş ilanı bulunamadı.",
      });
    }

    if (!applicant) {
      return res.status(403).json({
        success: false,
        message: "İlan kaydetmek için aday hesabı kullanmalısın.",
      });
    }

    const alreadySaved = applicant.savedJobs?.some(
      (savedId) => savedId.toString() === id
    );

    if (alreadySaved) {
      applicant.savedJobs = applicant.savedJobs.filter(
        (savedId) => savedId.toString() !== id
      );
    } else {
      applicant.savedJobs.push(id);
    }

    await applicant.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: alreadySaved ? "İlan kaydedilenlerden çıkarıldı." : "İlan kaydedildi.",
      saved: !alreadySaved,
      savedJobs: applicant.savedJobs,
    });
  } catch (error) {
    sendServerError(res, error, "İlan kaydetme işlemi tamamlanamadı.");
  }
};

export const getSavedJobs = async (req, res, next) => {
  try {
    const userId = req.body.user.userId;

    const applicant = await Users.findById(userId).populate({
      path: "savedJobs",
      populate: { path: "company", select: "-password" },
    });

    if (!applicant) {
      return res.status(403).json({
        success: false,
        message: "Kaydedilen ilanları görüntülemek için aday hesabı kullanmalısın.",
      });
    }

    res.status(200).json({
      success: true,
      data: applicant.savedJobs || [],
    });
  } catch (error) {
    sendServerError(res, error, "Kaydedilen ilanlar getirilemedi.");
  }
};

export const deleteJobPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.body.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: "İş ilanı bulunamadı.",
      });
    }

    const job = await Jobs.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "İş ilanı bulunamadı.",
      });
    }

    if (job.company?.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Bu ilanı yalnızca ilanı yayınlayan şirket silebilir.",
      });
    }

    await Jobs.findByIdAndDelete(id);
    await Companies.findByIdAndUpdate(userId, {
      $pull: { jobPosts: id },
    });

    res.status(200).send({
      success: true,
      message: "İlan başarıyla silindi.",
    });
  } catch (error) {
    sendServerError(res, error, "İlan silinemedi.");
  }
};
