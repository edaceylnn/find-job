import { Link } from "react-router-dom";
import { FiArrowUpRight, FiBriefcase, FiMapPin, FiUsers } from "react-icons/fi";
import Card from "./Card";
import Avatar from "./Avatar";

const CompanyCard = ({ cmp }) => {
  const openRoles = cmp?.jobPosts?.length || 0;
  const teamSignal = Math.max(12, openRoles * 18);

  return (
    <Card
      interactive
      className="group flex w-full flex-col gap-4 border-slate-200/80 bg-white hover:bg-surface-subtle/70 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <Link to={`/company-profile/${cmp?._id}`}>
          <Avatar src={cmp?.profileUrl} alt={cmp?.name} size="md" shape="square" />
        </Link>
        <div className="flex min-w-0 flex-col">
          <Link
            to={`/company-profile/${cmp?._id}`}
            className="truncate text-base font-semibold text-textPrimary"
          >
            {cmp?.name}
          </Link>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-textSecondary">
            <span className="inline-flex items-center gap-1">
              <FiMapPin className="text-primary" />
              {cmp?.location || "Konum yok"}
            </span>
            <span className="inline-flex items-center gap-1">
              <FiUsers className="text-primary" />
              {teamSignal}+ çalışan
            </span>
            <span className="inline-flex items-center gap-1 font-medium text-primary">
              <FiBriefcase />
              {openRoles} açık pozisyon
            </span>
          </div>
        </div>
      </div>

      <Link
        to={`/company-profile/${cmp?._id}`}
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center self-end rounded-control border border-border-control text-textSecondary transition hover:border-primary hover:bg-primary-subtle hover:text-primary sm:self-center"
        aria-label={`${cmp?.name} şirket profilini aç`}
      >
        <FiArrowUpRight />
      </Link>
    </Card>
  );
};

export default CompanyCard;
