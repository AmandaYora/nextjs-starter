import crypto from "crypto";
import { encryptionKey } from "@/shared/config/env";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

export function encrypt(value: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, encryptionKey, iv);
  const ciphertext = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  const payload = [
    iv.toString("base64"),
    ciphertext.toString("base64"),
    authTag.toString("base64"),
  ].join(".");

  return payload;
}

export function decrypt(payload: string): string {
  const parts = payload.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted payload format.");
  }

  const [ivPart, dataPart, authTagPart] = parts;
  const iv = Buffer.from(ivPart, "base64");
  const ciphertext = Buffer.from(dataPart, "base64");
  const authTag = Buffer.from(authTagPart, "base64");

  const decipher = crypto.createDecipheriv(ALGORITHM, encryptionKey, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return decrypted.toString("utf8");
}
