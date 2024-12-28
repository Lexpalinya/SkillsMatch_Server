/**
 * Converts a string to a boolean.
 * @param data - The string or boolean to convert.
 * @returns The converted boolean value or the original boolean value if already a boolean.
 */
export const converStringToBoolean = (
  data: string | boolean | undefined
): boolean | undefined =>
  typeof data === "string" ? data.toLocaleLowerCase() === "true" : data;

/**
 * Converts a string to a float.
 * @param data - The string or number to convert.
 * @returns The converted float value or the original number if already a number.
 */
export const converStringToFloat = (data: string | number): number =>
  typeof data === "string" ? parseFloat(data) : data;

/**
 * Converts a string to an array.
 * @param data - The string or array to convert.
 * @returns The converted array or the original array if already an array.
 */
export const converStringToArray = <T>(data: string | T[]): T[] =>
  typeof data === "string" ? JSON.parse(data) : data;