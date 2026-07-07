import { Link } from "react-router-dom";

const CompanyCard = ({ cmp }) => {
  return (
    <div className='flex w-full items-center justify-between gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm'>
      <div className='flex min-w-0 flex-1 items-center gap-4'>
        <Link to={`/company-profile/${cmp?._id}`}>
          <img
            src={cmp?.profileUrl}
            alt={cmp?.name}
            className='h-12 w-12 rounded-lg object-cover'
          />
        </Link>
        <div className='flex min-w-0 flex-col'>
          <Link
            to={`/company-profile/${cmp?._id}`}
            className='text-base md:text-lg font-semibold text-gray-600 truncate'
          >
            {cmp?.name}
          </Link>
          <span className='truncate text-sm text-blue-600'>{cmp?.email}</span>
        </div>
      </div>

      <div className='hidden w-1/4 h-full md:flex items-center'>
        <p className='text-base text-start'>{cmp?.location}</p>
      </div>

      <div className='flex min-w-[72px] flex-col items-center'>
        <p className='text-blue-600 font-semibold'>{cmp?.jobPosts?.length}</p>
        <span className='text-xs md:base font-normal text-gray-600'>
          İlan
        </span>
      </div>
    </div>
  );
};

export default CompanyCard;
