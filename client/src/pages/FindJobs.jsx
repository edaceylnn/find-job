import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

import Header from "../components/Header";
import { experience, jobTypes } from "../utils/data";
import {
  CustomButton,
  EmptyState,
  JobCard,
  ListBox,
  Loading,
} from "../components";
import { apiRequest, updateUrl } from "../utils";
import { getJobTypeLabel } from "../utils/translations";

const FindJobs = () => {
  const [sort, setSort] = useState("Newest");
  const [page, setPage] = useState(1);
  const [numPage, setNumPage] = useState(1);
  const [recordCount, setRecordCount] = useState(0);
  const [data, setData] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [filterJobTypes, setFilterJobTypes] = useState([]);
  const [filterExp, setFilterExp] = useState([]);
  const [expVal, setExpVal] = useState([]);

  const [isFetching, setIsFetching] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const fetchJobs = async () => {
    setIsFetching(true);

    const newURL = updateUrl({
      pageNum: page,
      query: searchQuery,
      cmpLoc: jobLocation,
      sort: sort,
      navigate: navigate,
      location: location,
      jType: filterJobTypes,
      exp: filterExp,
    });

    try {
      const res = await apiRequest({
        url: "/jobs" + newURL,
        method: "GET",
      });

      setNumPage(res?.numOfPage);
      setRecordCount(res?.totalJobs);
      setData(res?.data);

      setIsFetching(false);
    } catch (error) {
      setIsFetching(false);
      console.log(error);
    }
  };

  const filterJobs = (val) => {
    if (filterJobTypes?.includes(val)) {
      setFilterJobTypes(filterJobTypes.filter((el) => el != val));
    } else {
      setFilterJobTypes([...filterJobTypes, val]);
    }
  };

  const filterExperience = async (e) => {
    if (expVal?.includes(e)) {
      setExpVal(expVal?.filter((el) => el != e));
    } else {
      setExpVal([...expVal, e]);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    await fetchJobs();
  };

  const handleShowMore = async (e) => {
    e.preventDefault();
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (expVal.length > 0) {
      let newExpVal = [];

      expVal?.map((el) => {
        const newEl = el?.split("-");
        newExpVal.push(Number(newEl[0]), Number(newEl[1]));
      });

      newExpVal?.sort((a, b) => a - b);

      setFilterExp(`${newExpVal[0]}-${newExpVal[newExpVal?.length - 1]}`);
    } else {
      setFilterExp("");
    }
  }, [expVal]);

  useEffect(() => {
    fetchJobs();
  }, [sort, filterJobTypes, filterExp, page, searchQuery, jobLocation]);

  return (
    <div>
      <Header
        title="Hayalindeki işi kolayca bul"
        type="home"
        handleClick={handleSearchSubmit}
        searchQuery={searchQuery}
        setSearchQuery={(value) => {
          setPage(1);
          setSearchQuery(value);
        }}
        location={jobLocation}
        setLocation={(value) => {
          setPage(1);
          setJobLocation(value);
        }}
      />

      <div className="container mx-auto flex flex-col gap-6 bg-white px-5 py-8 lg:flex-row 2xl:gap-10">
        <aside className="hidden h-fit rounded-xl border border-slate-100 bg-white p-5 shadow-sm lg:flex lg:w-72 lg:flex-col">
          <p className="text-lg font-semibold text-slate-700">Filtrele</p>

          <div className="py-2">
            <div className="flex justify-between mb-3">
              <p className="flex items-center gap-2 font-semibold">
                {/* <BiBriefcaseAlt2 /> */}
                İş türü
              </p>

              <button>
                <MdOutlineKeyboardArrowDown />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {jobTypes.map((jtype, index) => (
                <div key={index} className="flex gap-2 text-sm md:text-base ">
                  <input
                    type="checkbox"
                    value={jtype}
                    checked={filterJobTypes.includes(jtype)}
                    className="w-4 h-4 accent-blue-600"
                    onChange={(e) => filterJobs(e.target.value)}
                  />
                  <span>{getJobTypeLabel(jtype)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="py-2 mt-4">
            <div className="flex justify-between mb-3">
              <p className="flex items-center gap-2 font-semibold">
                {/* <BsStars /> */}
                Deneyim
              </p>

              <button>
                <MdOutlineKeyboardArrowDown />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {experience.map((exp) => (
                <div key={exp.title} className="flex gap-3">
                  <input
                    type="checkbox"
                    value={exp?.value}
                    checked={expVal.includes(exp?.value)}
                    className="w-4 h-4 accent-blue-600"
                    onChange={(e) => filterExperience(e.target.value)}
                  />
                  <span>{exp.title}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div className="w-full flex-1">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm md:text-base text-slate-600">
              <span className="font-semibold text-slate-900">
                {recordCount}
              </span>{" "}
              ilan bulundu
            </p>

            <div className="flex items-center gap-2">
              <ListBox sort={sort} setSort={setSort} />
            </div>
          </div>

          {!isFetching && data?.length === 0 ? (
            <EmptyState
              title="İlan bulunamadı"
              description="Arama kelimeni veya filtrelerini değiştirerek tekrar deneyebilirsin. Sana uygun yeni ilanlar eklendikçe burada görünecek."
              actionLabel="Filtreleri temizle"
              onAction={() => {
                setSearchQuery("");
                setJobLocation("");
                setFilterJobTypes([]);
                setExpVal([]);
                setFilterExp("");
                setPage(1);
                navigate("/find-jobs");
              }}
            />
          ) : (
            <div className="grid w-full gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {data?.map((job, index) => {
                const newJob = {
                  name: job?.company?.name,
                  logo: job?.company?.profileUrl,
                  ...job,
                };

                return <JobCard job={newJob} key={index} />;
              })}
            </div>
          )}

          {isFetching && (
            <div className="py-10">
              {" "}
              <Loading />{" "}
            </div>
          )}

          {numPage > page && !isFetching && (
            <div className="w-full flex items-center justify-center pt-16">
              <CustomButton
                onClick={handleShowMore}
                title="Daha fazla yükle"
                containerStyles="text-blue-600 py-2 px-6 focus:outline-none hover:bg-blue-700 hover:text-white rounded-full text-base border border-blue-600 transition"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindJobs;
