import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FiBriefcase, FiCheckCircle, FiUser, FiX } from "react-icons/fi";
import Button from "./Button";
import IconButton from "./IconButton";
import Input from "./Input";
import { apiRequest } from "../utils";
import { Login } from "../redux/userSlice";

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

const demoCredentials = {
  seeker: {
    email: "demo.candidate@kariyerbul.dev",
    password: "Demo1234",
  },
  company: {
    email: "demo.company@kariyerbul.dev",
    password: "Demo1234",
  },
};

const isNetlifyDemoLoginEnabled = () => {
  if (import.meta.env.VITE_DEMO_LOGIN_ENABLED === "true") return true;
  if (typeof window === "undefined") return false;

  return window.location.hostname.endsWith(".netlify.app");
};

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
  const shouldPrefillDemoLogin = !isRegister && isNetlifyDemoLoginEnabled();

  useEffect(() => {
    if (!shouldPrefillDemoLogin) return;

    reset(demoCredentials[accountType]);
  }, [accountType, reset, shouldPrefillDemoLogin]);

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
          <div className="fixed inset-0 bg-slate-900/20" />
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
              <Dialog.Panel className="grid max-h-[88vh] w-full max-w-4xl transform overflow-hidden rounded-panel border border-slate-200 bg-white text-left align-middle shadow-panel transition-all md:grid-cols-[0.86fr_1.14fr]">
                <div className="hidden border-r border-slate-200 bg-primary p-8 text-white md:flex md:flex-col md:justify-between">
                  <div>
                    <Dialog.Title
                      as="h2"
                      className="text-lg font-semibold leading-tight"
                    >
                      Kariyer fırsatlarına tek yerden ulaş.
                    </Dialog.Title>
                    <p className="mt-4 text-sm leading-6 text-blue-50/90">
                      Aday olarak ilanlara başvurabilir, şirket hesabıyla ilan
                      yayınlayıp başvuruları yönetebilirsin.
                    </p>
                  </div>

                  <div className="space-y-3 text-sm text-blue-50/90">
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

                <div className="relative overflow-y-auto px-5 py-6 sm:px-8">
                  <IconButton
                    icon={<FiX />}
                    label="Kapat"
                    variant="outline"
                    onClick={closeModal}
                    className="absolute right-5 top-5"
                  />

                  <div className="pr-12">
                    <p className="text-sm font-semibold text-primary">
                      {isRegister ? "Yeni hesap" : "Tekrar hoş geldin"}
                    </p>
                    <h1 className="mt-2 text-lg font-semibold text-textPrimary">
                      {isRegister ? "Hesap oluştur" : "Giriş yap"}
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-textSecondary">
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
                      <Input
                        name="resetEmail"
                        label="E-posta adresi"
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="ornek@email.com"
                        required
                      />

                      {resetMessage && (
                        <div className="rounded-card border border-primary-subtle-active bg-primary-subtle px-4 py-3 text-sm text-primary-hover">
                          {resetMessage}
                        </div>
                      )}
                      {resetError && (
                        <div className="rounded-card border border-red-100 bg-danger-subtle px-4 py-3 text-sm text-danger">
                          {resetError}
                        </div>
                      )}

                      <Button type="submit" fullWidth loading={isResetSubmitting}>
                        Sıfırlama bağlantısı gönder
                      </Button>

                      <button
                        type="button"
                        className="text-center text-sm font-semibold text-primary transition hover:text-primary-hover"
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
                          className={`flex h-12 items-center justify-center gap-2 rounded-card border px-4 text-sm font-semibold transition ${
                            accountType === "seeker"
                              ? "border-primary bg-primary-subtle text-primary-hover"
                              : "border-border-control text-textSecondary hover:border-primary-subtle-active hover:bg-primary-subtle"
                          }`}
                          onClick={() => setAccountType("seeker")}
                        >
                          <FiUser />
                          Aday
                        </button>
                        <button
                          type="button"
                          className={`flex h-12 items-center justify-center gap-2 rounded-card border px-4 text-sm font-semibold transition ${
                            accountType === "company"
                              ? "border-primary bg-primary-subtle text-primary-hover"
                              : "border-border-control text-textSecondary hover:border-primary-subtle-active hover:bg-primary-subtle"
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
                            <Input
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
                                  ? errors.firstName?.message
                                  : errors.name?.message
                              }
                            />

                            {accountType === "seeker" && (
                              <Input
                                name="lastName"
                                label="Soyad"
                                placeholder="Örn. Ceylan"
                                register={register("lastName", {
                                  required: "Soyad zorunludur.",
                                })}
                                error={errors.lastName?.message}
                              />
                            )}
                          </div>
                        )}

                        <Input
                          name="email"
                          label="E-posta adresi"
                          placeholder="ornek@email.com"
                          type="email"
                          register={register("email", {
                            required: "E-posta adresi zorunludur.",
                          })}
                          error={errors.email?.message}
                        />

                        <div
                          className={`grid gap-4 ${
                            isRegister ? "sm:grid-cols-2" : ""
                          }`}
                        >
                          <Input
                            name="password"
                            label="Şifre"
                            placeholder="Şifreni gir"
                            type="password"
                            register={register("password", {
                              required: "Şifre zorunludur.",
                            })}
                            error={errors.password?.message}
                          />

                          {isRegister && (
                            <Input
                              name="cPassword"
                              label="Şifre tekrar"
                              placeholder="Şifreni tekrar gir"
                              type="password"
                              register={register("cPassword", {
                                validate: (value) => {
                                  const { password } = getValues();
                                  return (
                                    password === value ||
                                    "Şifreler eşleşmiyor."
                                  );
                                },
                              })}
                              error={errors.cPassword?.message}
                            />
                          )}
                        </div>

                        {!isRegister && (
                          <button
                            type="button"
                            className="w-fit text-sm font-semibold text-primary transition hover:text-primary-hover"
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
                            className="rounded-card border border-red-100 bg-danger-subtle px-4 py-3 text-sm text-danger"
                          >
                            {errMsg}
                          </div>
                        )}

                        <Button
                          type="submit"
                          fullWidth
                          loading={isSubmitting}
                          className="mt-1"
                        >
                          {isRegister ? "Hesap oluştur" : "Giriş yap"}
                        </Button>
                      </form>

                      <p className="mt-5 text-center text-sm text-textSecondary">
                        {isRegister
                          ? "Zaten hesabın var mı?"
                          : "Hesabın yok mu?"}
                        <button
                          type="button"
                          className="ml-2 font-semibold text-primary transition hover:text-primary-hover"
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
