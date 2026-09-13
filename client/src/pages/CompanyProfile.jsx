import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { HiLocationMarker } from "react-icons/hi";
import { AiOutlineMail } from "react-icons/ai";
import {
  FiBriefcase,
  FiEdit3,
  FiFileText,
  FiPhoneCall,
  FiUpload,
  FiUsers,
} from "react-icons/fi";
import { LiaMoneyCheckAltSolid } from "react-icons/lia";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Avatar,
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  Loading,
  Modal,
  PageContainer,
  Select,
  Textarea,
} from "../components";
import { apiRequest, handleFileUpload } from "../utils";
import { Login } from "../redux/userSlice";
import { NoProfile } from "../assets";
import {
  formatRelativeTime,
  formatSalary,
  getApplicationStatusLabel,
  getApplicationStatusTone,
  getJobTypeLabel,
} from "../utils/translations";

const APPLICATION_STATUSES = ["pending", "reviewed", "accepted", "rejected"];
const STATUS_OPTIONS = APPLICATION_STATUSES.map((status) => ({
  value: status,
  label: getApplicationStatusLabel(status),
}));

const COMPANY_FORM_ID = "company-profile-form";

const CompanyForm = ({ open, setOpen, setInfo }) => {
  const { user } = useSelector((state) => state.user);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: { ...user },
  });

  const dispatch = useDispatch();
  const [profileImage, setProfileImage] = useState("");
  const [profilePreview, setProfilePreview] = useState(user?.profileUrl || "");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);

    const url = profileImage && (await handleFileUpload(profileImage));
    const newData = url ? { ...data, profileUrl: url } : data;

    try {
      const res = await apiRequest({
        url: "/companies/update-company",
        token: user?.token,
        data: newData,
        method: "PUT",
      });

      if (res?.status === "failed" || res?.success === false) {
        toast.error(res?.message || "Şirket profili güncellenemedi.");
        return;
      }

      const updatedUser = { token: res?.token, ...(res?.user || res?.company) };

      dispatch(Login(updatedUser));
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));
      setInfo((prev) => ({ ...prev, ...(res?.user || res?.company) }));
      setOpen(false);
      toast.success("Şirket profili güncellendi.");
    } catch (error) {
      console.log(error);
      toast.error("Şirket profili güncellenemedi.");
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => setOpen(false);

  const handleProfileImageChange = (file) => {
    setProfileImage(file);

    if (file) {
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  return (
    <Modal
      open={open}
      onClose={closeModal}
      title="Şirket profilini düzenle"
      description="Adayların şirketini daha iyi tanıması için profil bilgilerini güncel tut."
      size="lg"
      footer={
        <>
          <Button type="button" variant="outline" onClick={closeModal}>
            İptal
          </Button>
          <Button type="submit" form={COMPANY_FORM_ID} loading={isLoading}>
            Değişiklikleri kaydet
          </Button>
        </>
      }
    >
      <form
        id={COMPANY_FORM_ID}
        className="flex w-full flex-col gap-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-4 rounded-card bg-surface-subtle p-4 sm:flex-row sm:items-center">
          <img
            src={profilePreview || user?.profileUrl || NoProfile}
            alt={user?.name}
            className="h-20 w-20 rounded-panel bg-white object-cover ring-1 ring-slate-200"
          />

          <div className="flex-1">
            <p className="text-sm font-semibold text-textPrimary">
              Şirket logosu
            </p>
            <p className="mt-1 text-xs leading-5 text-textSecondary">
              Kare formatlı ve net bir logo daha iyi görünür.
            </p>
            <Button as="label" variant="outline" size="sm" className="mt-3">
              Logo seç
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleProfileImageChange(e.target.files[0])}
              />
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            name="name"
            label="Şirket adı"
            register={register("name", {
              required: "Şirket adı zorunludur.",
            })}
            error={errors.name?.message}
          />

          <Input
            name="location"
            label="Konum / adres"
            placeholder="Örn. İstanbul"
            register={register("location", {
              required: "Adres zorunludur.",
            })}
            error={errors.location?.message}
          />

          <Input
            name="contact"
            label="Telefon"
            placeholder="Telefon numarası"
            register={register("contact", {
              required: "Telefon zorunludur.",
            })}
            error={errors.contact?.message}
          />
        </div>

        <Textarea
          name="about"
          label="Şirket hakkında"
          placeholder="Şirket kültürünü, çalışma alanlarını ve adaylara sunduğunuz fırsatları kısaca anlatın."
          rows={5}
          register={register("about", {
            required: "Şirket hakkında kısa bir metin yaz.",
          })}
          error={errors.about?.message}
        />
      </form>
    </Modal>
  );
};

const CompanyProfile = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [info, setInfo] = useState(null);
  const [applicantsByJob, setApplicantsByJob] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const isOwnCompanyProfile = info?._id === user?._id;
  const openJobCount = info?.jobPosts?.length || 0;
  const applicantRows = (info?.jobPosts || []).flatMap((job) =>
    (applicantsByJob[job?._id] || []).map((applicant) => ({
      ...applicant,
      jobId: job?._id,
      jobTitleApplied: job?.jobTitle,
      jobLocation: job?.location,
      jobType: job?.jobType,
      status: applicant?.applicationStatusValue || "pending",
    }))
  );
  const statusCounts = applicantRows.reduce(
    (counts, applicant) => ({
      ...counts,
      [applicant.status]: (counts[applicant.status] || 0) + 1,
    }),
    {}
  );
  const totalApplicantCount = applicantRows.length;
  const companyOverview = [
    {
      label: "Açık ilan",
      value: openJobCount,
      icon: <FiBriefcase />,
    },
    {
      label: "Toplam başvuru",
      value: totalApplicantCount,
      icon: <FiUsers />,
    },
    {
      label: "Bekleyen",
      value: statusCounts.pending || 0,
      icon: <FiFileText />,
    },
    {
      label: "İncelenen",
      value: statusCounts.reviewed || 0,
      icon: <FiFileText />,
    },
    {
      label: "Kabul",
      value: statusCounts.accepted || 0,
      icon: <FiUsers />,
    },
    {
      label: "Red",
      value: statusCounts.rejected || 0,
      icon: <FiUsers />,
    },
  ];
  const contactCards = [
    {
      label: "Konum",
      value: info?.location ?? "Konum yok",
      icon: <HiLocationMarker />,
    },
    {
      label: "E-posta",
      value: info?.email ?? "E-posta yok",
      icon: <AiOutlineMail />,
    },
    {
      label: "Telefon",
      value: info?.contact ?? "Telefon yok",
      icon: <FiPhoneCall />,
    },
  ];

  const fetchCompany = async () => {
    const id = params.id || user?._id;

    if (!id) return;

    setIsLoading(true);

    try {
      const res = await apiRequest({
        url: "/companies/get-company/" + id,
        method: "GET",
      });

      setInfo(res?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCompanyApplications = async () => {
    try {
      const res = await apiRequest({
        url: "/companies/applications",
        token: user?.token,
        method: "GET",
      });

      if (res?.success) {
        setApplicantsByJob(res?.data || {});
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleApplicationStatusChange = async (jobId, applicantId, status) => {
    const previousApplicantsByJob = applicantsByJob;

    setApplicantsByJob((prev) => ({
      ...prev,
      [jobId]: (prev[jobId] || []).map((applicant) =>
        applicant?._id === applicantId
          ? { ...applicant, applicationStatusValue: status }
          : applicant
      ),
    }));

    try {
      const res = await apiRequest({
        url: `/jobs/application-status/${jobId}/${applicantId}`,
        token: user?.token,
        method: "PATCH",
        data: { status },
      });

      if (!res?.success) {
        setApplicantsByJob(previousApplicantsByJob);
        toast.error(res?.message || "Başvuru durumu güncellenemedi.");
        fetchCompanyApplications();
        return;
      }

      toast.success("Başvuru durumu güncellendi.");
    } catch (error) {
      console.log(error);
      setApplicantsByJob(previousApplicantsByJob);
      toast.error("Başvuru durumu güncellenemedi.");
      fetchCompanyApplications();
    }
  };

  useEffect(() => {
    fetchCompany();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [params.id, user?._id]);

  useEffect(() => {
    if (isOwnCompanyProfile && user?.token) {
      fetchCompanyApplications();
    }
  }, [isOwnCompanyProfile, user?.token]);

  if (isLoading) {
    return <Loading />;
  }

  if (!info) {
    return (
      <PageContainer>
        <EmptyState
          title="Şirket bulunamadı"
          description="Görüntülemek istediğin şirket profili kaldırılmış veya erişilemez olabilir."
        />
      </PageContainer>
    );
  }

  return (
    <div>
      <PageContainer className="space-y-8">
        {isOwnCompanyProfile ? (
          <>
            <section className="rounded-panel border border-slate-200 bg-white p-5 md:p-6">
              <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
                <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start">
                  <Avatar
                    src={info?.profileUrl || NoProfile}
                    alt={info?.name}
                    size="xl"
                    shape="square"
                    ring
                    className="h-20 w-20 border border-slate-200 bg-white"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-textSecondary">
                      İşveren paneli
                    </p>
                    <h1 className="mt-1 truncate text-2xl font-semibold text-textPrimary">
                      {info?.name}
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-textSecondary">
                      İlanlarını, aday başvurularını ve süreç durumlarını tek
                      ekrandan takip et.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 md:justify-self-end">
                  <Button
                    variant="outline"
                    iconLeft={<FiEdit3 />}
                    onClick={() => setOpenForm(true)}
                  >
                    Profili düzenle
                  </Button>
                  <Link
                    to="/upload-job"
                    className="inline-flex h-[42px] items-center justify-center gap-2 rounded-control bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-hover"
                  >
                    <FiUpload /> İlan yayınla
                  </Link>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
                {companyOverview.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-card border border-slate-100 bg-surface-subtle p-4"
                  >
                    <span className="text-primary">{item.icon}</span>
                    <p className="mt-3 text-2xl font-semibold text-textPrimary">
                      {item.value}
                    </p>
                    <p className="mt-1 text-xs font-medium text-textSecondary">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
              <Card className="border-slate-200 bg-white p-0">
                <div className="border-b border-slate-100 p-5 md:p-6">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-textPrimary">
                        Başvuru yönetimi
                      </h2>
                      <p className="mt-1 text-sm text-textSecondary">
                        Adayları incele, CV/profil bilgilerine ulaş ve süreci
                        güncelle.
                      </p>
                    </div>
                    <Badge tone="primary">{totalApplicantCount} başvuru</Badge>
                  </div>
                </div>

                <div className="p-5 md:p-6">
                  {applicantRows.length > 0 ? (
                    <div className="grid gap-3">
                      {applicantRows.map((applicant) => (
                        <div
                          key={`${applicant.jobId}-${applicant._id}`}
                          className="grid gap-4 rounded-card border border-slate-200 bg-white p-4 lg:grid-cols-[minmax(0,1fr)_12rem] lg:items-center"
                        >
                          <div className="flex min-w-0 gap-3">
                            <Avatar
                              src={applicant?.profileUrl || NoProfile}
                              alt={`${applicant?.firstName || "Aday"} ${
                                applicant?.lastName || ""
                              }`}
                              size="md"
                            />
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <Link
                                  to={`/user-profile/${applicant?._id}`}
                                  className="truncate text-sm font-semibold text-textPrimary hover:text-primary"
                                >
                                  {applicant?.firstName} {applicant?.lastName}
                                </Link>
                                <Badge
                                  tone={getApplicationStatusTone(applicant.status)}
                                  size="sm"
                                >
                                  {getApplicationStatusLabel(applicant.status)}
                                </Badge>
                              </div>
                              <p className="mt-1 truncate text-xs text-primary">
                                {applicant?.jobTitle || "Unvan yok"}
                              </p>
                              <p className="mt-1 truncate text-xs text-textSecondary">
                                {applicant?.email}
                              </p>
                              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-textSecondary">
                                <span className="font-medium text-textPrimary">
                                  {applicant.jobTitleApplied}
                                </span>
                                <span>/</span>
                                <span>{applicant.jobLocation || "Konum yok"}</span>
                                <span>/</span>
                                <span>{getJobTypeLabel(applicant.jobType)}</span>
                              </div>
                              <div className="mt-3 flex flex-wrap gap-3">
                                <Link
                                  to={`/user-profile/${applicant?._id}`}
                                  className="text-xs font-semibold text-primary hover:underline"
                                >
                                  Profili görüntüle
                                </Link>
                                {applicant?.cvUrl && (
                                  <a
                                    href={applicant.cvUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                                  >
                                    <FiFileText /> CV görüntüle
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>

                          <Select
                            options={STATUS_OPTIONS}
                            value={applicant.status}
                            onChange={(status) =>
                              handleApplicationStatusChange(
                                applicant.jobId,
                                applicant._id,
                                status
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="Henüz başvuru yok"
                      description="İlanlarına aday başvurusu geldiğinde burada yönetilebilir bir liste olarak görünecek."
                    />
                  )}
                </div>
              </Card>

              <aside className="grid h-fit gap-4">
                <Card className="border-slate-200 bg-white p-5">
                  <h2 className="text-base font-semibold text-textPrimary">
                    Yayındaki ilanlar
                  </h2>
                  <p className="mt-1 text-sm text-textSecondary">
                    İlanlarını görüntüle veya düzenle.
                  </p>

                  <div className="mt-4 grid gap-3">
                    {info?.jobPosts?.length ? (
                      info.jobPosts.map((job) => {
                        const applicants = applicantsByJob[job?._id] || [];

                        return (
                          <div
                            key={job?._id}
                            className="rounded-card border border-slate-200 bg-white p-4"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="line-clamp-2 text-sm font-semibold text-textPrimary">
                                  {job?.jobTitle}
                                </p>
                                <p className="mt-1 text-xs text-textSecondary">
                                  {job?.location || "Konum yok"}
                                </p>
                              </div>
                              <Badge tone="neutral" size="sm">
                                {applicants.length} başvuru
                              </Badge>
                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-textSecondary">
                              <span>{getJobTypeLabel(job?.jobType)}</span>
                              <span>/</span>
                              <span>{formatSalary(job?.salary)} TL</span>
                              <span>/</span>
                              <span>{formatRelativeTime(job?.createdAt)}</span>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                              <Link
                                to={`/job-detail/${job?._id}`}
                                className="inline-flex h-9 items-center justify-center rounded-control border border-slate-200 bg-white px-3 text-xs font-semibold text-textPrimary transition hover:border-primary hover:text-primary"
                              >
                                İlanı görüntüle
                              </Link>
                              <Link
                                to={`/edit-job/${job?._id}`}
                                className="inline-flex h-9 items-center justify-center rounded-control bg-primary px-3 text-xs font-semibold text-white transition hover:bg-primary-hover"
                              >
                                Düzenle
                              </Link>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <EmptyState
                        title="Henüz ilan yok"
                        description="İlk ilanını yayınlayarak aday başvurularını toplamaya başlayabilirsin."
                        actionLabel="İlan yayınla"
                        onAction={() => navigate("/upload-job")}
                      />
                    )}
                  </div>
                </Card>
              </aside>
            </section>
          </>
        ) : (
          <>
            <section className="overflow-hidden rounded-panel border border-slate-200 bg-white">
              <div className="p-5 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <Avatar
                    src={info?.profileUrl || NoProfile}
                    alt={info?.name}
                    size="xl"
                    shape="square"
                    ring
                    className="h-20 w-20 border border-slate-200 bg-white"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-textSecondary">
                      Şirket profili
                    </p>
                    <h1 className="mt-1 truncate text-2xl font-semibold text-textPrimary">
                      {info?.name}
                    </h1>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-textSecondary">
                      {info?.about ||
                        "Bu şirket hakkında henüz açıklama eklenmemiş."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 border-t border-slate-100 px-6 py-6 md:grid-cols-3 md:px-8">
                {contactCards.map((item) => (
                  <div
                    key={item.label}
                    className="border-l-2 border-primary-subtle-active pl-4"
                  >
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase text-textSecondary">
                      <span className="text-primary">{item.icon}</span>
                      {item.label}
                    </p>
                    <p className="mt-2 truncate text-sm font-semibold text-textPrimary">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-lg font-semibold text-textPrimary">
                Yayındaki ilanlar
              </h2>
              {info?.jobPosts?.length ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {info.jobPosts.map((job) => (
                    <Link
                      key={job?._id}
                      to={`/job-detail/${job?._id}`}
                      className="rounded-panel border border-slate-200 bg-white p-5 transition hover:border-primary-subtle-active"
                    >
                      <p className="line-clamp-2 font-semibold text-textPrimary">
                        {job?.jobTitle}
                      </p>
                      <p className="mt-2 flex items-center gap-1 text-sm text-textSecondary">
                        <HiLocationMarker className="text-primary" />
                        {job?.location || "Konum yok"}
                      </p>
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <Badge tone="primary">{getJobTypeLabel(job?.jobType)}</Badge>
                        <span className="flex items-center gap-1 text-sm font-semibold text-textPrimary">
                          <LiaMoneyCheckAltSolid className="text-textSecondary" />
                          {formatSalary(job?.salary)} TL
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="Henüz ilan yok"
                  description="Bu şirketin yayında olan ilanı bulunmuyor."
                />
              )}
            </section>
          </>
        )}
      </PageContainer>

      <CompanyForm open={openForm} setOpen={setOpenForm} setInfo={setInfo} />
    </div>
  );
};

export default CompanyProfile;
