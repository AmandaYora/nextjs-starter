import { describe, expect, it } from "vitest";
import { decrypt, encrypt } from "@/shared/lib/crypto";

describe("crypto helpers", () => {
  it("encrypts and decrypts values", () => {
    const plaintext = "sensitive data";
    const encrypted = encrypt(plaintext);
    expect(encrypted).not.toEqual(plaintext);
    const decrypted = decrypt(encrypted);
    expect(decrypted).toEqual(plaintext);
  });

  it("throws on invalid payload format", () => {
    expect(() => decrypt("not.a.valid.payload")).toThrowError("Invalid encrypted payload format.");
  });
});
