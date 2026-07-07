const charGroups = [
  "aAâÂ",
  "cCçÇ",
  "gGğĞ",
  "iIıİ",
  "oOöÖ",
  "sSşŞ",
  "uUüÜ",
];

const escapeRegexChar = (char) => char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const createSearchRegex = (value) => {
  if (!value) return "";

  const pattern = value
    .trim()
    .split("")
    .map((char) => {
      if (/\s/.test(char)) return "\\s+";

      const group = charGroups.find((chars) => chars.includes(char));

      if (group) {
        return `[${group}]`;
      }

      return escapeRegexChar(char);
    })
    .join("");

  return pattern;
};
