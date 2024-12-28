import bcrypt from "bcrypt";
import { saltRounds } from "../config/api.config";

/**
 * Hashes a password using bcrypt.
 * @param password - The plain text password to hash.
 * @returns A promise that resolves to the hashed password.
 */
const HashedPassword = (password: string): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await bcrypt.hash(password, saltRounds);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Verifies a plain text password against a hashed password.
 * @param plainPassword - The plain text password to verify.
 * @param hashPassword - The hashed password to compare against.
 * @returns A promise that resolves to a boolean indicating if the passwords match.
 */
const VerifyPassword = async (
  plainPassword: string,
  hashPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashPassword);
};

export { HashedPassword, VerifyPassword };