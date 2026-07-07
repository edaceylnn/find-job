import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { HiLocationMarker } from "react-icons/hi";
import { AiOutlineMail } from "react-icons/ai";
import { FiPhoneCall, FiEdit3, FiUpload, FiUsers, FiBriefcase } from "react-icons/fi";
import { LiaMoneyCheckAltSolid } from "react-icons/lia";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  CustomButton,
  EmptyState,
  Loading,
  TextInput,
} from "../components";
import { apiRequest, handleFileUpload } from "../utils";
import { Login } from "../redux/userSlice";
import { NoProfile } from "../assets";
import {
  formatRelativeTime,
  formatSalary,
  getApplicationStatusLabel,
  getJobTypeLabel,
} from "../utils/translations";

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
      setIsLoading(false);

      if (res.status === "failed") {
        console.log(res.message);
      } else {
        const updatedUser = { token: res?.token, ...(res?.user || res?.company) };

        dispatch(Login(updatedUser));
        localStorage.setItem("userInfo", JSON.stringify(updatedUser));
        setInfo(res?.user || res?.company);
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
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
    <>
      <Transition appear show={open ?? false} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-2xl transition-all">
                  <div className="border-b border-slate-100 px-6 py-5">
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-bold leading-6 text-slate-900"
                    >
                      Şirket profilini düzenle
                    </Dialog.Title>
                    <p className="mt-2 text-sm text-slate-500">
                      Adayların şirketini daha iyi tanıması için profil
                      bilgilerini güncel tut.
                    </p>
                  </div>

                  <form
                    className="w-full px-6 py-6"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col gap-4 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center">
                        <img
                          src={profilePreview || user?.profileUrl || NoProfile}
                          alt={user?.name}
                          className="h-20 w-20 rounded-2xl bg-white object-cover ring-1 ring-slate-200"
                        />

                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-700">
                            Şirket logosu
                          </p>
                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            Kare formatlı ve net bir logo daha iyi görünür.
                          </p>
                          <label className="mt-3 inline-flex cursor-pointer rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-600 transition hover:border-blue-600 hover:bg-blue-50">
                            Logo seç
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleProfileImageChange(e.target.files[0])
                              }
                            />
                          </label>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <TextInput
                          name="name"
                          label="Şirket adı"
                          type="text"
                          register={register("name", {
                            required: "Şirket adı zorunludur.",
                          })}
                          error={errors.name ? errors.name?.message : ""}
                        />

                        <TextInput
                          name="location"
                          label="Konum / adres"
                          placeholder="Örn. İstanbul"
                          type="text"
                          register={register("location", {
                            required: "Adres zorunludur.",
                          })}
                          error={errors.location ? errors.location?.message : ""}
                        />

                        <TextInput
                          name="contact"
                          label="Telefon"
                          placeholder="Telefon numarası"
                          type="text"
                          register={register("contact", {
                            required: "Telefon zorunludur.",
                          })}
                          error={errors.contact ? errors.contact?.message : ""}
                        />
                      </div>

                      <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium text-slate-600">
                          Şirket hakkında
                        </label>
                        <textarea
                          className="min-h-[140px] resize-none rounded-lg border border-slate-300 px-4 py-3 text-base text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          placeholder="Şirket kültürünü, çalışma alanlarını ve adaylara sunduğunuz fırsatları kısaca anlatın."
                          {...register("about", {
                            required: "Şirket hakkında kısa bir metin yaz.",
                          })}
                          aria-invalid={errors.about ? "true" : "false"}
                        ></textarea>
                        {errors.about && (
                          <span
                            role="alert"
                            className="mt-1 text-xs text-red-500"
                          >
                            {errors.about?.message}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                        <CustomButton
                          type="button"
                          title="Vazgeç"
                          onClick={closeModal}
                          containerStyles="justify-center rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-600 outline-none transition hover:bg-slate-50"
                        />

                        {isLoading ? (
                          <div className="flex min-w-[120px] justify-center">
                            <Loading />
                          </div>
                        ) : (
                          <CustomButton
                          type="submit"
                          containerStyles="justify-center rounded-full border border-transparent bg-blue-600 px-7 py-2.5 text-sm font-semibold text-white outline-none transition hover:bg-blue-700"
                          title={"Kaydet"}
                        />
                        )}
                      </div>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
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

  const fetchCompany = async () => {
    setIsLoading(true);
    let id = null;

    if (params.id && params.id !== undefined) {
      id = params?.id;
    } else {
      id = user?._id;
    }

    try {
      const res = await apiRequest({
        url: "/companies/get-company/" + id,
        method: "GET",
      });

      setInfo(res?.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false)
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
        fetchCompanyApplications();
      }
    } catch (error) {
      console.log(error);
      fetchCompanyApplications();
    }
  };

  useEffect(() => {
   fetchCompany()
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOwnCompanyProfile && user?.token) {
      fetchCompanyApplications();
    }
  }, [isOwnCompanyProfile, user?.token]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="bg-slate-50">
      <div className="container mx-auto px-5 py-8 md:py-10">
        <section className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-8 text-white md:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={info?.profileUrl || NoProfile}
                  alt={info?.name}
                  className="h-20 w-20 rounded-2xl border-4 border-white/30 bg-white object-cover"
                />

                <div>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
                    Şirket profili
                  </span>
                  <h1 className="mt-3 text-3xl font-bold">{info?.name}</h1>
                  <p className="mt-1 max-w-2xl text-sm text-blue-50">
                    İlanlarını ve başvurularını tek panelden yönet.
                  </p>
                </div>
              </div>

              {user?.user?.accountType === undefined &&
                info?._id === user?._id && (
                  <div className="flex flex-wrap gap-3">
                    <CustomButton
                      onClick={() => setOpenForm(true)}
                      title="Profili düzenle"
                      iconRight={<FiEdit3 />}
                      containerStyles="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 outline-none transition hover:bg-blue-50"
                    />

                    <Link to="/upload-job">
                      <CustomButton
                        title="İlan yayınla"
                        iconRight={<FiUpload />}
                        containerStyles="rounded-full border border-white/60 px-5 py-2.5 text-sm font-semibold text-white outline-none transition hover:bg-white/10"
                      />
                    </Link>
                  </div>
                )}
            </div>
          </div>

          <div className="grid gap-4 px-6 py-6 md:grid-cols-2 lg:grid-cols-4 md:px-8">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="flex items-center gap-2 text-sm text-slate-500">
                <HiLocationMarker className="text-blue-600" />
                Konum
              </p>
              <p className="mt-2 font-semibold text-slate-800">
                {info?.location ?? "Konum yok"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="flex items-center gap-2 text-sm text-slate-500">
                <AiOutlineMail className="text-blue-600" />
                E-posta
              </p>
              <p className="mt-2 truncate font-semibold text-slate-800">
                {info?.email ?? "E-posta yok"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="flex items-center gap-2 text-sm text-slate-500">
                <FiPhoneCall className="text-blue-600" />
                Telefon
              </p>
              <p className="mt-2 font-semibold text-slate-800">
                {info?.contact ?? "Telefon yok"}
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-4">
              <p className="flex items-center gap-2 text-sm text-blue-600">
                <FiBriefcase />
                Yayındaki ilan
              </p>
              <p className="mt-2 text-2xl font-bold text-blue-700">
                {info?.jobPosts?.length || 0}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex flex-col gap-1">
            <p className="text-xl font-bold text-slate-800">Yayındaki ilanlar</p>
            {isOwnCompanyProfile && (
              <span className="text-sm text-slate-500">
                İlanlarına gelen başvurular her kartın içinde listelenir.
              </span>
            )}
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
          {info?.jobPosts?.map((job, index) => {
            const applicants = applicantsByJob[job?._id] || [];

            return (
              <article
                key={job?._id || index}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:border-blue-100 hover:shadow-md"
              >
                <Link to={`/job-detail/${job?._id}`} className="block p-5">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 gap-4">
                      <img
                        src={info?.profileUrl || NoProfile}
                        alt={info?.name}
                        className="h-16 w-16 shrink-0 rounded-xl object-cover ring-1 ring-slate-100"
                      />

                      <div className="min-w-0">
                        <h3 className="line-clamp-2 text-xl font-bold leading-7 text-slate-900">
                          {job?.jobTitle}
                        </h3>
                        <p className="mt-1 flex items-center gap-1 text-sm font-medium text-slate-500">
                          <HiLocationMarker className="text-blue-600" />
                          {job?.location || "Konum yok"}
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 text-sm font-medium text-slate-400">
                      {formatRelativeTime(job?.createdAt)}
                    </span>
                  </div>

                  <p className="mt-5 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-slate-600">
                    {job?.detail?.[0]?.desc ||
                      "Bu ilan için henüz açıklama eklenmedi."}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                        <LiaMoneyCheckAltSolid className="text-slate-500" />
                        {formatSalary(job?.salary)} TL
                      </span>
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                        {getJobTypeLabel(job?.jobType)}
                      </span>
                    </div>

                    {isOwnCompanyProfile && (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {applicants.length} başvuru
                      </span>
                    )}
                  </div>
                </Link>

                {isOwnCompanyProfile && (
                  <div className="border-t border-slate-100 bg-slate-50/70 p-5">
                    <div className="mb-4 flex items-center justify-between gap-2">
                      <p className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <FiUsers className="text-blue-600" />
                        Başvuranlar
                      </p>
                      <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                        {applicants.length}
                      </span>
                    </div>

                    {applicants.length > 0 ? (
                      <div className="flex flex-col gap-3">
                        {applicants.map((applicant) => (
                          <div
                            key={applicant?._id}
                            className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-white p-3 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <Link
                              to={`/user-profile/${applicant?._id}`}
                              className="flex min-w-0 items-center gap-3"
                            >
                              <img
                                src={applicant?.profileUrl || NoProfile}
                                alt={`${applicant?.firstName || "Aday"} ${
                                  applicant?.lastName || ""
                                }`}
                                className="h-10 w-10 rounded-full object-cover"
                              />

                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-slate-700">
                                  {applicant?.firstName} {applicant?.lastName}
                                </p>
                                <p className="truncate text-xs text-blue-600">
                                  {applicant?.email}
                                </p>
                                {applicant?.jobTitle && (
                                  <p className="truncate text-xs text-slate-500">
                                    {applicant.jobTitle}
                                  </p>
                                )}
                              </div>
                            </Link>

                            <select
                              value={applicant?.applicationStatusValue || "pending"}
                              onChange={(e) =>
                                handleApplicationStatusChange(
                                  job?._id,
                                  applicant?._id,
                                  e.target.value
                                )
                              }
                              className="rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 outline-none transition focus:border-blue-500 focus:bg-white"
                            >
                              {[
                                "pending",
                                "reviewed",
                                "accepted",
                                "rejected",
                              ].map((status) => (
                                <option key={status} value={status}>
                                  {getApplicationStatusLabel(status)}
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-blue-100 bg-white px-4 py-5 text-center">
                        <p className="text-sm font-semibold text-slate-700">
                          Henüz başvuru yok
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Bu ilana aday başvurusu geldiğinde burada
                          listelenecek.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
          {!info?.jobPosts?.length && (
            <EmptyState
              title="Henüz ilan yok"
              description="İlk ilanını yayınlayarak aday başvurularını bu panelde toplamaya başlayabilirsin."
              actionLabel={isOwnCompanyProfile ? "İlan yayınla" : undefined}
              onAction={
                isOwnCompanyProfile
                  ? () => {
                      navigate("/upload-job");
                    }
                  : undefined
              }
            />
          )}
          </div>
        </section>
      </div>

      <CompanyForm open={openForm} setOpen={setOpenForm} setInfo={setInfo} />
    </div>
  );
};

export default CompanyProfile;
