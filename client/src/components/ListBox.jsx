import { sortLabels } from "../utils/translations";
import Select from "./Select";

const SORT_OPTIONS = ["Newest", "Oldest", "A-Z", "Z-A"].map((value) => ({
  value,
  label: sortLabels[value] || value,
}));

const ListBox = ({ sort, setSort }) => {
  return (
    <Select
      options={SORT_OPTIONS}
      value={sort}
      onChange={setSort}
      className="w-[9rem] md:w-[10rem]"
    />
  );
};

export default ListBox;
