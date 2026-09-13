import { IoCloseCircle } from "react-icons/io5";
import IconButton from "./IconButton";

const SearchInput = ({ placeholder, icon, value, setValue, className = "" }) => {
  return (
    <div
      className={`flex h-12 w-full items-center gap-2 rounded-card border border-slate-200 bg-white px-4 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 ${className}`}
    >
      {icon}

      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type="text"
        className="w-full bg-transparent text-sm text-textPrimary outline-none placeholder:text-slate-400 md:text-base"
        placeholder={placeholder}
      />

      {value && (
        <IconButton
          icon={<IoCloseCircle className="text-xl" />}
          label={`${placeholder} alanını temizle`}
          size="sm"
          onClick={() => setValue("")}
        />
      )}
    </div>
  );
};

export default SearchInput;
