/**
 * Generates a random alphanumeric code of a specified length.
 * @param length - The length of the code to generate.
 * @returns A random alphanumeric code as a string.
 */
export const generateRandomCode = (length: number): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
};
