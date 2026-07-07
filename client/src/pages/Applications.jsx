import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { EmptyState, JobCard, Loading } from "../components";
import { apiRequest } from "../utils";
import { getApplicationStatusLabel } from "../utils/translations";

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
    <div className="container mx-auto px-5 py-10">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-800">Başvurularım</h1>
        <p className="text-slate-500">
          Başvurduğun ilanları buradan takip edebilirsin.
        </p>
      </div>

      {isFetching ? (
        <div className="py-16">
          <Loading />
        </div>
      ) : applications.length > 0 ? (
        <>
          <p className="mb-5 text-sm text-slate-500">
            Toplam{" "}
            <span className="font-semibold text-slate-800">
              {applications.length}
            </span>{" "}
            başvuru bulundu.
          </p>

          <div className="grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {applications.map((job) => {
              const data = {
                name: job?.company?.name,
                logo: job?.company?.profileUrl,
                ...job,
              };

              return (
                <div key={job?._id} className="flex flex-col gap-3">
                  <div className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {getApplicationStatusLabel(job?.applicationStatusValue)}
                  </div>
                  <JobCard job={data} />
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <EmptyState
            title="Henüz başvurun yok"
            description="Sana uygun ilanları keşfedip başvuru yaptığında bu alanda başvuru durumlarını takip edebilirsin."
            actionLabel="İlanları keşfet"
            onAction={() => navigate("/find-jobs")}
          />
          {message && <p className="mt-3 text-sm text-red-500">{message}</p>}
        </>
      )}
    </div>
  );
};

export default Applications;
