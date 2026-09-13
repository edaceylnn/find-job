const TONE_CLASSES = {
  primary: "bg-primary-subtle text-primary-hover",
  neutral: "bg-slate-100 text-slate-600",
  success: "bg-success-subtle text-emerald-700",
  danger: "bg-danger-subtle text-rose-700",
  warning: "bg-warning-subtle text-amber-700",
};

const SIZE_CLASSES = {
  sm: "px-2.5 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
};

const Badge = ({ children, tone = "neutral", size = "md", className = "" }) => {
  return (
    <span
      className={`inline-flex w-fit items-center rounded-control font-semibold ${TONE_CLASSES[tone]} ${SIZE_CLASSES[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
