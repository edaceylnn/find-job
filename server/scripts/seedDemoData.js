import dotenv from "dotenv";
import mongoose from "mongoose";
import Companies from "../models/companiesModel.js";
import Jobs from "../models/jobsModel.js";
import Users from "../models/userModel.js";

dotenv.config();

const DEMO_PASSWORD = "Demo1234";

const demoCompanyEmails = [
  "demo.company@kariyerbul.dev",
  "talent@novaterra.dev",
];

const demoUserEmails = [
  "demo.candidate@kariyerbul.dev",
  "aylin.yilmaz@demo.dev",
  "mert.kaya@demo.dev",
  "zeynep.demir@demo.dev",
  "kaan.arslan@demo.dev",
];

const pdfUrl =
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

const avatar = (seed) =>
  `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(seed)}`;

const connect = async () => {
  if (!process.env.MONGODB_URL) {
    throw new Error("MONGODB_URL bulunamadı. server/.env dosyasını kontrol et.");
  }

  await mongoose.connect(process.env.MONGODB_URL);
};

const clearDemoData = async () => {
  const demoCompanies = await Companies.find({
    email: { $in: demoCompanyEmails },
  }).select("_id");
  const demoCompanyIds = demoCompanies.map((company) => company._id);

  await Jobs.deleteMany({ company: { $in: demoCompanyIds } });
  await Companies.deleteMany({ email: { $in: demoCompanyEmails } });
  await Users.deleteMany({ email: { $in: demoUserEmails } });
};

const createCompanies = async () => {
  const primaryCompany = await Companies.create({
    name: "Novaterra Studio",
    email: "demo.company@kariyerbul.dev",
    password: DEMO_PASSWORD,
    contact: "+90 212 555 01 10",
    location: "İstanbul / Hibrit",
    profileUrl: avatar("Novaterra Studio"),
    about:
      "Novaterra Studio, ürün ekipleri için ölçeklenebilir web uygulamaları geliştiren modern bir yazılım stüdyosudur. Adaylarda sahiplenme, temiz iletişim ve ürün odağı arar.",
  });

  const secondaryCompany = await Companies.create({
    name: "Atlas Finans Teknolojileri",
    email: "talent@novaterra.dev",
    password: DEMO_PASSWORD,
    contact: "+90 312 555 02 20",
    location: "Ankara / Uzaktan",
    profileUrl: avatar("Atlas Finans Teknolojileri"),
    about:
      "Atlas Finans Teknolojileri, finans ekipleri için veri odaklı karar destek araçları geliştirir. Uzaktan çalışma kültürü ve güçlü mühendislik pratikleriyle büyür.",
  });

  return { primaryCompany, secondaryCompany };
};

const createUsers = async () => {
  const users = await Users.create([
    {
      firstName: "Eda",
      lastName: "Ceylan",
      email: "demo.candidate@kariyerbul.dev",
      password: DEMO_PASSWORD,
      accountType: "seeker",
      contact: "+90 555 100 20 30",
      location: "İstanbul",
      profileUrl: avatar("Eda Ceylan"),
      cvUrl: pdfUrl,
      jobTitle: "Software Engineer",
      about:
        "React, Node.js ve kullanıcı odaklı ürün geliştirme alanlarında çalışan yazılım geliştirici. Dashboard, form akışları ve API entegrasyonlarında deneyimli.",
    },
    {
      firstName: "Aylin",
      lastName: "Yılmaz",
      email: "aylin.yilmaz@demo.dev",
      password: DEMO_PASSWORD,
      accountType: "seeker",
      contact: "+90 555 222 10 10",
      location: "İstanbul",
      profileUrl: avatar("Aylin Yılmaz"),
      cvUrl: pdfUrl,
      jobTitle: "Frontend Developer",
      about:
        "React, Tailwind CSS ve erişilebilir arayüzler üzerine çalışan frontend geliştirici.",
    },
    {
      firstName: "Mert",
      lastName: "Kaya",
      email: "mert.kaya@demo.dev",
      password: DEMO_PASSWORD,
      accountType: "seeker",
      contact: "+90 555 333 20 20",
      location: "Ankara",
      profileUrl: avatar("Mert Kaya"),
      cvUrl: pdfUrl,
      jobTitle: "Backend Developer",
      about:
        "Node.js, Express ve MongoDB ile API tasarımı ve servis geliştirme üzerine çalışır.",
    },
    {
      firstName: "Zeynep",
      lastName: "Demir",
      email: "zeynep.demir@demo.dev",
      password: DEMO_PASSWORD,
      accountType: "seeker",
      contact: "+90 555 444 30 30",
      location: "İzmir",
      profileUrl: avatar("Zeynep Demir"),
      cvUrl: pdfUrl,
      jobTitle: "Product Designer",
      about:
        "Ürün keşfi, kullanıcı araştırması ve modern SaaS arayüzleri tasarlama konusunda deneyimli.",
    },
    {
      firstName: "Kaan",
      lastName: "Arslan",
      email: "kaan.arslan@demo.dev",
      password: DEMO_PASSWORD,
      accountType: "seeker",
      contact: "+90 555 555 40 40",
      location: "Remote",
      profileUrl: avatar("Kaan Arslan"),
      cvUrl: "",
      jobTitle: "QA Engineer",
      about:
        "Manuel test, regresyon süreçleri ve uçtan uca kullanıcı akışı doğrulama üzerine çalışır.",
    },
  ]);

  return users.reduce((acc, user) => {
    acc[user.email] = user;
    return acc;
  }, {});
};

