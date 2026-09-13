import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiLock } from "react-icons/fi";
import { apiRequest } from "../utils";
import { Button, Card, Input, PageContainer } from "../components";

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
    <PageContainer className="flex min-h-[70vh] items-center justify-center">
      <Card radius="panel" className="w-full max-w-lg p-6 sm:p-8">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-panel bg-primary-subtle text-xl text-primary">
          <FiLock />
        </div>
        <h1 className="text-base font-semibold text-textPrimary">
          Yeni şifre belirle
        </h1>
        <p className="mt-2 text-sm leading-6 text-textSecondary">
          KariyerBul hesabın için yeni şifreni gir. Bu bağlantı yalnızca kısa
          süre geçerlidir.
        </p>

        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input
            name="password"
            label="Yeni şifre"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Yeni şifren"
            required
            minLength={6}
          />

          <Input
            name="confirmPassword"
            label="Yeni şifre tekrar"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Yeni şifreni tekrar gir"
            required
            minLength={6}
          />

          {message && (
            <div className="rounded-card border border-primary-subtle-active bg-primary-subtle px-4 py-3 text-sm text-primary-hover">
              {message}
            </div>
          )}
          {error && (
            <div className="rounded-card border border-red-100 bg-danger-subtle px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          <Button type="submit" fullWidth loading={isSubmitting}>
            {isSubmitting ? "Güncelleniyor..." : "Şifreyi güncelle"}
          </Button>
        </form>

        <Link
          to="/user-auth"
          className="mt-5 inline-flex text-sm font-semibold text-primary transition hover:text-primary-hover"
        >
          Giriş sayfasına dön
        </Link>
      </Card>
    </PageContainer>
  );
};

export default ResetPassword;
