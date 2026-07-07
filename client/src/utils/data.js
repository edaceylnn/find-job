import {
    WhatsApp,
    Twitter,
    Instagram,
    Spotify,
    Linkedin,
    Youtube,
    Google,
    Facebook,
    CodeWave,
  } from "../assets";
  
  export const jobTypes = ["Full-Time", "Part-Time", "ContracT", "Intern"];

  // export const jobTypes = [
  //   { title: "Full-Time", value: "Full-Time" },
  //   { title: "Part-Time", value: "Part-Time" },
  //   { title: "ContracT", value: "ContracT" },
  //   { title: "Intern", value: "Intern" },
  // ];
  
  export const experience = [
    { title: "1 yıldan az", value: "0-1" },
    { title: "1 - 2 yıl", value: "1-2" },
    { title: "2 - 6 yıl", value: "2-6" },
    { title: "6 yıl ve üzeri", value: "6-20" },
  ];
  
  export const popularSearch = [
    "Yazılım mühendisi",
    "Geliştirici",
    "Full-stack geliştirici",
    "Veri bilimci",
    "Uzaktan",
    "Tam zamanlı",
    "Satış",
    "Ofis asistanı",
  ];
  
  export const jobs = [
    {
      id: "1",
      company: {
        name: "Microsoft Corporation",
        location: "Kaliforniya",
        email: "support@microsoft.com",
        contact: "support@microsoft",
        about:
          "KariyerBul demo verisi olarak hazırlanan bu açıklama, şirketin çalışma kültürünü ve pozisyonun temel beklentilerini özetler.",
        profileUrl: Twitter,
      },
      jobTitle: "Yazılım Mühendisi",
      location: "İstanbul",
      jobType: "Full-Time",
      salary: "1200",
      detail: [
        {
          desc: "KariyerBul demo verisi olarak hazırlanan bu açıklama, şirketin çalışma kültürünü ve pozisyonun temel beklentilerini özetler.",
  
          requirement:
            "KariyerBul demo verisi olarak hazırlanan bu açıklama, şirketin çalışma kültürünü ve pozisyonun temel beklentilerini özetler.",
        },
      ],
      applicants: ["1", "2", "3", "4"],
      vacancies: 25,
      createdAt: new Date(),
    },
    {
      id: "2",
      company: {
        name: "Google Corporation",
        location: "Kaliforniya",
        email: "support@google.com",
        contact: "support@google",
        about:
          "KariyerBul demo verisi olarak hazırlanan bu açıklama, şirketin çalışma kültürünü ve pozisyonun temel beklentilerini özetler.",
        profileUrl: Google,
      },
      jobTitle: "Sistem Analisti",
      location: "Ankara",
      jobType: "Full-Time",
      salary: "1200",
      detail: [
        {
          desc: "KariyerBul demo verisi olarak hazırlanan bu açıklama, şirketin çalışma kültürünü ve pozisyonun temel beklentilerini özetler.",
  
          requirement:
            "KariyerBul demo verisi olarak hazırlanan bu açıklama, şirketin çalışma kültürünü ve pozisyonun temel beklentilerini özetler.",
        },
      ],
      applicants: ["1", "2", "3", "4"],
      vacancies: 25,
      createdAt: new Date(),
    },
    {
      id: "3",
      company: {
        name: "LinkedIn Corporation",
        location: "Berlin",
        email: "support@microsoft.com",
        contact: "support@microsoft",
        about:
          "KariyerBul demo verisi olarak hazırlanan bu açıklama, şirketin çalışma kültürünü ve pozisyonun temel beklentilerini özetler.",
        profileUrl: Linkedin,
      },
      jobTitle: "Sosyal Medya Yöneticisi",
      location: "Mumbai",
      jobType: "Full-Time",
      salary: "1200",
      detail: [
        {
          desc: "KariyerBul demo verisi olarak hazırlanan bu açıklama, şirketin çalışma kültürünü ve pozisyonun temel beklentilerini özetler.",
  
          requirement:
            "KariyerBul demo verisi olarak hazırlanan bu açıklama, şirketin çalışma kültürünü ve pozisyonun temel beklentilerini özetler.",
        },
      ],
      applicants: ["1", "2", "3", "4"],
      vacancies: 25,
      createdAt: new Date(),
    },
    {
      id: "4",
      company: {
        name: "Spotify Corporation",
        location: "Berlin",
        email: "support@microsoft.com",
        contact: "support@microsoft",
        about:
          "KariyerBul demo verisi olarak hazırlanan bu açıklama, şirketin çalışma kültürünü ve pozisyonun temel beklentilerini özetler.",
        profileUrl: Spotify,
      },
      jobTitle: "CFO",
      location: "Oslo",
      jobType: "Full-Time",
      salary: "1200",
      detail: [
        {
          desc: "KariyerBul demo verisi olarak hazırlanan bu açıklama, şirketin çalışma kültürünü ve pozisyonun temel beklentilerini özetler.",
  
          requirement:
            "KariyerBul demo verisi olarak hazırlanan bu açıklama, şirketin çalışma kültürünü ve pozisyonun temel beklentilerini özetler.",
        },
      ],
      applicants: ["1", "2", "3", "4"],
      vacancies: 25,
      createdAt: new Date(),
    },
    {
      id: "5",
      company: {
        name: "Facebook Corporation",
        location: "Berlin",
        email: "support@microsoft.com",
        contact: "support@microsoft",
        about:
          "KariyerBul demo verisi olarak hazırlanan bu açıklama, şirketin çalışma kültürünü ve pozisyonun temel beklentilerini özetler.",
        profileUrl: Facebook,
      },
      jobTitle: "CFO",
      location: "Oslo",
      jobType: "Full-Time",
      salary: "1200",
      detail: [
        {
          desc: "KariyerBul demo verisi olarak hazırlanan bu açıklama, şirketin çalışma kültürünü ve pozisyonun temel beklentilerini özetler.",
  
          requirement:
            "KariyerBul demo verisi olarak hazırlanan bu açıklama, şirketin çalışma kültürünü ve pozisyonun temel beklentilerini özetler.",
        },
      ],
      applicants: ["1", "2", "3", "4"],
      vacancies: 25,
      createdAt: new Date(),
    },
    {
      id: "6",
      company: {
        name: "WhatsApp Corporation",
        location: "Berlin",
        email: "support@microsoft.com",
        contact: "support@microsoft",
        about:
          "KariyerBul demo verisi olarak hazırlanan bu açıklama, şirketin çalışma kültürünü ve pozisyonun temel beklentilerini özetler.",
        profileUrl: WhatsApp,
      },
      jobTitle: "Ürün Yöneticisi",
      location: "Oslo",
      jobType: "Full-Time",
      salary: "1200",
      detail: [
        {
          desc: "KariyerBul demo verisi olarak hazırlanan bu açıklama, şirketin çalışma kültürünü ve pozisyonun temel beklentilerini özetler.",
  
          requirement:
            "KariyerBul demo verisi olarak hazırlanan bu açıklama, şirketin çalışma kültürünü ve pozisyonun temel beklentilerini özetler.",
        },
      ],
      applicants: ["1", "2", "3", "4"],
      vacancies: 25,
      createdAt: new Date(),
    },
    {
      id: "7",
      company: {
        name: "Instagram Corporation",
        location: "Berlin",
        email: "support@microsoft.com",
        contact: "support@microsoft",
        about:
          "KariyerBul demo verisi olarak hazırlanan bu açıklama, şirketin çalışma kültürünü ve pozisyonun temel beklentilerini özetler.",
        profileUrl: Instagram,
      },
      jobTitle: "Ürün Yöneticisi",
      location: "Oslo",
      jobType: "Full-Time",
      salary: "1200",
      detail: [
        {
          desc: "KariyerBul demo verisi olarak hazırlanan bu açıklama, şirketin çalışma kültürünü ve pozisyonun temel beklentilerini özetler.",
  
          requirement:
            "KariyerBul demo verisi olarak hazırlanan bu açıklama, şirketin çalışma kültürünü ve pozisyonun temel beklentilerini özetler.",
        },
      ],
      applicants: ["1", "2", "3", "4"],
      vacancies: 25,
      createdAt: new Date(),
    },
    {
      id: "8",
      company: {
        name: "Youtube Corporation",
        location: "Berlin",
        email: "support@microsoft.com",
        contact: "support@microsoft",
        about:
          "KariyerBul demo verisi olarak hazırlanan bu açıklama, şirketin çalışma kültürünü ve pozisyonun temel beklentilerini özetler.",
        profileUrl: Youtube,
      },
      jobTitle: "Ürün Yöneticisi",
      location: "Oslo",
      jobType: "Full-Time",
      salary: "1200",
      detail: [
        {
          desc: "KariyerBul demo verisi olarak hazırlanan bu açıklama, şirketin çalışma kültürünü ve pozisyonun temel beklentilerini özetler.",
  
          requirement:
            "KariyerBul demo verisi olarak hazırlanan bu açıklama, şirketin çalışma kültürünü ve pozisyonun temel beklentilerini özetler.",
        },
      ],
      applicants: ["1", "2", "3", "4"],
      vacancies: 25,
      createdAt: new Date(),
    },
    {
      id: "9",
      company: {
        name: "CodeWave Solutions",
        location: "India",
        email: "support@microsoft.com",
        contact: "support@microsoft",
        about:
          "KariyerBul demo verisi olarak hazırlanan bu açıklama, şirketin çalışma kültürünü ve pozisyonun temel beklentilerini özetler.",
        profileUrl: CodeWave,
      },
      jobTitle: "Abonelik Uzmanı",
      location: "Oslo",
      jobType: "Full-Time",
      salary: "1200",
      detail: [
        {
          desc: "KariyerBul demo verisi olarak hazırlanan bu açıklama, şirketin çalışma kültürünü ve pozisyonun temel beklentilerini özetler.",
  
          requirement:
            "KariyerBul demo verisi olarak hazırlanan bu açıklama, şirketin çalışma kültürünü ve pozisyonun temel beklentilerini özetler.",
        },
      ],
      applicants: ["1", "2", "3", "4"],
      vacancies: 25,
      createdAt: new Date(),
    },
  ];
  
  export const footerLinks = [
    {
      id: "01",
      title: "Keşfet",
      links: [
        { label: "İş Bul", to: "/find-jobs" },
        { label: "Şirketler", to: "/companies" },
        { label: "Hakkımızda", to: "/about-us" },
      ],
    },
    {
      id: "02",
      title: "Hesap",
      links: [
        { label: "Profilim", to: "/user-profile" },
        { label: "Başvurularım", to: "/applications" },
        { label: "İlan yayınla", to: "/upload-job" },
      ],
    },
    {
      id: "03",
      title: "Destek",
      links: [
        { label: "İletişim", to: "/about-us" },
        { label: "Geri bildirim", to: "/about-us" },
        { label: "Erişilebilirlik", to: "/about-us" },
      ],
    },
  ];
  
  export const companies = [
    {
      _id: 1,
      name: "Microsoft Corporation",
      location: "Kaliforniya",
      email: "support@microsoft.com",
      contact: "support@microsoft",
      about:
        "KariyerBul demo verisi olarak hazırlanan bu açıklama, şirketin çalışma kültürünü ve pozisyonun temel beklentilerini özetler.",
      profileUrl: Twitter,
      jobPosts: ["1", "2"],
    },
    {
      _id: 2,
      name: "Google Corporation",
      location: "Kaliforniya",
      email: "support@google.com",
      contact: "support@google",
      about:
        "KariyerBul demo verisi olarak hazırlanan bu açıklama, şirketin çalışma kültürünü ve pozisyonun temel beklentilerini özetler.",
      profileUrl: Google,
      jobPosts: ["1", "2"],
    },
    {
      _id: 3,
      name: "LinkedIn Corporation",
      location: "Berlin",
      email: "support@microsoft.com",
      contact: "support@microsoft",
      about:
        "KariyerBul demo verisi olarak hazırlanan bu açıklama, şirketin çalışma kültürünü ve pozisyonun temel beklentilerini özetler.",
      profileUrl: Linkedin,
      jobPosts: ["1", "2"],
    },
    {
      _id: 4,
      name: "Spotify Corporation",
      location: "Berlin",
      email: "support@microsoft.com",
      contact: "support@microsoft",
      about:
        "KariyerBul demo verisi olarak hazırlanan bu açıklama, şirketin çalışma kültürünü ve pozisyonun temel beklentilerini özetler.",
      profileUrl: Spotify,
      jobPosts: ["1", "2"],
    },
    {
      _id: 5,
      name: "Facebook Corporation",
      location: "Berlin",
      email: "support@microsoft.com",
      contact: "support@microsoft",
      about:
        "KariyerBul demo verisi olarak hazırlanan bu açıklama, şirketin çalışma kültürünü ve pozisyonun temel beklentilerini özetler.",
      profileUrl: Facebook,
      jobPosts: ["1", "2"],
    },
    {
      _id: 6,
      name: "WhatsApp Corporation",
      location: "Berlin",
      email: "support@microsoft.com",
      contact: "support@microsoft",
      about:
        "KariyerBul demo verisi olarak hazırlanan bu açıklama, şirketin çalışma kültürünü ve pozisyonun temel beklentilerini özetler.",
      profileUrl: WhatsApp,
      jobPosts: ["1", "2"],
    },
    {
      _id: 7,
      name: "Instagram Corporation",
      location: "India",
      email: "support@microsoft.com",
      contact: "support@microsoft",
      about:
        "KariyerBul demo verisi olarak hazırlanan bu açıklama, şirketin çalışma kültürünü ve pozisyonun temel beklentilerini özetler.",
      profileUrl: Instagram,
      jobPosts: ["1", "2"],
    },
    {
      _id: 8,
      name: "Youtube Corporation",
      location: "Berlin",
      email: "support@microsoft.com",
      contact: "support@microsoft",
      about:
        "KariyerBul demo verisi olarak hazırlanan bu açıklama, şirketin çalışma kültürünü ve pozisyonun temel beklentilerini özetler.",
      profileUrl: Youtube,
      jobPosts: ["1", "2"],
    },
    {
      _id: 9,
      name: "CodeWave Solutions",
      location: "Ghana",
      email: "support@microsoft.com",
      contact: "support@microsoft",
      about:
        "KariyerBul demo verisi olarak hazırlanan bu açıklama, şirketin çalışma kültürünü ve pozisyonun temel beklentilerini özetler.",
      profileUrl: CodeWave,
      jobPosts: ["1", "2"],
    },
  ];
  
  export const users = [
    {
      name: "Google Corporation",
      location: "Kaliforniya",
      email: "support@google.com",
      contact: "support@google",
      about:
        "KariyerBul demo verisi olarak hazırlanan bu açıklama, şirketin çalışma kültürünü ve pozisyonun temel beklentilerini özetler.",
      profileUrl: Google,
      jobPosts: ["1", "2"],
      token: "gjhsdgsjgdjh",
    },
    {
      firstName: "CodeWaver",
      lastName: "Solutions",
      email: "support@code.com",
      contact: "support@google",
      about:
        "KariyerBul demo verisi olarak hazırlanan bu açıklama, şirketin çalışma kültürünü ve pozisyonun temel beklentilerini özetler.",
      profileUrl: CodeWave,
      accountType: "seeker",
      cvUrl: "",
      token: "gjhsdgsjgdjh",
    },
  ];
