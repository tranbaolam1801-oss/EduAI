import crypto from "node:crypto";

const SCRYPT_KEY_LENGTH = 64;

const scryptAsync = (value, salt) =>
  new Promise((resolve, reject) => {
    crypto.scrypt(value, salt, SCRYPT_KEY_LENGTH, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(derivedKey);
    });
  });

export const hashPassword = async (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = await scryptAsync(password, salt);
  return `scrypt$${salt}$${derivedKey.toString("hex")}`;
};

export const verifyPassword = async (password, passwordHash) => {
  if (!passwordHash || !passwordHash.startsWith("scrypt$")) {
    return false;
  }

  const [, salt, storedHash] = passwordHash.split("$");

  if (!salt || !storedHash) {
    return false;
  }

  const derivedKey = await scryptAsync(password, salt);
  const storedBuffer = Buffer.from(storedHash, "hex");

  if (derivedKey.length !== storedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(derivedKey, storedBuffer);
};