const createJobs = async ({ primaryCompany, secondaryCompany, usersByEmail }) => {
  const jobs = await Jobs.create([
    {
      company: primaryCompany._id,
      jobTitle: "Frontend Developer",
      jobType: "Full-Time",
      location: "İstanbul / Hibrit",
      salary: 65000,
      vacancies: 2,
      experience: 3,
      detail: {
        desc:
          "React ve Tailwind CSS ile aday ve işveren panellerini geliştirecek, ürün odaklı frontend geliştirici arıyoruz.",
        requirements:
          "React, component mimarisi, responsive tasarım, REST API entegrasyonu ve temiz UI geliştirme deneyimi.",
      },
      application: [
        usersByEmail["demo.candidate@kariyerbul.dev"]._id,
        usersByEmail["aylin.yilmaz@demo.dev"]._id,
        usersByEmail["zeynep.demir@demo.dev"]._id,
      ],
      applicationStatus: [
        {
          applicant: usersByEmail["demo.candidate@kariyerbul.dev"]._id,
          status: "reviewed",
          updatedAt: new Date(),
        },
        {
          applicant: usersByEmail["aylin.yilmaz@demo.dev"]._id,
          status: "accepted",
          updatedAt: new Date(),
        },
        {
          applicant: usersByEmail["zeynep.demir@demo.dev"]._id,
          status: "pending",
          updatedAt: new Date(),
        },
      ],
    },
    {
      company: primaryCompany._id,
      jobTitle: "Backend Developer",
      jobType: "Full-Time",
      location: "Remote",
      salary: 72000,
      vacancies: 1,
      experience: 4,
      detail: {
        desc:
          "Node.js tabanlı API servisleri, aday başvuru akışları ve güvenli veri modelleme üzerine çalışacak ekip arkadaşı arıyoruz.",
        requirements:
          "Node.js, Express, MongoDB, JWT, hata yönetimi, test yazma ve API performansı konularında deneyim.",
      },
      application: [
        usersByEmail["mert.kaya@demo.dev"]._id,
        usersByEmail["kaan.arslan@demo.dev"]._id,
      ],
      applicationStatus: [
        {
          applicant: usersByEmail["mert.kaya@demo.dev"]._id,
          status: "reviewed",
          updatedAt: new Date(),
        },
        {
          applicant: usersByEmail["kaan.arslan@demo.dev"]._id,
          status: "rejected",
          updatedAt: new Date(),
        },
      ],
    },
    {
      company: secondaryCompany._id,
      jobTitle: "Full Stack Engineer",
      jobType: "Contract",
      location: "Ankara / Uzaktan",
      salary: 78000,
      vacancies: 1,
      experience: 5,
      detail: {
        desc:
          "Finans ekipleri için analitik dashboard ve raporlama modülleri geliştirecek full stack engineer arıyoruz.",
        requirements:
          "React, Node.js, MongoDB, veri görselleştirme, güvenli API tasarımı ve ürün geliştirme deneyimi.",
      },
      application: [usersByEmail["demo.candidate@kariyerbul.dev"]._id],
      applicationStatus: [
        {
          applicant: usersByEmail["demo.candidate@kariyerbul.dev"]._id,
          status: "pending",
          updatedAt: new Date(),
        },
      ],
    },
    {
      company: secondaryCompany._id,
      jobTitle: "Product Designer",
      jobType: "Part-Time",
      location: "İzmir / Remote",
      salary: 42000,
      vacancies: 1,
      experience: 2,
      detail: {
        desc:
          "Kullanıcı araştırması, wireframe ve yüksek kaliteli SaaS arayüzleri tasarlayacak product designer arıyoruz.",
        requirements:
          "Figma, kullanıcı akışları, tasarım sistemleri ve geliştirici ekiplerle çalışma deneyimi.",
      },
      application: [usersByEmail["zeynep.demir@demo.dev"]._id],
      applicationStatus: [
        {
          applicant: usersByEmail["zeynep.demir@demo.dev"]._id,
          status: "accepted",
          updatedAt: new Date(),
        },
      ],
    },
  ]);

  primaryCompany.jobPosts = jobs
    .filter((job) => job.company.toString() === primaryCompany._id.toString())
    .map((job) => job._id);
  secondaryCompany.jobPosts = jobs
    .filter((job) => job.company.toString() === secondaryCompany._id.toString())
    .map((job) => job._id);

  await primaryCompany.save();
  await secondaryCompany.save();

  usersByEmail["demo.candidate@kariyerbul.dev"].savedJobs = [
    jobs[0]._id,
    jobs[2]._id,
  ];
  usersByEmail["aylin.yilmaz@demo.dev"].savedJobs = [jobs[1]._id];

  await usersByEmail["demo.candidate@kariyerbul.dev"].save();
  await usersByEmail["aylin.yilmaz@demo.dev"].save();
};

const seed = async () => {
  await connect();
  await clearDemoData();

  const companies = await createCompanies();
  const usersByEmail = await createUsers();
  await createJobs({ ...companies, usersByEmail });

  console.log("Demo verileri oluşturuldu.");
  console.log(`Şirket hesabı: demo.company@kariyerbul.dev / ${DEMO_PASSWORD}`);
  console.log(`Aday hesabı: demo.candidate@kariyerbul.dev / ${DEMO_PASSWORD}`);
};

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
