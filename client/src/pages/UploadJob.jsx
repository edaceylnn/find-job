import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  CustomButton,
  JobCard,
  JobTypes,
  Loading,
  TextInput,
} from "../components";
import { useSelector } from "react-redux";
import { apiRequest } from "../utils";
import { useNavigate, useParams } from "react-router-dom";

const UploadJob = () => {
  const { user } = useSelector((state) => state.user);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {},
  });

  const [errMsg, setErrMsg] = useState("");
  const [jobType, setJobType] = useState("Full-Time");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingJob, setIsFetchingJob] = useState(false);
  const [recentPost, setRecentPost] = useState([]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrMsg(null);

    const newData = { ...data, jobType: jobType };

    try {
      const res = await apiRequest({
        url: isEditMode ? `/jobs/update-job/${id}` : "/jobs/upload-job",
        token: user?.token,
        data: newData,
        method: isEditMode ? "PUT" : "POST",
      });

      if (res?.status === "failed" || res?.success === false) {
        setErrMsg({
          status: "failed",
          message: res?.message || "İşlem sırasında bir hata oluştu.",
        });
      } else {
        setErrMsg({ status: "success", message: res.message });

        if (isEditMode) {
          navigate(`/job-detail/${id}`);
        } else {
          reset();
          setJobType("Full-Time");
          getRecentPost();
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const getJobDetails = async () => {
    if (!isEditMode) return;
    if (!user?._id) return;

    setIsFetchingJob(true);

    try {
      const res = await apiRequest({
        url: "/jobs/get-job-detail/" + id,
        method: "GET",
      });

      if (!res?.success || res?.data?.company?._id !== user?._id) {
        navigate("/find-jobs");
        return;
      }

      const job = res.data;

      reset({
        jobTitle: job?.jobTitle || "",
        salary: job?.salary || "",
        vacancies: job?.vacancies || "",
        experience: job?.experience || "",
        location: job?.location || "",
        desc: job?.detail?.[0]?.desc || "",
        requirements: job?.detail?.[0]?.requirements || "",
      });
      setJobType(job?.jobType || "Full-Time");
    } catch (error) {
      console.log(error);
      navigate("/find-jobs");
    } finally {
      setIsFetchingJob(false);
    }
  };

  const getRecentPost = async () => {
    try {
      const id = user?._id;

      if (!id) {
        setRecentPost([]);
        return;
      }

      const res = await apiRequest({
        url: "/companies/get-company/" + id,
        method: "GET",
      });

      const posts = Array.isArray(res?.data?.jobPosts) ? res.data.jobPosts : [];
      setRecentPost(posts);
    } catch (error) {
      console.log(error);
      setRecentPost([]);
    }
  };

  useEffect(() => {
    getRecentPost();
  }, [user?._id]);

  useEffect(() => {
    getJobDetails();
  }, [id, user?._id]);

  if (isFetchingJob) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto flex flex-col gap-8 bg-white px-5 py-8 lg:flex-row 2xl:gap-14">
      <div
        className={`h-fit w-full rounded-xl border border-slate-100 bg-white px-5 py-8 shadow-sm md:px-10 ${
          isEditMode ? "lg:w-full" : "lg:w-2/3"
        }`}
      >
        <div>
          <p className="text-2xl font-semibold text-slate-700">
            {isEditMode ? "İlanı düzenle" : "Yeni ilan yayınla"}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {isEditMode
              ? "Yayındaki ilan bilgilerini güncelleyebilirsin."
              : "Adayların başvurabileceği yeni bir ilan oluştur."}
          </p>

          <form
            className="w-full mt-2 flex flex-col gap-8"
            onSubmit={handleSubmit(onSubmit)}
          >
            <TextInput
              name="jobTitle"
              label="Pozisyon"
              placeholder="Örn. Frontend Developer"
              type="text"
              required={true}
              register={register("jobTitle", {
                required: "Pozisyon zorunludur.",
              })}
              error={errors.jobTitle ? errors.jobTitle?.message : ""}
            />

            <div className="grid w-full gap-4 md:grid-cols-2">
              <div className="mt-2">
                <label className="text-gray-600 text-sm mb-1">
                  Çalışma türü
                </label>
                <JobTypes jobTitle={jobType} setJobTitle={setJobType} />
              </div>

              <div>
                <TextInput
                  name="salary"
                  label="Maaş (TL)"
                  placeholder="Örn. 45000"
                  type="number"
                  min="0"
                  step="1000"
                  onWheel={(e) => e.currentTarget.blur()}
                  register={register("salary", {
                    required: "Maaş bilgisi zorunludur.",
                    valueAsNumber: true,
                  })}
                  error={errors.salary ? errors.salary?.message : ""}
                />
              </div>
            </div>

            <div className="grid w-full gap-4 md:grid-cols-2">
              <div>
                <TextInput
                  name="vacancies"
                  label="Açık pozisyon sayısı"
                  placeholder="Örn. 2"
                  type="number"
                  min="1"
                  onWheel={(e) => e.currentTarget.blur()}
                  register={register("vacancies", {
                    required: "Açık pozisyon sayısı zorunludur.",
                    valueAsNumber: true,
                  })}
                  error={errors.vacancies ? errors.vacancies?.message : ""}
                />
              </div>

              <div>
                <TextInput
                  name="experience"
                  label="Deneyim yılı"
                  placeholder="Örn. 3"
                  type="number"
                  min="0"
                  onWheel={(e) => e.currentTarget.blur()}
                  register={register("experience", {
                    required: "Deneyim bilgisi zorunludur.",
                    valueAsNumber: true,
                  })}
                  error={errors.experience ? errors.experience?.message : ""}
                />
              </div>
            </div>

            <TextInput
              name="location"
              label="Konum"
              placeholder="Örn. İstanbul"
              type="text"
              register={register("location", {
                required: "Konum zorunludur.",
              })}
              error={errors.location ? errors.location?.message : ""}
            />
            <div className="flex flex-col">
              <label className="text-gray-600 text-sm mb-1">
                İş açıklaması
              </label>
              <textarea
                className="rounded border border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base px-4 py-2 resize-none"
                rows={4}
                cols={6}
                {...register("desc", {
                  required: "İş açıklaması zorunludur.",
                })}
                aria-invalid={errors.desc ? "true" : "false"}
              ></textarea>
              {errors.desc && (
                <span role="alert" className="text-xs text-red-500 mt-0.5">
                  {errors.desc?.message}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 text-sm mb-1">
                Gereklilikler
              </label>
              <textarea
                className="rounded border border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base px-4 py-2 resize-none"
                rows={4}
                cols={6}
                {...register("requirements", {
                  required: "Gereklilikler zorunludur.",
                })}
              ></textarea>
              {errors.requirements && (
                <span role="alert" className="text-xs text-red-500 mt-0.5">
                  {errors.requirements?.message}
                </span>
              )}
            </div>

            {errMsg && (
              <span
                role="alert"
                className={`text-sm mt-0.5 ${
                  errMsg.status === "success" ? "text-blue-600" : "text-red-500"
                }`}
              >
                {errMsg.message}
              </span>
            )}
            <div className="mt-2">
              {isLoading ? (
                <Loading />
              ) : (
                <CustomButton
                  type="submit"
                  containerStyles="inline-flex justify-center rounded-full border border-transparent bg-blue-600 px-8 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none"
                  title={isEditMode ? "Güncelle" : "Yayınla"}
                />
              )}
            </div>
          </form>
        </div>
      </div>
      {!isEditMode && <div className="w-full p-0 lg:w-1/3 lg:p-5">
        <p className="mb-4 font-semibold text-slate-600">
          Son yayınlanan ilanlar
        </p>

        <div className="grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-1">
          {(Array.isArray(recentPost) ? recentPost : [])
            .slice(0, 4)
            .map((job, index) => {
              const data = {
                name: user?.name,
                email: user?.email,
                logo: user?.profileUrl,
                ...job,
              };
              return <JobCard job={data} key={index} />;
            })}
        </div>
      </div>}
    </div>
  );
};

export default UploadJob;
