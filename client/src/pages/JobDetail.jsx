import { useEffect, useState } from "react";
import { FiDollarSign, FiBriefcase, FiClock, FiMapPin, FiShield } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Avatar,
  Badge,
  Button,
  Card,
  ConfirmDialog,
  JobCard,
  Loading,
  PageContainer,
} from "../components";
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
    setIsDeleting(true);

    try {
      const res = await apiRequest({
        url: "/jobs/delete-job/" + job?._id,
        token: user?.token,
        method: "DELETE",
      });

      if (res?.success) {
        toast.success(res?.message || "İlan başarıyla silindi.");
        window.location.replace("/");
        return;
      }

      toast.error(res?.message || "İlan silinirken bir hata oluştu.");
    } catch (error) {
      console.log(error);
      toast.error("İlan silinirken bir hata oluştu.");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const hasApplied = job?.application?.some(
    (applicantId) => applicantId?.toString() === user?._id
  );
  const canApply = user?.accountType === "seeker";
  const detailStats = [
    {
      label: "Maaş",
      value: `${formatSalary(job?.salary)} TL`,
      icon: <FiDollarSign />,
    },
    {
      label: "İş türü",
      value: getJobTypeLabel(job?.jobType),
      icon: <FiBriefcase />,
    },
    {
      label: "Deneyim",
      value: job?.experience || "-",
      icon: <FiClock />,
    },
  ];

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
    <PageContainer>
      <div className="flex w-full flex-col gap-8 xl:flex-row">
        {/* LEFT SIDE */}

        {isFetching ? (
          <Loading />
        ) : (
          <Card padding="none" className="h-fit w-full overflow-hidden border-slate-200/80 bg-white xl:flex-1">
            <div className="border-b border-border px-5 py-6 md:px-8">
              <div className="flex w-full flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div className="flex min-w-0 gap-4">
                  <Avatar
                    src={job?.company?.profileUrl}
                    alt={job?.company?.name}
                    size="xl"
                    shape="square"
                    ring
                  />

                  <div className="flex min-w-0 flex-col">
                    <p className="text-base font-semibold leading-6 text-textPrimary">
                      {job?.jobTitle}
                    </p>

                    <span className="mt-1 text-sm font-medium text-primary">
                      {job?.company?.name}
                    </span>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-textSecondary">
                      <span className="inline-flex items-center gap-1">
                        <FiMapPin /> {job?.location || "Konum yok"}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <FiClock /> {formatRelativeTime(job?.createdAt)}
                      </span>
                      <Badge tone="success" size="sm" className="gap-1">
                        <FiShield /> Doğrulanmış ilan
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 px-5 py-5 md:grid-cols-3 md:px-8">
              {detailStats.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-card border border-border bg-surface-subtle px-4 py-3"
                >
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-card bg-white text-primary shadow-card">
                    {item.icon}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-medium text-textSecondary">
                      {item.label}
                    </span>
                    <span className="block truncate text-sm font-semibold text-textPrimary">
                      {item.value}
                    </span>
                  </span>
                </div>
              ))}
            </div>

            <div className="border-b border-border px-5 md:px-8">
              <div className="flex gap-6">
                {[
                  { id: "0", label: "İş ilanı hakkında" },
                  { id: "1", label: "Şirket" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelected(tab.id)}
                    className={`border-b-2 px-1 py-4 text-sm font-semibold transition ${
                      selected === tab.id
                        ? "border-primary text-primary"
                        : "border-transparent text-textSecondary hover:text-textPrimary"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-5 py-6 leading-7 text-textPrimary md:px-8">
              {selected === "0" ? (
                <>
                  <section>
                    <p className="text-base font-semibold">İş tanımı</p>
                    <p className="mt-3 text-sm leading-7 text-textSecondary">
                      {job?.detail?.[0]?.desc}
                    </p>
                  </section>

                  {job?.detail?.[0]?.requirements && (
                    <section className="mt-8">
                      <p className="text-base font-semibold">Gereklilikler</p>
                      <p className="mt-3 text-sm leading-7 text-textSecondary">
                        {job?.detail?.[0]?.requirements}
                      </p>
                    </section>
                  )}
                </>
              ) : (
                <>
                  <div className="mb-6 flex flex-col">
                    <p className="text-base font-semibold text-primary">
                      {job?.company?.name}
                    </p>
                    <span className="text-sm">{job?.company?.location}</span>
                    <span className="text-sm">{job?.company?.email}</span>
                  </div>

                  <p className="text-base font-semibold">Şirket hakkında</p>
                  <p className="mt-3 text-sm leading-7 text-textSecondary">
                    {job?.company?.about}
                  </p>
                </>
              )}
            </div>

            <div className="flex w-full justify-end border-t border-border px-5 py-5 md:px-8">
              {user?._id === job?.company?._id ? (
                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                  <Link
                    to={`/edit-job/${job?._id}`}
                    className="inline-flex h-10 items-center justify-center rounded-control bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-hover"
                  >
                    Düzenle
                  </Link>

                  <Button
                    variant="outline"
                    className="border-danger/30 text-danger hover:bg-danger-subtle"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Sil
                  </Button>
                </div>
              ) : !canApply ? (
                <p className="w-full rounded-card bg-surface-subtle px-4 py-3 text-center text-sm font-medium text-textSecondary">
                  Başvuru yapmak için aday hesabı ile giriş yapmalısın.
                </p>
              ) : hasApplied ? (
                <p className="w-full rounded-card bg-primary-subtle px-4 py-3 text-center text-sm font-semibold text-primary">
                  Başvuruldu
                </p>
              ) : (
                <div className="flex w-full flex-col items-end gap-2">
                  <Button
                    variant="primary"
                    fullWidth
                    size="lg"
                    loading={isApplying}
                    onClick={isApplying ? undefined : handleApplyJob}
                  >
                    {isApplying ? "Başvuruluyor..." : "Başvur"}
                  </Button>

                  {applyMessage && (
                    <p
                      className={`text-sm ${
                        hasApplied ? "text-primary" : "text-textSecondary"
                      }`}
                    >
                      {applyMessage}
                    </p>
                  )}
                </div>
              )}
            </div>
          </Card>
        )}

        {/* RIGHT SIDE */}
        <aside className="w-full xl:w-80 2xl:w-96 xl:shrink-0">
          <p className="font-semibold text-textPrimary">Benzer iş ilanları</p>

          <div className="mt-3 grid w-full gap-4 sm:grid-cols-2 xl:grid-cols-1">
            {similarJobs?.slice(0, 6).map((job, index) => {
              const data = {
                name: job?.company.name,
                logo: job?.company.profileUrl,
                ...job,
              };
              return <JobCard job={data} key={index} variant="compact" />;
            })}
          </div>
        </aside>
      </div>

      <ConfirmDialog
        open={showDeleteConfirm}
        title="İlanı silmek istediğine emin misin?"
        description="Bu işlem geri alınamaz, ilan ve başvuru geçmişi kalıcı olarak silinir."
        confirmLabel="İlanı sil"
        cancelLabel="Vazgeç"
        isLoading={isDeleting}
        onConfirm={handleDeletePost}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </PageContainer>
  );
};

export default JobDetail;
