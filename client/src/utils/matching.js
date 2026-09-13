const normalizeText = (value) =>
  String(value || "")
    .toLocaleLowerCase("tr-TR")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

const getTerms = (value) =>
  normalizeText(value)
    .split(" ")
    .filter((term) => term.length >= 3);

const countTermMatches = (terms, text) =>
  terms.reduce((count, term) => count + (text.includes(term) ? 1 : 0), 0);

export const calculateJobMatchScore = (job, user) => {
  if (!job || user?.accountType !== "seeker") return null;

  const titleTerms = getTerms(user?.jobTitle);
  const aboutTerms = getTerms(user?.about).slice(0, 12);
  const location = normalizeText(user?.location);
  const jobTitle = normalizeText(job?.jobTitle);
  const jobLocation = normalizeText(job?.location);
  const jobType = normalizeText(job?.jobType);
  const jobDetails = normalizeText(
    `${job?.detail?.[0]?.desc || ""} ${job?.detail?.[0]?.requirements || ""}`
  );
  const searchableJobText = `${jobTitle} ${jobLocation} ${jobType} ${jobDetails}`;

  let score = 52;

  if (titleTerms.length) {
    const titleMatches = countTermMatches(titleTerms, `${jobTitle} ${jobDetails}`);
    score += Math.min(24, titleMatches * 8);
  }

  if (aboutTerms.length) {
    const profileMatches = countTermMatches(aboutTerms, searchableJobText);
    score += Math.min(14, profileMatches * 2);
  }

  if (location && jobLocation) {
    if (jobLocation.includes(location) || location.includes(jobLocation)) {
      score += 12;
    } else if (jobLocation.includes("remote") || jobLocation.includes("uzaktan")) {
      score += 8;
    }
  }

  if (!titleTerms.length && !aboutTerms.length && !location) {
    score = 72;
  }

  return Math.max(48, Math.min(98, score));
};

export const attachJobMatchScores = (jobs, user) =>
  (jobs || []).map((job) => ({
    ...job,
    matchScore: calculateJobMatchScore(job, user),
  }));
