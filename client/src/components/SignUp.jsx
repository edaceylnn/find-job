import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FiBriefcase, FiCheckCircle, FiUser, FiX } from "react-icons/fi";
import TextInput from "./TextInput";
import CustomButton from "./CustomButton";
import { apiRequest } from "../utils";
import { Login } from "../redux/userSlice";

const fieldStyles =
  "rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100";

const authErrorMessages = {
  "Email Already Registered. Please Login":
    "Bu e-posta adresi zaten kayıtlı. Lütfen giriş yap.",
  "Email Address already exists": "Bu e-posta adresi zaten kayıtlı.",
  "Invalid email or Password": "E-posta veya şifre hatalı.",
  "Invalid -email or password": "E-posta veya şifre hatalı.",
  "Invalid email or password": "E-posta veya şifre hatalı.",
  "Lütfen e-posta ve şifre bilgilerini gir.":
    "Lütfen e-posta ve şifre bilgilerini gir.",
};

const getAuthErrorMessage = (message) =>
  authErrorMessages[message] || message || "Bir hata oluştu. Tekrar dene.";

const SignUp = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [accountType, setAccountType] = useState("seeker");
  const [errMsg, setErrMsg] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetError, setResetError] = useState("");
  const [isResetSubmitting, setIsResetSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
  });

  const from = location.state?.from?.pathname || "/";

  const closeModal = () => {
    setOpen(false);
    navigate("/");
  };

  const changeMode = (nextIsRegister) => {
    setIsRegister(nextIsRegister);
    setShowForgotPassword(false);
    setErrMsg("");
    setResetError("");
    setResetMessage("");
    reset();
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsResetSubmitting(true);
    setResetError("");
    setResetMessage("");

    try {
      const res = await apiRequest({
        url:
          accountType === "seeker"
            ? "auth/forgot-password"
            : "companies/forgot-password",
        data: { email: resetEmail },
        method: "POST",
      });

      if (res?.success) {
        setResetMessage(
          res?.message ||
            "Şifre sıfırlama bağlantısı e-posta adresine gönderildi.",
        );
      } else {
        setResetError(getAuthErrorMessage(res?.message));
      }
    } catch (error) {
      console.log(error);
      setResetError("Sıfırlama kodu oluşturulamadı. Lütfen tekrar dene.");
    } finally {
      setIsResetSubmitting(false);
    }
  };

  const onSubmit = async (formData) => {
    setErrMsg("");

    const url = isRegister
      ? accountType === "seeker"
        ? "auth/register"
        : "companies/register"
      : accountType === "seeker"
        ? "auth/login"
        : "companies/login";

    try {
      const res = await apiRequest({
        url,
        data: formData,
        method: "POST",
      });

      if (res?.status === "failed" || res?.success === false) {
        setErrMsg(getAuthErrorMessage(res?.message));
        return;
      }

      const userData = { token: res?.token, ...res?.user };

      dispatch(Login(userData));
      localStorage.setItem("userInfo", JSON.stringify(userData));
      window.location.replace(from);
    } catch (error) {
      console.log(error);
      setErrMsg("İşlem sırasında bir hata oluştu. Lütfen tekrar dene.");
    }
  };

  return (
    <Transition appear show={open || false} as={Fragment}>
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
          <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center px-4 py-8 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 scale-95"
              enterTo="opacity-100 translate-y-0 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 scale-100"
              leaveTo="opacity-0 translate-y-4 scale-95"
            >
              <Dialog.Panel className="grid w-full max-w-4xl transform overflow-hidden rounded-3xl bg-white text-left align-middle shadow-2xl transition-all md:grid-cols-[0.9fr_1.1fr]">
                <div className="hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 p-8 text-white md:flex md:flex-col md:justify-between">
                  <div>
                    <Dialog.Title
                      as="h2"
                      className="text-3xl font-bold leading-tight"
                    >
                      Kariyer fırsatlarına tek yerden ulaş.
                    </Dialog.Title>
                    <p className="mt-4 text-sm leading-6 text-blue-50">
                      Aday olarak ilanlara başvurabilir, şirket hesabıyla ilan
                      yayınlayıp başvuruları yönetebilirsin.
                    </p>
                  </div>

                  <div className="space-y-3 text-sm text-blue-50">
                    <p className="flex items-center gap-2">
                      <FiCheckCircle /> Hızlı başvuru takibi
                    </p>
                    <p className="flex items-center gap-2">
                      <FiCheckCircle /> Şirket ve aday hesapları
                    </p>
                    <p className="flex items-center gap-2">
                      <FiCheckCircle /> Modern iş ilanı deneyimi
                    </p>
                  </div>
                </div>

                <div className="relative px-5 py-6 sm:px-8">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="absolute right-5 top-5 rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                    aria-label="Kapat"
                  >
                    <FiX />
                  </button>

                  <div className="pr-12">
                    <p className="text-sm font-semibold text-blue-600">
                      {isRegister ? "Yeni hesap" : "Tekrar hoş geldin"}
                    </p>
                    <h1 className="mt-2 text-2xl font-bold text-slate-900">
                      {isRegister ? "Hesap oluştur" : "Giriş yap"}
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {isRegister
                        ? "Devam etmek için hesap türünü seç ve bilgilerini gir."
                        : "Hesabına erişmek için e-posta ve şifreni gir."}
                    </p>
                  </div>

                  {showForgotPassword ? (
                    <form
                      className="mt-6 flex w-full flex-col gap-4"
                      onSubmit={handleForgotPassword}
                    >
                      <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
                        E-posta adresi
                        <input
                          type="email"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          placeholder="ornek@email.com"
                          className={fieldStyles}
                          required
                        />
                      </label>

                      {resetMessage && (
                        <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                          {resetMessage}
                        </div>
                      )}
                      {resetError && (
                        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                          {resetError}
                        </div>
                      )}

                      <CustomButton
                        type="submit"
                        disabled={isResetSubmitting}
                        containerStyles="w-full justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white outline-none transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                        title={
                          isResetSubmitting
                            ? "İşleniyor..."
                            : "Sıfırlama bağlantısı gönder"
                        }
                      />

                      <button
                        type="button"
                        className="text-center text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                        onClick={() => {
                          setShowForgotPassword(false);
                          setResetError("");
                          setResetMessage("");
                        }}
                      >
                        Giriş ekranına dön
                      </button>
                    </form>
                  ) : (
                    <>
                      <div className="mt-6 grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                            accountType === "seeker"
                              ? "border-blue-600 bg-blue-50 text-blue-700"
                              : "border-slate-200 text-slate-600 hover:border-blue-200 hover:bg-blue-50"
                          }`}
                          onClick={() => setAccountType("seeker")}
                        >
                          <FiUser />
                          Aday
                        </button>
                        <button
                          type="button"
                          className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                            accountType === "company"
                              ? "border-blue-600 bg-blue-50 text-blue-700"
                              : "border-slate-200 text-slate-600 hover:border-blue-200 hover:bg-blue-50"
                          }`}
                          onClick={() => setAccountType("company")}
                        >
                          <FiBriefcase />
                          Şirket
                        </button>
                      </div>

                      <form
                        className="mt-5 flex w-full flex-col gap-4"
                        onSubmit={handleSubmit(onSubmit)}
                      >
                        {isRegister && (
                          <div
                            className={`grid gap-4 ${
                              accountType === "seeker" ? "sm:grid-cols-2" : ""
                            }`}
                          >
                            <TextInput
                              name={
                                accountType === "seeker" ? "firstName" : "name"
                              }
                              label={
                                accountType === "seeker" ? "Ad" : "Şirket adı"
                              }
                              placeholder={
                                accountType === "seeker"
                                  ? "Örn. Eda"
                                  : "Şirket adı"
                              }
                              type="text"
                              styles={fieldStyles}
                              register={register(
                                accountType === "seeker" ? "firstName" : "name",
                                {
                                  required:
                                    accountType === "seeker"
                                      ? "Ad zorunludur."
                                      : "Şirket adı zorunludur.",
                                },
                              )}
                              error={
                                accountType === "seeker"
                                  ? errors.firstName?.message || ""
                                  : errors.name?.message || ""
                              }
                            />

                            {accountType === "seeker" && (
                              <TextInput
                                name="lastName"
                                label="Soyad"
                                placeholder="Örn. Ceylan"
                                type="text"
                                styles={fieldStyles}
                                register={register("lastName", {
                                  required: "Soyad zorunludur.",
                                })}
                                error={errors.lastName?.message || ""}
                              />
                            )}
                          </div>
                        )}

                        <TextInput
                          name="email"
                          label="E-posta adresi"
                          placeholder="ornek@email.com"
                          type="email"
                          styles={fieldStyles}
                          register={register("email", {
                            required: "E-posta adresi zorunludur.",
                          })}
                          error={errors.email?.message || ""}
                        />

                        <div
                          className={`grid gap-4 ${
                            isRegister ? "sm:grid-cols-2" : ""
                          }`}
                        >
                          <TextInput
                            name="password"
                            label="Şifre"
                            placeholder="Şifreni gir"
                            type="password"
                            styles={fieldStyles}
                            register={register("password", {
                              required: "Şifre zorunludur.",
                            })}
                            error={errors.password?.message || ""}
                          />

                          {isRegister && (
                            <TextInput
                              name="cPassword"
                              label="Şifre tekrar"
                              placeholder="Şifreni tekrar gir"
                              type="password"
                              styles={fieldStyles}
                              register={register("cPassword", {
                                validate: (value) => {
                                  const { password } = getValues();
                                  return (
                                    password === value ||
                                    "Şifreler eşleşmiyor."
                                  );
                                },
                              })}
                              error={errors.cPassword?.message || ""}
                            />
                          )}
                        </div>

                        {!isRegister && (
                          <button
                            type="button"
                            className="w-fit text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                            onClick={() => {
                              setShowForgotPassword(true);
                              setResetEmail("");
                              setResetError("");
                              setResetMessage("");
                            }}
                          >
                            Şifremi unuttum
                          </button>
                        )}

                        {errMsg && (
                          <div
                            role="alert"
                            className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
                          >
                            {errMsg}
                          </div>
                        )}

                        <CustomButton
                          type="submit"
                          disabled={isSubmitting}
                          containerStyles="mt-1 w-full justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white outline-none transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                          title={
                            isSubmitting
                              ? "İşleniyor..."
                              : isRegister
                                ? "Hesap oluştur"
                                : "Giriş yap"
                          }
                        />
                      </form>

                      <p className="mt-5 text-center text-sm text-slate-500">
                        {isRegister
                          ? "Zaten hesabın var mı?"
                          : "Hesabın yok mu?"}
                        <button
                          type="button"
                          className="ml-2 font-semibold text-blue-600 transition hover:text-blue-700"
                          onClick={() => changeMode(!isRegister)}
                        >
                          {isRegister ? "Giriş yap" : "Kayıt ol"}
                        </button>
                      </p>
                    </>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SignUp;
