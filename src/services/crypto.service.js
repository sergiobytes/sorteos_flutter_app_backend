import crypto from "crypto";

export function last4Of(phone) {
  return (phone || "").replace(/\D/g, "").slice(-4);
}

export function phoneHasBuf(phone) {
  const salt = process.env.PHONE_SALT || "";
  const hash = crypto
    .createHash("sha256")
    .update(phone + salt, "utf8")
    .digest();

  return hash;
}

export function ensureEncyprionKey() {
  const key = process.env.ENCRYPTION_KEY || "";
  if (key.length < 16) throw new Error("bad_encryption_key");
  return key;
}
