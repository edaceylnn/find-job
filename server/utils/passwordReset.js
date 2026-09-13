import crypto from "crypto";
import { sendPasswordResetEmail } from "./email.js";

const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;

// Shared forgot/reset-password flow for both Users and Companies, which
// previously duplicated this logic. Silently no-ops when no account matches
// the email so callers can return an identical response either way and avoid
// leaking which emails are registered.
export const requestPasswordReset = async ({
  Model,
  email,
  accountType,
  getName,
}) => {
  const account = await Model.findOne({ email });

  if (!account) return;

  const resetToken = crypto.randomBytes(24).toString("hex");
  account.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  account.passwordResetExpires = Date.now() + RESET_TOKEN_TTL_MS;

  await account.save({ validateBeforeSave: false });

  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const resetUrl = `${clientUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}&accountType=${accountType}`;

  try {
    await sendPasswordResetEmail({
      to: email,
      resetUrl,
      name: getName(account),
    });
  } catch (error) {
    account.passwordResetToken = undefined;
    account.passwordResetExpires = undefined;
    await account.save({ validateBeforeSave: false });
    throw error;
  }
};

export const applyPasswordReset = async ({ Model, email, token, password }) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const account = await Model.findOne({
    email,
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!account) return null;

  account.password = password;
  account.passwordResetToken = undefined;
  account.passwordResetExpires = undefined;
  await account.save();

  return account;
};
