import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { EmptyState, JobCard, ListBox, Loading, PageContainer, PageTitle } from "../components";
import { apiRequest } from "../utils";
import { Login } from "../redux/userSlice";

const SavedJobs = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [message, setMessage] = useState("");
  const [sort, setSort] = useState("Newest");
  const sortedSavedJobs = [...savedJobs].sort((a, b) => {
    if (sort === "Oldest") {
      return new Date(a?.createdAt || 0) - new Date(b?.createdAt || 0);
    }

    if (sort === "A-Z") {
      return (a?.jobTitle || "").localeCompare(b?.jobTitle || "", "tr");
    }

    if (sort === "Z-A") {
      return (b?.jobTitle || "").localeCompare(a?.jobTitle || "", "tr");
    }

    return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0);
  });

  const fetchSavedJobs = async () => {
    setIsFetching(true);
    setMessage("");

    try {
      const res = await apiRequest({
        url: "/jobs/saved-jobs",
        token: user?.token,
        method: "GET",
      });

      if (res?.success) {
        setSavedJobs(res?.data || []);
      } else {
        setMessage(res?.message || "Kaydedilen ilanlar yüklenemedi.");
      }
    } catch (error) {
      console.log(error);
      setMessage("Kaydedilen ilanlar yüklenemedi.");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, [user?.token]);

  const handleToggleSaveJob = async (jobId) => {
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
        setSavedJobs((prev) => prev.filter((job) => job?._id !== jobId));
        toast.success(res.message);
      } else {
        toast.error(res?.message || "İşlem sırasında bir hata oluştu.");
      }
    } catch (error) {
      console.log(error);
      toast.error("İşlem sırasında bir hata oluştu.");
    }
  };

  return (
    <PageContainer>
      <div className="mb-6 grid gap-4 rounded-panel border border-slate-200/80 bg-white p-5 shadow-card md:grid-cols-[1fr_auto] md:items-end">
        <PageTitle subtitle="Daha sonra bakmak için kaydettiğin ilanlar burada listelenir.">
          Kaydedilen İlanlar
        </PageTitle>
        <div className="flex items-center gap-3">
          <p className="text-sm text-textSecondary">
            <span className="font-semibold text-textPrimary">{savedJobs.length}</span>{" "}
            kayıtlı ilan
          </p>
          <ListBox sort={sort} setSort={setSort} />
        </div>
      </div>

      {isFetching ? (
        <div className="py-16">
          <Loading />
        </div>
      ) : savedJobs.length > 0 ? (
        <>
          <div className="grid w-full max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sortedSavedJobs.map((job) => {
              const data = {
                name: job?.company?.name,
                logo: job?.company?.profileUrl,
                ...job,
              };

              return (
                <JobCard
                  job={data}
                  key={job?._id}
                  isSaved
                  onToggleSave={handleToggleSaveJob}
                />
              );
            })}
          </div>
        </>
      ) : (
        <>
          <EmptyState
            title="Henüz kaydedilen ilan yok"
            description="İlgini çeken ilanları kalp ikonuyla kaydedip daha sonra buradan tekrar bulabilirsin."
            actionLabel="İlanları keşfet"
            onAction={() => navigate("/find-jobs")}
          />
          {message && <p className="mt-3 text-sm text-danger">{message}</p>}
        </>
      )}
    </PageContainer>
  );
};

export default SavedJobs;
