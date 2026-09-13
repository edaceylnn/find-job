import { getJobTypeLabel } from "../utils/translations";
import Select from "./Select";

const TYPES = ["Full-Time", "Part-Time", "Contract", "Intern"];
const TYPE_OPTIONS = TYPES.map((value) => ({
  value,
  label: getJobTypeLabel(value),
}));

export default function JobTypes({ jobTitle, setJobTitle }) {
  return <Select options={TYPE_OPTIONS} value={jobTitle} onChange={setJobTitle} />;
}
