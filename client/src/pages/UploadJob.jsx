import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  Card,
  Input,
  JobCard,
  JobTypes,
  Loading,
  PageContainer,
  Textarea,
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
    <PageContainer className="flex flex-col gap-8 bg-white lg:flex-row 2xl:gap-14">
      <Card className={`h-fit w-full px-5 py-8 md:px-10 ${isEditMode ? "lg:w-full" : "lg:w-2/3"}`}>
        <div>
          <p className="text-base font-semibold text-textPrimary">
            {isEditMode ? "İlanı düzenle" : "Yeni ilan yayınla"}
          </p>
          <p className="mt-2 text-sm text-textSecondary">
            {isEditMode
              ? "Yayındaki ilan bilgilerini güncelleyebilirsin."
              : "Adayların başvurabileceği yeni bir ilan oluştur."}
          </p>

          <form
            className="mt-2 flex w-full flex-col gap-8"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              name="jobTitle"
              label="Pozisyon"
              placeholder="Örn. Frontend Developer"
              required
              register={register("jobTitle", {
                required: "Pozisyon zorunludur.",
              })}
              error={errors.jobTitle?.message}
            />

            <div className="grid w-full gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-textPrimary">
                  Çalışma türü
                </label>
                <JobTypes jobTitle={jobType} setJobTitle={setJobType} />
              </div>

              <Input
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
                error={errors.salary?.message}
              />
            </div>

            <div className="grid w-full gap-4 md:grid-cols-2">
              <Input
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
                error={errors.vacancies?.message}
              />

              <Input
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
                error={errors.experience?.message}
              />
            </div>

            <Input
              name="location"
              label="Konum"
              placeholder="Örn. İstanbul"
              register={register("location", {
                required: "Konum zorunludur.",
              })}
              error={errors.location?.message}
            />

            <Textarea
              name="desc"
              label="İş açıklaması"
              register={register("desc", {
                required: "İş açıklaması zorunludur.",
              })}
              error={errors.desc?.message}
            />

            <Textarea
              name="requirements"
              label="Gereklilikler"
              register={register("requirements", {
                required: "Gereklilikler zorunludur.",
              })}
              error={errors.requirements?.message}
            />

            {errMsg && (
              <span
                role="alert"
                className={`mt-0.5 text-sm ${
                  errMsg.status === "success" ? "text-primary" : "text-danger"
                }`}
              >
                {errMsg.message}
              </span>
            )}

            <div className="mt-2">
              <Button type="submit" size="lg" loading={isLoading}>
                {isEditMode ? "Güncelle" : "Yayınla"}
              </Button>
            </div>
          </form>
        </div>
      </Card>

      {!isEditMode && (
        <div className="w-full p-0 lg:w-1/3 lg:p-5">
          <p className="mb-4 font-semibold text-textSecondary">
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
        </div>
      )}
    </PageContainer>
  );
};

export default UploadJob;
