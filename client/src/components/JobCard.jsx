import { GoLocation } from "react-icons/go";
import { LiaMoneyCheckAltSolid } from 'react-icons/lia';
import { Link } from "react-router-dom";
import {
  formatRelativeTime,
  formatSalary,
  getJobTypeLabel,
} from "../utils/translations";

const JobCard = ({ job }) => {


  return (
    <Link to={`/job-detail/${job?._id}`} className="block h-full">
      <div
        className="flex h-full min-h-[17rem] w-full flex-col justify-between rounded-xl border border-slate-100 bg-white px-4 py-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
      >
        <div className="w-full h-full flex flex-col justify-between">
          <div className="flex gap-3">
            <img
              src={job?.logo}
              alt={job?.name}
              className="h-14 w-14 rounded-lg object-cover"
            />

            <div className="min-w-0 flex flex-col justify-center">
              <p className="line-clamp-2 text-lg font-semibold leading-6 text-slate-800">
                {job?.jobTitle}
              </p>
              <span className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                <GoLocation className="shrink-0 text-slate-500" />
                {job?.location}
              </span>
            </div>
          </div>

          <div className="py-3">
            <p className="line-clamp-3 text-sm leading-6 text-slate-600">
              {job?.detail?.[0]?.desc || "Bu ilan için henüz açıklama eklenmedi."}
            </p>
          </div>

          {/* bg-[#1d4fd826] text-[#1d4fd8] */}

          <div className="flex items-center">
         
            <span className="flex items-center gap-1 text-sm font-medium text-slate-700">
            <LiaMoneyCheckAltSolid className="text-slate-900" />

                {formatSalary(job?.salary)} TL
              </span>
          </div>

          <div className="flex items-center justify-between">
            <p className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
              {getJobTypeLabel(job?.jobType)}
            </p>

            <span className='text-gray-500 text-sm'>
            {/* {job?.createdAt.toString().split('T')[0]} */}
            {formatRelativeTime(job?.createdAt)}
          </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
