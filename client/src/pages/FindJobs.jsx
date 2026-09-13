import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiSearch,
  FiSliders,
  FiTarget,
  FiX,
} from "react-icons/fi";
import toast from "react-hot-toast";

import Header from "../components/Header";
import { experience, jobTypes } from "../utils/data";
import {
  Button,
  Card,
  EmptyState,
  JobCard,
  ListBox,
  Loading,
} from "../components";
import { apiRequest, updateUrl } from "../utils";
import { useDebounce } from "../utils/useDebounce";
import { getJobTypeLabel } from "../utils/translations";
import { Login } from "../redux/userSlice";
import { attachJobMatchScores } from "../utils/matching";

const FindJobs = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

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
  const [smartMatchEnabled, setSmartMatchEnabled] = useState(true);

  const [isFetching, setIsFetching] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 400);
  const debouncedJobLocation = useDebounce(jobLocation, 400);
  const canUseSmartMatch = user?.accountType === "seeker";
  const activeFilterCount =
    filterJobTypes.length + expVal.length + (searchQuery ? 1 : 0) + (jobLocation ? 1 : 0);

  const location = useLocation();
  const navigate = useNavigate();
  const matchedJobs = useMemo(() => {
    const jobsWithScores = attachJobMatchScores(data, user);

    if (!smartMatchEnabled || !canUseSmartMatch) {
      return jobsWithScores;
    }

    return [...jobsWithScores].sort(
      (a, b) => (b.matchScore || 0) - (a.matchScore || 0)
    );
  }, [canUseSmartMatch, data, smartMatchEnabled, user]);

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
      setData((prev) =>
        page === 1 ? res?.data ?? [] : [...(prev ?? []), ...(res?.data ?? [])]
      );

      setIsFetching(false);
    } catch (error) {
      setIsFetching(false);
      console.log(error);
    }
  };

  const filterJobs = (val) => {
    setPage(1);
    if (filterJobTypes?.includes(val)) {
      setFilterJobTypes(filterJobTypes.filter((el) => el != val));
    } else {
      setFilterJobTypes([...filterJobTypes, val]);
    }
  };

  const filterExperience = async (e) => {
    setPage(1);
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

  const clearFilters = () => {
    setSearchQuery("");
    setJobLocation("");
    setFilterJobTypes([]);
    setExpVal([]);
    setFilterExp("");
    setPage(1);
    navigate("/find-jobs");
  };

  const handleToggleSaveJob = async (jobId) => {
    if (!user?.token) {
      toast.error("İlan kaydetmek için giriş yapmalısın.");
      return;
    }

    try {
      const res = await apiRequest({
        url: "/jobs/save-job/" + jobId,
        token: user?.token,
        method: "POST",
      });

      if (res?.success) {
        const updatedUser = { ...user, savedJobs: res.savedJobs };
        dispatch(Login(updatedUser));
        localStorage.setItem("userInfo", JSON.stringify(updatedUser));
        toast.success(res.message);
      } else {
        toast.error(res?.message || "İşlem sırasında bir hata oluştu.");
      }
    } catch (error) {
      console.log(error);
      toast.error("İşlem sırasında bir hata oluştu.");
    }
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
  }, [
    sort,
    filterJobTypes,
    filterExp,
    page,
    debouncedSearchQuery,
    debouncedJobLocation,
  ]);

  return (
    <div>
      <Header
        title="Sana uygun iş fırsatlarını keşfet"
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

      <div className="mx-auto flex w-full max-w-container flex-col gap-5 px-4 py-6 sm:px-6 lg:flex-row lg:px-8">
        <Card
          as="aside"
          className="hidden h-fit border-slate-200 bg-white/95 p-5 shadow-panel lg:sticky lg:top-24 lg:flex lg:w-72 lg:flex-col"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="flex items-center gap-2 text-base font-semibold text-textPrimary">
                <FiSliders className="text-primary" />
                Keşif paneli
              </p>
              <p className="mt-1 text-sm text-textSecondary">
                {activeFilterCount || "0"} filtre aktif
              </p>
            </div>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-medium text-danger hover:text-danger-hover"
              >
                Tümünü temizle
              </button>
            )}
          </div>

          {canUseSmartMatch && (
            <div className="mb-4 rounded-card border border-primary-subtle-active bg-primary-subtle p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-primary-hover">
                    <FiTarget />
                    Akıllı eşleşme
                  </div>
                  <p className="mt-1 text-xs leading-5 text-textSecondary">
                    Profiline daha uygun ilanları öne çıkar.
                  </p>
                </div>
                <button
                  type="button"
                  aria-pressed={smartMatchEnabled}
                  aria-label="Akıllı eşleşmeyi aç veya kapat"
                  onClick={() => setSmartMatchEnabled((prev) => !prev)}
                  className={`relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 ${
                    smartMatchEnabled ? "bg-primary" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                      smartMatchEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          <div className="border-t border-slate-100 py-4">
            <div className="mb-3">
              <p className="flex items-center gap-2 text-sm font-semibold text-textPrimary">
                İş türü
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
              {jobTypes.map((jtype, index) => (
                <label
                  key={index}
                  className="flex cursor-pointer items-center gap-2 text-sm text-textSecondary"
                >
                  <input
                    type="checkbox"
                    value={jtype}
                    checked={filterJobTypes.includes(jtype)}
                    className="h-4 w-4 rounded border-slate-300 accent-primary"
                    onChange={(e) => filterJobs(e.target.value)}
                  />
                  <span>{getJobTypeLabel(jtype)}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 py-4">
            <div className="mb-3">
              <p className="flex items-center gap-2 text-sm font-semibold text-textPrimary">
                Deneyim
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
              {experience.map((exp) => (
                <label
                  key={exp.title}
                  className="flex cursor-pointer items-center gap-2 text-sm text-textSecondary"
                >
                  <input
                    type="checkbox"
                    value={exp?.value}
                    checked={expVal.includes(exp?.value)}
                    className="h-4 w-4 rounded border-slate-300 accent-primary"
                    onChange={(e) => filterExperience(e.target.value)}
                  />
                  <span>{exp.title}</span>
                </label>
              ))}
            </div>
          </div>
        </Card>

        <div className="w-full flex-1">
          <div className="mb-5 rounded-panel border border-slate-200 bg-white p-4 shadow-card md:flex md:items-center md:justify-between md:gap-4">
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-sm font-semibold text-textPrimary">
                <FiSearch className="text-primary" />
                Fırsat listesi
              </p>
              <p className="mt-1 text-sm text-textSecondary">
                <span className="font-semibold text-textPrimary">{recordCount}</span>{" "}
                ilan bulundu
                {smartMatchEnabled && user?.accountType === "seeker"
                  ? ", profil uyumuna göre öne çıkarılıyor."
                  : "."}
              </p>
            </div>

            <div className="mt-4 flex items-center gap-2 md:mt-0">
              <span className="text-sm text-textSecondary">Sırala:</span>
              <ListBox
                sort={sort}
                setSort={(value) => {
                  setPage(1);
                  setSort(value);
                }}
              />
            </div>
          </div>

          <div className="mb-5 flex flex-wrap gap-2 lg:hidden">
            {jobTypes.map((jtype) => (
              <button
                key={jtype}
                type="button"
                onClick={() => filterJobs(jtype)}
                className={`rounded-control px-3 py-2 text-sm font-semibold transition ${
                  filterJobTypes.includes(jtype)
                    ? "bg-primary text-white"
                    : "bg-white text-textSecondary shadow-card"
                }`}
              >
                {getJobTypeLabel(jtype)}
              </button>
            ))}
          </div>

          {activeFilterCount > 0 && (
            <div className="mb-5 flex flex-wrap items-center gap-2">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="inline-flex items-center gap-2 rounded-control border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-textPrimary shadow-card"
                >
                  Arama: {searchQuery}
                  <FiX className="text-textSecondary" />
                </button>
              )}
              {jobLocation && (
                <button
                  type="button"
                  onClick={() => setJobLocation("")}
                  className="inline-flex items-center gap-2 rounded-control border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-textPrimary shadow-card"
                >
                  Konum: {jobLocation}
                  <FiX className="text-textSecondary" />
                </button>
              )}
              {filterJobTypes.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => filterJobs(item)}
                  className="inline-flex items-center gap-2 rounded-control bg-primary-subtle px-3 py-1.5 text-sm font-medium text-primary"
                >
                  {getJobTypeLabel(item)}
                  <FiX />
                </button>
              ))}
              {expVal.map((item) => {
                const current = experience.find((exp) => exp.value === item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => filterExperience(item)}
                    className="inline-flex items-center gap-2 rounded-control bg-accent-warm-subtle px-3 py-1.5 text-sm font-medium text-amber-800"
                  >
                    {current?.title || item}
                    <FiX />
                  </button>
                );
              })}
              <Button variant="ghost" size="sm" iconLeft={<FiX />} onClick={clearFilters}>
                Tümünü temizle
              </Button>
            </div>
          )}

          {!isFetching && data?.length === 0 ? (
            <EmptyState
              title="İlan bulunamadı"
              description="Arama kelimeni veya filtrelerini değiştirerek tekrar deneyebilirsin. Sana uygun yeni ilanlar eklendikçe burada görünecek."
              actionLabel="Filtreleri temizle"
              onAction={() => {
                clearFilters();
              }}
            />
          ) : (
            <div className="grid w-full gap-4 xl:grid-cols-2">
              {matchedJobs?.map((job, index) => {
                const newJob = {
                  name: job?.company?.name,
                  logo: job?.company?.profileUrl,
                  ...job,
                };

                const isSaved = user?.savedJobs?.some(
                  (savedId) => (savedId?._id || savedId) === job?._id
                );

                return (
                  <JobCard
                    job={newJob}
                    key={index}
                    isSaved={isSaved}
                    matchScore={job?.matchScore}
                    matchReasons={[
                      job?.location ? `${job.location} konumu` : null,
                      job?.jobType ? getJobTypeLabel(job.jobType) : null,
                      job?.matchScore ? "Profil sinyali" : null,
                    ].filter(Boolean)}
                    onToggleSave={
                      user?.accountType === "seeker"
                        ? handleToggleSaveJob
                        : undefined
                    }
                  />
                );
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
            <div className="flex w-full items-center justify-center pt-16">
              <Button variant="secondary" size="lg" onClick={handleShowMore}>
                Daha fazla yükle
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindJobs;
