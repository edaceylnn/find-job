export const sortLabels = {
  Newest: "En yeni",
  Oldest: "En eski",
  "A-Z": "A-Z",
  "Z-A": "Z-A",
};

export const jobTypeLabels = {
  "Full-Time": "Tam zamanlı",
  "Part-Time": "Yarı zamanlı",
  Contract: "Sözleşmeli",
  ContracT: "Sözleşmeli",
  Intern: "Staj",
};

export const getJobTypeLabel = (type) => jobTypeLabels[type] || type || "-";

export const applicationStatusLabels = {
  pending: "Başvuru alındı",
  reviewed: "Değerlendiriliyor",
  accepted: "Olumlu",
  rejected: "Olumsuz",
};

export const getApplicationStatusLabel = (status) =>
  applicationStatusLabels[status] || "Başvuru alındı";

export const formatRelativeTime = (date) => {
  if (!date) return "";

  const timestamp = new Date(date).getTime();

  if (Number.isNaN(timestamp)) return "";

  const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));

  const units = [
    { limit: 60, value: 1, singular: "saniye", plural: "saniye" },
    { limit: 3600, value: 60, singular: "dakika", plural: "dakika" },
    { limit: 86400, value: 3600, singular: "saat", plural: "saat" },
    { limit: 2592000, value: 86400, singular: "gün", plural: "gün" },
    { limit: 31536000, value: 2592000, singular: "ay", plural: "ay" },
    { limit: Infinity, value: 31536000, singular: "yıl", plural: "yıl" },
  ];

  const unit = units.find((item) => seconds < item.limit);
  const amount = Math.max(1, Math.floor(seconds / unit.value));
  const label = amount === 1 ? unit.singular : unit.plural;

  return `${amount} ${label} önce`;
};

export const formatSalary = (salary) => {
  const salaryNumber = Number(salary);

  if (Number.isNaN(salaryNumber)) return salary || "-";

  return salaryNumber.toLocaleString("tr-TR");
};
