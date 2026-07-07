import { useEffect, useState } from "react";
import { AiOutlineSafetyCertificate } from "react-icons/ai";
import { Link, useParams } from "react-router-dom";
import { CustomButton, JobCard, Loading } from "../components";
import { useSelector } from "react-redux";
import { apiRequest } from "../utils";
import {
  formatRelativeTime,
  formatSalary,
  getJobTypeLabel,
} from "../utils/translations";

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.user);
  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [selected, setSelected] = useState("0");
  const [isFetching, setIsFetching] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [applyMessage, setApplyMessage] = useState("");

  const getJobDetails = async () => {
    setIsFetching(true);

    try {
      const res = await apiRequest({
        url: "/jobs/get-job-detail/" + id,
        method: "GET",
      });

      setJob(res?.data);
      setSimilarJobs(res?.similarJobs);
      setIsFetching(false);
    } catch (error) {
      setIsFetching(false);
      console.log(error);
    }
  };

  const handleDeletePost = async () => {
    setIsFetching(true);

    try {
      if (window.confirm("Bu iş ilanını silmek istiyor musun?")) {
        const res = await apiRequest({
          url: "/jobs/delete-job/" + job?._id,
          token: user?.token,
          method: "DELETE",
        });

        if (res?.success) {
          alert(res?.message);
          window.location.replace("/");
        }
      }
      setIsFetching(false);
    } catch (error) {
      setIsFetching(false);
      console.log(error);
    }
  };

  const hasApplied = job?.application?.some(
    (applicantId) => applicantId?.toString() === user?._id
  );
  const canApply = user?.accountType === "seeker";

  const handleApplyJob = async () => {
    if (!user?.token) {
      setApplyMessage("Başvuru yapmak için giriş yapmalısın.");
      return;
    }

    setIsApplying(true);
    setApplyMessage("");

    try {
      const res = await apiRequest({
        url: "/jobs/apply-job/" + job?._id,
        token: user?.token,
        method: "POST",
      });

      if (res?.success) {
        setJob(res?.data);
        setApplyMessage(res?.message || "Başvurun başarıyla alındı.");
      } else {
        setApplyMessage(res?.message || "Başvuru sırasında bir hata oluştu.");
      }
    } catch (error) {
      console.log(error);
      setApplyMessage("Başvuru sırasında bir hata oluştu.");
    } finally {
      setIsApplying(false);
    }
  };

  useEffect(() => {
    id && getJobDetails();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [id]);

  return (
    <div className="container mx-auto px-5 py-8">
      <div className="flex w-full flex-col gap-8 xl:flex-row">
        {/* LEFT SIDE */}

        {isFetching ? (
          <Loading />
        ) : (
          <div className="h-fit w-full rounded-xl border border-slate-100 bg-white px-5 py-8 shadow-sm md:px-10 xl:flex-1">
            <div className="flex w-full items-start justify-between gap-4">
              <div className="flex min-w-0 gap-3">
                <img
                  src={job?.company?.profileUrl}
                  alt={job?.company?.name}
                  className="h-20 w-20 rounded-xl object-cover md:w-24"
                />

                <div className="flex min-w-0 flex-col">
                  <p className="text-xl font-semibold text-slate-700">
                    {job?.jobTitle}
                  </p>

                  <span className="text-base">{job?.location}</span>

                  <span className="text-base text-blue-600">
                    {job?.company?.name}
                  </span>

                  <span className="text-gray-500 text-sm">
                    {formatRelativeTime(job?.createdAt)}
                  </span>
                </div>
              </div>

              <div className="">
                <AiOutlineSafetyCertificate className="text-3xl text-blue-500" />
              </div>
            </div>

            <div className="my-10 grid w-full gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <div className="flex h-20 flex-col items-center justify-center rounded-xl bg-emerald-50">
                <span className="text-sm">Maaş</span>
                <p className="text-lg font-semibold text-gray-700">
                  {formatSalary(job?.salary)} TL
                </p>
              </div>

              <div className="flex h-20 flex-col items-center justify-center rounded-xl bg-sky-50">
                <span className="text-sm">İş Türü</span>
                <p className="text-lg font-semibold text-gray-700">
                  {getJobTypeLabel(job?.jobType)}
                </p>
              </div>

              {/* <div className="bg-[#fed0ab] w-72 h-16 px-6 rounded-lg flex flex-col items-center justify-center">
                <span className="text-sm">No. of Applicants</span>
                <p className="text-lg font-semibold text-gray-700">
                  {job?.application?.length}
                </p>
              </div> */}

              {/* <div className="bg-[#cecdff] w-72 h-16 px-6 rounded-lg flex flex-col items-center justify-center">
                <span className="text-sm">No. of Vacancies</span>
                <p className="text-lg font-semibold text-gray-700">
                  {job?.vacancies}
                </p>
              </div> */}

              <div className="flex h-20 flex-col items-center justify-center rounded-xl bg-rose-50 px-6">
                <span className="text-sm">Deneyim</span>
                <p className="text-lg font-semibold text-gray-700">
                  {job?.experience}
                </p>
              </div>
            </div>

            <div className="grid w-full gap-3 py-5 sm:grid-cols-2">
              <CustomButton
                onClick={() => setSelected("0")}
                title="İş ilanı hakkında"
                containerStyles={`w-full flex items-center justify-center py-3 px-5 outline-none rounded-full text-sm font-semibold transition ${
                  selected === "0"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "bg-white text-blue-600 border border-blue-200 hover:border-blue-600 hover:bg-blue-50"
                }`}
              />

              <CustomButton
                onClick={() => setSelected("1")}
                title="Şirket"
                containerStyles={`w-full flex items-center justify-center py-3 px-5 outline-none rounded-full text-sm font-semibold transition ${
                  selected === "1"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "bg-white text-blue-600 border border-blue-200 hover:border-blue-600 hover:bg-blue-50"
                }`}
              />
            </div>

            <div className="my-6 leading-7 text-slate-700">
              {selected === "0" ? (
                <>
                  {/* <p className="text-xl font-semibold">Job Decsription</p> */}

                  <span className="text-base">{job?.detail[0]?.desc}</span>

                  {job?.detail[0]?.requirements && (
                    <>
                      <p className="text-xl font-semibold mt-8">Gereklilikler</p>
                      <span className="text-base">
                        {job?.detail[0]?.requirements}
                      </span>
                    </>
                  )}
                </>
              ) : (
                <>
                  <div className="mb-6 flex flex-col">
                    <p className="text-xl text-blue-600 font-semibold">
                      {job?.company?.name}
                    </p>
                    <span className="text-base">{job?.company?.location}</span>
                    <span className="text-sm">{job?.company?.email}</span>
                  </div>

                  <p className="text-xl font-semibold">Şirket hakkında</p>
                  <span>{job?.company?.about}</span>
                </>
              )}
            </div>

            <div className="flex w-full justify-end">
              {user?._id === job?.company?._id ? (
                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                  <Link
                    to={`/edit-job/${job?._id}`}
                    className="flex w-full items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
                  >
                    Düzenle
                  </Link>

                  <CustomButton
                    title="Sil"
                    onClick={handleDeletePost}
                    containerStyles="w-full sm:w-auto flex items-center justify-center border border-red-200 bg-white px-5 py-2 text-sm font-semibold text-red-600 outline-none rounded-full transition hover:border-red-300 hover:bg-red-50"
                  />
                </div>
              ) : !canApply ? (
                <div className="flex w-full justify-end">
                  <CustomButton
                    title="Aday hesabı ile başvur"
                    containerStyles="w-full flex items-center justify-center border border-blue-100 bg-blue-50 px-5 py-3 text-base font-semibold text-blue-700 outline-none rounded-full cursor-not-allowed"
                  />
                </div>
              ) : (
                <div className="flex w-full flex-col items-end gap-2">
                  <CustomButton
                    title={
                      isApplying
                        ? "Başvuruluyor..."
                        : hasApplied
                        ? "Başvuruldu"
                        : "Başvur"
                    }
                    onClick={hasApplied || isApplying ? undefined : handleApplyJob}
                    containerStyles={`w-full flex items-center justify-center py-3 px-5 outline-none rounded-full text-base font-semibold transition ${
                      hasApplied
                        ? "bg-blue-50 text-blue-700 border border-blue-100 cursor-not-allowed"
                        : "text-white bg-blue-600 hover:bg-blue-700"
                    }`}
                  />

                  {applyMessage && (
                    <p
                      className={`text-sm ${
                        hasApplied ? "text-blue-600" : "text-slate-500"
                      }`}
                    >
                      {applyMessage}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* RIGHT SIDE */}
        <aside className="w-full xl:w-80 2xl:w-96 xl:shrink-0">
          <p className="font-semibold text-slate-600">Benzer iş ilanları</p>

          <div className="mt-3 grid w-full gap-5 sm:grid-cols-2 xl:grid-cols-1">
            {similarJobs?.slice(0, 6).map((job, index) => {
              const data = {
                name: job?.company.name,
                logo: job?.company.profileUrl,
                ...job,
              };
              return <JobCard job={data} key={index} />;
            })}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default JobDetail;
