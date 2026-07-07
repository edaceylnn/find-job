import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiLock } from "react-icons/fi";
import { apiRequest } from "../utils";
import { CustomButton } from "../components";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";
  const accountType = searchParams.get("accountType") || "seeker";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!token || !email) {
      setError("Sıfırlama bağlantısı geçersiz.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await apiRequest({
        url:
          accountType === "company"
            ? "companies/reset-password"
            : "auth/reset-password",
        method: "POST",
        data: { email, token, password },
      });

      if (res?.success) {
        setMessage(res?.message || "Şifren başarıyla güncellendi.");
        setPassword("");
        setConfirmPassword("");
      } else {
        setError(res?.message || "Şifre güncellenemedi.");
      }
    } catch (error) {
      console.log(error);
      setError("Şifre güncellenemedi. Lütfen tekrar dene.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-5 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-blue-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600">
          <FiLock />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          Yeni şifre belirle
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          KariyerBul hesabın için yeni şifreni gir. Bu bağlantı yalnızca kısa
          süre geçerlidir.
        </p>

        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
            Yeni şifre
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Yeni şifren"
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              required
              minLength={6}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
            Yeni şifre tekrar
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Yeni şifreni tekrar gir"
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              required
              minLength={6}
            />
          </label>

          {message && (
            <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
              {message}
            </div>
          )}
          {error && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <CustomButton
            type="submit"
            disabled={isSubmitting}
            title={isSubmitting ? "Güncelleniyor..." : "Şifreyi güncelle"}
            containerStyles="w-full justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white outline-none transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          />
        </form>

        <Link
          to="/user-auth"
          className="mt-5 inline-flex text-sm font-semibold text-blue-600 transition hover:text-blue-700"
        >
          Giriş sayfasına dön
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;
