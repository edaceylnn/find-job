import mongoose from "mongoose";
import Jobs from "../models/jobsModel.js";
import Companies from "../models/companiesModel.js";
import Users from "../models/userModel.js";
import { createSearchRegex } from "../utils/search.js";

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

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No Company with id: ${id}`);

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

    company.jobPosts.push(job._id);
    const updateCompany = await Companies.findByIdAndUpdate(id, company, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "İlan başarıyla yayınlandı.",
      job,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
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

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No Company with id: ${id}`);

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
    console.log(error);
    res.status(404).json({ message: error.message });
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

    queryResult = queryResult.limit(limit * page);

    const jobs = await queryResult;

    res.status(200).json({
      success: true,
      totalJobs,
      data: jobs,
      page,
      numOfPage,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await Jobs.findById({ _id: id }).populate({
      path: "company",
      select: "-password",
    });

    if (!job) {
      return res.status(200).send({
        message: "Job Post Not Found",
        success: false,
      });
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
    console.log(error);
    res.status(404).json({ message: error.message });
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
    console.log(error);
    res.status(404).json({ message: error.message });
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
    console.log(error);
    res.status(404).json({ message: error.message });
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
    console.log(error);
    res.status(404).json({ message: error.message });
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
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
