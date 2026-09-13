import { GoLocation } from "react-icons/go";
import { LiaMoneyCheckAltSolid } from "react-icons/lia";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { FiArrowUpRight, FiCheckCircle, FiClock, FiShield } from "react-icons/fi";
import { Link } from "react-router-dom";
import Card from "./Card";
import Avatar from "./Avatar";
import Badge from "./Badge";
import IconButton from "./IconButton";
import {
  formatRelativeTime,
  formatSalary,
  getJobTypeLabel,
} from "../utils/translations";

const JobCard = ({
  job,
  isSaved,
  onToggleSave,
  variant = "grid",
  statusLabel,
  statusTone = "neutral",
  meta,
  matchScore,
  matchReasons = [],
}) => {
  const scoreSeed = (job?.jobTitle?.length || 8) + (job?.location?.length || 4);
  const displayMatchScore = matchScore ?? 72 + (scoreSeed % 24);
  const isCompact = variant === "compact";
  const isApplication = variant === "application";
  const initials = (job?.name || job?.jobTitle || "KB")
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const handleToggleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleSave?.(job?._id);
  };

  return (
    <Link to={`/job-detail/${job?._id}`} className="block h-full">
      <Card
        interactive
        className={`group relative flex h-full w-full overflow-hidden border-slate-200 bg-white transition hover:border-primary-subtle-active ${
          isCompact ? "min-h-[12rem]" : "min-h-[15rem]"
        }`}
      >
        {onToggleSave && (
          <IconButton
            icon={isSaved ? <BsBookmarkFill /> : <BsBookmark />}
            label={isSaved ? "İlanı kaydedilenlerden çıkar" : "İlanı kaydet"}
            title={isSaved ? "Kaydedilenlerden çıkar" : "Kaydet"}
            variant="solid"
            size="md"
            onClick={handleToggleSave}
            className="absolute right-3 top-3 z-10 border border-slate-200"
          />
        )}

        <div className="flex h-full w-full flex-col justify-between">
          <div className={`flex gap-3 ${onToggleSave ? "pr-10" : ""}`}>
            <Avatar
              src={job?.logo}
              alt={job?.name}
              size={isCompact ? "md" : "lg"}
              shape="square"
              ring
              fallback={
                <span className="text-sm font-semibold text-primary">
                  {initials}
                </span>
              }
              className="bg-slate-100"
            />

            <div className="flex min-w-0 flex-1 flex-col justify-center">
              <p
                className={`line-clamp-2 font-semibold text-textPrimary ${
                  isCompact ? "text-sm leading-5" : "text-base leading-6"
                }`}
              >
                {job?.jobTitle}
              </p>
              <span className="mt-1 truncate text-sm font-medium text-primary">
                {job?.name || "Şirket bilgisi yakında"}
              </span>
              <span className="mt-1 flex items-center gap-1 text-sm text-textSecondary">
                <GoLocation className="shrink-0 text-textSecondary" />
                {job?.location}
              </span>
            </div>
          </div>

          {statusLabel && (
            <div className="mt-4">
              <Badge tone={statusTone}>{statusLabel}</Badge>
            </div>
          )}

          <div className={isCompact ? "py-3" : "py-4"}>
            <p className={`${isCompact ? "line-clamp-2" : "line-clamp-3"} text-sm leading-6 text-textSecondary`}>
              {job?.detail?.[0]?.desc || "Bu ilan için henüz açıklama eklenmedi."}
            </p>
          </div>

          {!isCompact && (
            <div className="grid gap-3 rounded-card border border-slate-100 bg-surface-subtle p-3 md:grid-cols-[auto_1fr] md:items-center">
              <div
                title="Deneyim, konum ve yeteneklerinle eşleşme oranı"
                className="flex w-fit shrink-0 items-center gap-2 rounded-control bg-white px-3 py-2 text-sm font-semibold text-primary shadow-card"
              >
                <FiShield className="shrink-0" />
                %{displayMatchScore} uyum
              </div>

              <div className="flex flex-wrap gap-2">
                {matchReasons.slice(0, 3).map((reason) => (
                  <span
                    key={reason}
                    className="inline-flex items-center gap-1 rounded-control bg-white px-3 py-1.5 text-xs font-medium text-textSecondary shadow-card"
                  >
                    <FiCheckCircle className="text-success" />
                    {reason}
                  </span>
                ))}
              </div>
            </div>
          )}

          {isCompact && (
            <div className="flex flex-wrap gap-2">
              <span className="flex items-center gap-1 rounded-control bg-surface-subtle px-3 py-1.5 text-xs font-medium text-textPrimary">
                <LiaMoneyCheckAltSolid className="shrink-0 text-primary" />
                {formatSalary(job?.salary)} TL
              </span>
              <span className="flex items-center gap-1 rounded-control bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                <FiShield className="shrink-0" />
                %{displayMatchScore}
              </span>
            </div>
          )}

          <div className={`${isCompact ? "mt-4 border-t border-border pt-4" : "mt-3 border-t border-slate-100 pt-3"} flex items-center justify-between gap-3`}>
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <Badge tone={isCompact ? "primary" : "neutral"}>
                {getJobTypeLabel(job?.jobType)}
              </Badge>
              {!isCompact && (
                <span className="flex min-w-0 items-center gap-1 text-sm font-semibold text-textPrimary">
                  <LiaMoneyCheckAltSolid className="shrink-0 text-primary" />
                  <span className="truncate">{formatSalary(job?.salary)} TL</span>
                </span>
              )}
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 text-sm text-textSecondary">
              <FiClock className="shrink-0" />
              {meta ||
                (isApplication ? "Başvuru takipte" : formatRelativeTime(job?.createdAt))}
            </span>
            <FiArrowUpRight className="text-lg text-primary opacity-0 transition group-hover:opacity-100" />
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default JobCard;
