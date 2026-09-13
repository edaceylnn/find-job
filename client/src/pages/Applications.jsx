import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { EmptyState, JobCard, Loading, PageContainer, PageTitle } from "../components";
import { apiRequest } from "../utils";
import { getApplicationStatusLabel, getApplicationStatusTone } from "../utils/translations";

const Applications = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [message, setMessage] = useState("");

  const fetchApplications = async () => {
    setIsFetching(true);
    setMessage("");

    try {
      const res = await apiRequest({
        url: "/jobs/my-applications",
        token: user?.token,
        method: "GET",
      });

      if (res?.success) {
        setApplications(res?.data || []);
      } else {
        setMessage(res?.message || "Başvuruların yüklenemedi.");
      }
    } catch (error) {
      console.log(error);
      setMessage("Başvuruların yüklenemedi.");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [user?.token]);

  return (
    <PageContainer>
      <div className="mb-6 grid gap-4 rounded-panel border border-slate-200/80 bg-white p-5 shadow-card md:grid-cols-[1fr_auto] md:items-end">
        <PageTitle subtitle="Başvurularının durumunu buradan takip edebilirsin.">
          Başvurularım
        </PageTitle>
        <p className="text-sm text-textSecondary">
          <span className="font-semibold text-textPrimary">{applications.length}</span>{" "}
          başvuru
        </p>
      </div>

      {isFetching ? (
        <div className="py-16">
          <Loading />
        </div>
      ) : applications.length > 0 ? (
        <div className="grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {applications.map((job) => {
            const data = {
              name: job?.company?.name,
              logo: job?.company?.profileUrl,
              ...job,
            };

            return (
              <JobCard
                key={job?._id}
                job={data}
                variant="application"
                statusLabel={getApplicationStatusLabel(job?.applicationStatusValue)}
                statusTone={getApplicationStatusTone(job?.applicationStatusValue)}
                meta="Başvuru takipte"
              />
            );
          })}
        </div>
      ) : (
        <>
          <EmptyState
            title="Henüz başvurun yok"
            description="Sana uygun ilanları keşfedip başvuru yaptığında bu alanda başvuru durumlarını takip edebilirsin."
            actionLabel="İlanları keşfet"
            onAction={() => navigate("/find-jobs")}
          />
          {message && <p className="mt-3 text-sm text-danger">{message}</p>}
        </>
      )}
    </PageContainer>
  );
};

export default Applications;
