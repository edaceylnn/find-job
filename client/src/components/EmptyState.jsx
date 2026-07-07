import { FiInbox } from "react-icons/fi";
import CustomButton from "./CustomButton";

const EmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className = "",
}) => {
  return (
    <div
      className={`flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-blue-200 bg-blue-50/50 px-6 py-12 text-center ${className}`}
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl text-blue-600 shadow-sm shadow-blue-900/10">
        {icon || <FiInbox />}
      </div>
      <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>

      {actionLabel && onAction && (
        <CustomButton
          title={actionLabel}
          onClick={onAction}
          containerStyles="mt-6 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white outline-none transition hover:bg-blue-700"
        />
      )}
    </div>
  );
};

export default EmptyState;
