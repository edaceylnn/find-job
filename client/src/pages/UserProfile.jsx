import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { HiLocationMarker } from "react-icons/hi";
import { AiOutlineMail } from "react-icons/ai";
import {
  FiBookmark,
  FiCamera,
  FiEdit3,
  FiFileText,
  FiPhoneCall,
  FiSend,
} from "react-icons/fi";
import toast from "react-hot-toast";
import {
  Avatar,
  Button,
  Card,
  EmptyState,
  Input,
  Loading,
  Modal,
  PageContainer,
  Textarea,
} from "../components";
import { NoProfile } from "../assets";
import { apiRequest, handleFileUpload } from "../utils";
import { Login } from "../redux/userSlice";

const USER_FORM_ID = "user-profile-form";

const UserForm = ({ open, setOpen }) => {
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
  const [cvFile, setCvFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProfileImageChange = (file) => {
    setProfileImage(file);

    if (file) {
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const uploadedProfileUrl =
        profileImage && (await handleFileUpload(profileImage));

      let uploadedCvUrl = user?.cvUrl || "";
      if (cvFile) {
        uploadedCvUrl = await handleFileUpload(cvFile, "raw");
        if (!uploadedCvUrl) {
          toast.error("CV yüklenemedi, lütfen tekrar dene.");
          setIsSubmitting(false);
          return;
        }
      }

      const newData = {
        ...data,
        ...(uploadedProfileUrl ? { profileUrl: uploadedProfileUrl } : {}),
        cvUrl: uploadedCvUrl,
      };

      const res = await apiRequest({
        url: "/users/update-user",
        token: user?.token,
        data: newData,
        method: "PUT",
      });

      if (res) {
        const updated = { token: res?.token, ...res?.user };

        dispatch(Login(updated));
        localStorage.setItem("userInfo", JSON.stringify(updated));
        window.location.reload();
      }
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      console.log(error);
    }
  };

  const closeModal = () => setOpen(false);

  return (
    <Modal
      open={open}
      onClose={closeModal}
      title="Profili düzenle"
      description="Aday profilindeki bilgileri güncelle."
      size="lg"
      footer={
        <>
          <Button type="button" variant="outline" onClick={closeModal}>
            İptal
          </Button>
          <Button type="submit" form={USER_FORM_ID} loading={isSubmitting}>
            Değişiklikleri kaydet
          </Button>
        </>
      }
    >
      <form
        id={USER_FORM_ID}
        className="flex w-full flex-col gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-4 rounded-card bg-surface-subtle p-4 sm:flex-row sm:items-center">
          <img
            src={profilePreview || user?.profileUrl || NoProfile}
            alt={user?.firstName}
            className="h-20 w-20 rounded-panel bg-white object-cover ring-1 ring-slate-200"
          />

          <div className="flex-1">
            <p className="text-sm font-semibold text-textPrimary">
              Profil fotoğrafı
            </p>
            <p className="mt-1 text-xs leading-5 text-textSecondary">
              Kare formatlı, net bir fotoğraf daha iyi görünür.
            </p>
            <Button
              as="label"
              variant="outline"
              size="sm"
              iconLeft={<FiCamera />}
              className="mt-3"
            >
              Fotoğraf seç
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleProfileImageChange(e.target.files[0])}
              />
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-card bg-surface-subtle p-4 sm:flex-row sm:items-center">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-card bg-white text-primary ring-1 ring-slate-200">
            <FiFileText className="text-base" />
          </div>

          <div className="flex-1">
            <p className="text-sm font-semibold text-textPrimary">
              Özgeçmiş (CV)
            </p>
            <p className="mt-1 text-xs leading-5 text-textSecondary">
              {cvFile
                ? cvFile.name
                : user?.cvUrl
                ? "Bir CV yüklü."
                : "Henüz CV yüklemedin."}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Button
                as="label"
                variant="outline"
                size="sm"
                iconLeft={<FiFileText />}
              >
                {user?.cvUrl || cvFile ? "CV'yi değiştir" : "CV yükle"}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => setCvFile(e.target.files[0])}
                />
              </Button>

              {user?.cvUrl && !cvFile && (
                <a
                  href={user.cvUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Mevcut CV&apos;yi görüntüle
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="grid w-full gap-4 md:grid-cols-2">
          <Input
            name="firstName"
            label="Ad"
            placeholder="Eda"
            register={register("firstName", { required: "Ad zorunludur." })}
            error={errors.firstName?.message}
          />
          <Input
            name="lastName"
            label="Soyad"
            placeholder="Ceylan"
            register={register("lastName", { required: "Soyad zorunludur." })}
            error={errors.lastName?.message}
          />
        </div>

        <div className="grid w-full gap-4 md:grid-cols-2">
          <Input
            name="contact"
            label="Telefon"
            placeholder="Telefon numarası"
            register={register("contact", { required: "Telefon zorunludur." })}
            error={errors.contact?.message}
          />
          <Input
            name="location"
            label="Konum"
            placeholder="Konum"
            register={register("location", { required: "Konum zorunludur." })}
            error={errors.location?.message}
          />
        </div>

        <Input
          name="jobTitle"
          label="Unvan"
          placeholder="Frontend Developer"
          register={register("jobTitle", { required: "Unvan zorunludur." })}
          error={errors.jobTitle?.message}
        />

        <Textarea
          name="about"
          label="Hakkında"
          placeholder="Kendini, hedeflerini ve güçlü yönlerini kısaca anlat."
          register={register("about", {
            required: "Kendin ve projelerin hakkında kısa bir metin yaz.",
          })}
          error={errors.about?.message}
        />
      </form>
    </Modal>
  );
};

const UserProfile = () => {
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [viewedUser, setViewedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isOwnProfile = !params.id || params.id === user?._id;
  const userInfo = isOwnProfile ? user : viewedUser;
  const contactItems = [
    {
      label: "Konum",
      value: userInfo?.location ?? "Konum yok",
      icon: <HiLocationMarker />,
    },
    {
      label: "E-posta",
      value: userInfo?.email ?? "E-posta yok",
      icon: <AiOutlineMail />,
    },
    {
      label: "Telefon",
      value: userInfo?.contact ?? "Telefon yok",
      icon: <FiPhoneCall />,
    },
  ];
  const profileActions = [
    {
      label: "Başvurularım",
      description: "Gönderdiğin başvuruları ve durumlarını takip et.",
      to: "/applications",
      icon: <FiSend />,
    },
    {
      label: "Kaydedilen ilanlar",
      description: "Sonra bakmak istediğin fırsatları burada tut.",
      to: "/saved-jobs",
      icon: <FiBookmark />,
    },
  ];

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isOwnProfile) return;

      setIsLoading(true);
      try {
        const res = await apiRequest({
          url: `/users/get-user/${params.id}`,
          token: user?.token,
          method: "GET",
        });

        if (res?.success) {
          setViewedUser(res?.user);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [isOwnProfile, params.id, user?.token]);

  if (isLoading) {
    return (
      <div className="py-16">
        <Loading />
      </div>
    );
  }

  if (!userInfo) {
    return (
      <PageContainer>
        <EmptyState
          title="Aday bulunamadı"
          description="Görüntülemek istediğin aday profili kaldırılmış veya erişilemez olabilir."
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer as="main" className="space-y-8">
      <section className="overflow-hidden rounded-panel border border-slate-200 bg-white">
        <div className="relative p-5 md:p-6">
          <div className="mb-5 flex flex-wrap gap-3 sm:absolute sm:right-5 sm:top-5 sm:mb-0 md:right-6 md:top-6">
            {isOwnProfile && (
              <Button
                variant="primary"
                iconLeft={<FiEdit3 />}
                onClick={() => setOpen(true)}
              >
                Profili düzenle
              </Button>
            )}
            {userInfo?.cvUrl && (
              <a
                href={userInfo.cvUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-[42px] items-center justify-center gap-2 rounded-control border border-slate-300 bg-white px-5 text-sm font-semibold text-textPrimary transition hover:border-primary hover:text-primary"
              >
                <FiFileText /> CV görüntüle
              </a>
            )}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <Avatar
              src={userInfo?.profileUrl || NoProfile}
              alt={userInfo?.firstName}
              size="xl"
              ring
              className="h-20 w-20 shrink-0 border border-slate-200 bg-white md:h-24 md:w-24"
            />

            <div className="min-w-0 flex-1 sm:pr-64">
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-textSecondary">
                <span>Profil yayında</span>
                {userInfo?.cvUrl && (
                  <>
                    <span className="text-slate-300">/</span>
                    <span className="inline-flex items-center gap-1.5">
                      <FiFileText />
                      CV yüklü
                    </span>
                  </>
                )}
              </div>

              <h1 className="mt-2 truncate text-xl font-semibold leading-tight text-textPrimary md:text-2xl">
                {userInfo?.firstName + " " + userInfo?.lastName}
              </h1>
              <p className="mt-1 text-sm font-medium text-primary">
                {userInfo?.jobTitle || "Unvan ekle"}
              </p>
              <p className="mt-3 line-clamp-2 max-w-3xl text-sm leading-6 text-textSecondary">
                {userInfo?.about ||
                  (isOwnProfile
                    ? "Kısa bir profesyonel özet ekleyerek işverenlerin seni ve güçlü yönlerini ilk bakışta anlamasını sağlayabilirsin."
                    : "Bu adayın profesyonel özeti henüz eklenmemiş.")}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-0 border-t border-slate-100 bg-white sm:grid-cols-2 md:grid-cols-3">
          {contactItems.map((item) => (
            <div
              key={item.label}
              className="flex min-w-0 items-center gap-3 border-b border-slate-100 px-5 py-4 last:border-b-0 md:border-b-0 md:border-r md:px-6 md:last:border-r-0"
            >
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-card bg-surface-subtle text-primary">
                {item.icon}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-textSecondary">
                  {item.label}
                </p>
                <p className="mt-0.5 truncate text-sm font-semibold text-textPrimary">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <Card className="border-slate-200/80 bg-white p-0">
          <div className="border-b border-slate-100 p-6 md:p-8">
            <h2 className="text-xl font-semibold text-textPrimary">Hakkında</h2>
          </div>

          <div className="p-6 md:p-8">
            <p className="max-w-3xl text-sm leading-8 text-textSecondary">
              {userInfo?.about ?? "Hakkında bilgisi bulunmuyor."}
            </p>
          </div>
        </Card>

        <div className="grid gap-4">
          {isOwnProfile && (
            <Card className="border-slate-200/80 bg-white p-5">
              <p className="font-semibold text-textPrimary">Profil kısayolları</p>
              <div className="mt-4 grid gap-3">
                {profileActions.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="group flex items-center gap-3 rounded-card border border-slate-100 bg-surface-subtle p-3 transition hover:border-primary-subtle-active hover:bg-primary-subtle"
                  >
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-card bg-white text-primary shadow-card transition group-hover:bg-primary group-hover:text-white">
                      {item.icon}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-textPrimary">
                        {item.label}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-textSecondary">
                        {item.description}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </Card>
          )}

        </div>
      </section>

      {isOwnProfile && <UserForm open={open} setOpen={setOpen} />}
    </PageContainer>
  );
};

export default UserProfile;
