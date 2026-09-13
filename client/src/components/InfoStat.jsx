const TONE_CLASSES = {
  neutral: "bg-slate-50",
  success: "bg-success-subtle",
  info: "bg-sky-50",
  accent: "bg-rose-50",
};

const InfoStat = ({ icon, label, value, tone = "neutral", className = "" }) => {
  return (
    <div
      className={`flex h-20 flex-col items-center justify-center gap-0.5 rounded-card px-4 ${TONE_CLASSES[tone]} ${className}`}
    >
      {icon}
      <span className="text-sm text-textSecondary">{label}</span>
      <p className="text-base font-semibold text-textPrimary">{value}</p>
    </div>
  );
};

export default InfoStat;
