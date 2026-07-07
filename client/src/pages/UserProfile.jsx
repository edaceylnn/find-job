import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { HiLocationMarker } from "react-icons/hi";
import { AiOutlineMail } from "react-icons/ai";
import { FiCamera, FiPhoneCall, FiX } from "react-icons/fi";
import { CustomButton, EmptyState, Loading, TextInput } from "../components";
import { NoProfile } from "../assets";
import { apiRequest, handleFileUpload } from "../utils";
import { Login } from "../redux/userSlice";

const inputStyles =
  "rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100";

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
      const url = profileImage && (await handleFileUpload(profileImage));

      const newData = url ? { ...data, profileUrl: url } : data;

      const res = await apiRequest({
        url: "/users/update-user",
        token: user?.token,
        data: newData,
        method: "PUT",
      });

      if (res) {
        const newData = { token: res?.token, ...res?.user };

        dispatch(Login(newData));
        localStorage.setItem("userInfo", JSON.stringify(newData));
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
            <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm" />
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
                  <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
                    <div>
                      <Dialog.Title
                        as="h3"
                        className="text-xl font-bold leading-6 text-slate-900"
                      >
                        Profili düzenle
                      </Dialog.Title>
                      <p className="mt-2 text-sm text-slate-500">
                        Aday profilindeki bilgileri güncelle.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={closeModal}
                      className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                      aria-label="Kapat"
                    >
                      <FiX />
                    </button>
                  </div>

                  <form
                    className="w-full flex flex-col gap-5 px-6 py-6"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className="flex flex-col gap-4 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center">
                      <img
                        src={profilePreview || user?.profileUrl || NoProfile}
                        alt={user?.firstName}
                        className="h-20 w-20 rounded-2xl bg-white object-cover ring-1 ring-slate-200"
                      />

                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-700">
                          Profil fotoğrafı
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          Kare formatlı, net bir fotoğraf daha iyi görünür.
                        </p>
                        <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-600 transition hover:border-blue-600 hover:bg-blue-50">
                          <FiCamera />
                          Fotoğraf seç
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

                    <div className="grid w-full gap-4 md:grid-cols-2">
                      <div>
                        <TextInput
                          name="firstName"
                          label="Ad"
                          placeholder="Eda"
                          type="text"
                          styles={inputStyles}
                          register={register("firstName", {
                            required: "Ad zorunludur.",
                          })}
                          error={
                            errors.firstName ? errors.firstName?.message : ""
                          }
                        />
                      </div>
                      <div>
                        <TextInput
                          name="lastName"
                          label="Soyad"
                          placeholder="Ceylan"
                          type="text"
                          styles={inputStyles}
                          register={register("lastName", {
                            required: "Soyad zorunludur.",
                          })}
                          error={
                            errors.lastName ? errors.lastName?.message : ""
                          }
                        />
                      </div>
                    </div>

                    <div className="grid w-full gap-4 md:grid-cols-2">
                      <div>
                        <TextInput
                          name="contact"
                          label="Telefon"
                          placeholder="Telefon numarası"
                          type="text"
                          styles={inputStyles}
                          register={register("contact", {
                            required: "Telefon zorunludur.",
                          })}
                          error={errors.contact ? errors.contact?.message : ""}
                        />
                      </div>

                      <div>
                        <TextInput
                          name="location"
                          label="Konum"
                          placeholder="Konum"
                          type="text"
                          styles={inputStyles}
                          register={register("location", {
                            required: "Konum zorunludur.",
                          })}
                          error={
                            errors.location ? errors.location?.message : ""
                          }
                        />
                      </div>
                    </div>

                    <TextInput
                      name="jobTitle"
                      label="Unvan"
                      placeholder="Frontend Developer"
                      type="text"
                      styles={inputStyles}
                      register={register("jobTitle", {
                        required: "Unvan zorunludur.",
                      })}
                      error={errors.jobTitle ? errors.jobTitle?.message : ""}
                    />

                    <div className="flex flex-col">
                      <label className="mb-1 text-sm font-medium text-slate-600">
                        Hakkında
                      </label>
                      <textarea
                        className="min-h-[120px] resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        rows={4}
                        cols={6}
                        placeholder="Kendini, hedeflerini ve güçlü yönlerini kısaca anlat."
                        {...register("about", {
                          required:
                            "Kendin ve projelerin hakkında kısa bir metin yaz.",
                        })}
                        aria-invalid={errors.about ? "true" : "false"}
                      ></textarea>
                      {errors.about && (
                        <span
                          role="alert"
                          className="text-xs text-red-500 mt-0.5"
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

                      {isSubmitting ? (
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

const UserProfile = () => {
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [viewedUser, setViewedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isOwnProfile = !params.id || params.id === user?._id;
  const userInfo = isOwnProfile ? user : viewedUser;

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
      <div className="container mx-auto px-5 py-12">
        <EmptyState
          title="Aday bulunamadı"
          description="Görüntülemek istediğin aday profili kaldırılmış veya erişilemez olabilir."
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto flex items-center justify-center px-5 py-10">
      <div className="w-full rounded-xl border border-slate-100 bg-white p-6 pb-12 shadow-sm md:w-2/3 md:p-10 2xl:w-2/4">
        <div className="flex flex-col items-center justify-center mb-4">
          <h1 className="text-4xl font-semibold text-slate-600">
            {userInfo?.firstName + " " + userInfo?.lastName}
          </h1>

          <h5 className="text-blue-700 text-base font-bold">
            {userInfo?.jobTitle || "Unvan ekle"}
          </h5>

          <div className="w-full flex flex-wrap lg:flex-row justify-between mt-8 text-sm">
            <p className="flex gap-1 items-center justify-center  px-3 py-1 text-slate-600 rounded-full">
              <HiLocationMarker /> {userInfo?.location ?? "Konum yok"}
            </p>
            <p className="flex gap-1 items-center justify-center  px-3 py-1 text-slate-600 rounded-full">
              <AiOutlineMail /> {userInfo?.email ?? "E-posta yok"}
            </p>
            <p className="flex gap-1 items-center justify-center  px-3 py-1 text-slate-600 rounded-full">
              <FiPhoneCall /> {userInfo?.contact ?? "Telefon yok"}
            </p>
          </div>
        </div>

        <hr />

        <div className="w-full py-10">
          <div className="w-full flex flex-col-reverse md:flex-row gap-8 py-6">
            <div className="w-full md:w-2/3 flex flex-col gap-4 text-lg text-slate-600 mt-20 md:mt-0">
              <p className="text-2xl font-semibold text-blue-700">HAKKINDA</p>
              <span className="text-base text-justify leading-7">
                {userInfo?.about ?? "Hakkında bilgisi bulunmuyor."}
              </span>
            </div>

            <div className="w-full md:w-1/3 h-44">
              <img
                src={userInfo?.profileUrl || NoProfile}
                alt={userInfo?.firstName}
                className="w-full h-48 object-contain rounded-lg"
              />
              <button
                className={`w-full md:w-64 bg-blue-600 text-white mt-4 py-2 rounded ${
                  isOwnProfile ? "" : "hidden"
                }`}
                onClick={() => setOpen(true)}
              >
                Profili düzenle
              </button>
            </div>
          </div>
        </div>
      </div>

      {isOwnProfile && <UserForm open={open} setOpen={setOpen} />}
    </div>
  );
};

export default UserProfile;
