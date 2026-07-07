import { Resend } from "resend";

export const sendPasswordResetEmail = async ({ to, resetUrl, name }) => {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
    throw new Error("Resend e-posta ayarları eksik.");
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const recipientName = name || "Merhaba";

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to,
    subject: "KariyerBul şifre sıfırlama bağlantısı",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0f172a">
        <h2 style="margin:0 0 12px;color:#2563eb">Şifre sıfırlama isteği</h2>
        <p>${recipientName}, KariyerBul hesabın için şifre sıfırlama isteği aldık.</p>
        <p>Yeni şifreni belirlemek için aşağıdaki bağlantıya tıkla. Bağlantı 15 dakika boyunca geçerlidir.</p>
        <a href="${resetUrl}" style="display:inline-block;margin:16px 0;padding:12px 18px;background:#2563eb;color:#fff;text-decoration:none;border-radius:10px;font-weight:700">
          Şifremi sıfırla
        </a>
        <p style="font-size:13px;color:#64748b">Bu isteği sen yapmadıysan bu e-postayı yok sayabilirsin.</p>
        <p style="font-size:12px;color:#94a3b8;word-break:break-all">${resetUrl}</p>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message || "E-posta gönderilemedi.");
  }
};
