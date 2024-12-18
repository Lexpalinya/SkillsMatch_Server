import bcrypt from "bcrypt";
import { saltRounds } from "../config/api.config";
const HashedPassword = (password: string): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const resutl = await bcrypt.hash(password, saltRounds);
      resolve(resutl);
    } catch (error) {
      reject(error);
    }
  });
};

const VerifyPassword = async (
  plainPassword: string,
  hashPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashPassword);
};

export { HashedPassword, VerifyPassword };
