/**
 * Removes a specific value from an array.
 * @param data - The value to remove.
 * @param arr - The array from which to remove the value.
 * @returns A new array with the specified value removed.
 */
export const RemoveDataInArray = (data: string, arr: string[]) => {
  return arr.filter((item) => item !== data); // Filters out elements matching the provided value.
};

/**
 * Adds a specific value to an array.
 * @param data - The value to add.
 * @param arr - The array to which the value will be added.
 * @returns The updated array with the new value included.
 */
export const AddDataInArray = (data: string, arr: string[]) => {
  arr.push(data); // Adds the provided value to the end of the array.
  return arr; // Returns the updated array.
};

/**
 * Constructs an array of objects, each containing a specified key-value pair and additional data.
 * @param data - The value to associate with the `sjId` key in each object.
 * @param arr - The array whose elements will be added as values for the specified key.
 * @param key - The key to which each array element will be assigned in the objects.
 * @returns An array of objects, each including `sjId` and the dynamically added key-value pair.
 */
export const AddIdObjectInArray = (data: string, arr: any[], key: string) => {
  const result: any[] = []; // Initialize an empty array to store the constructed objects.

  arr.forEach((element) => {
    const obj: any = { sjId: data }; // Create an object with the fixed key `sjId` and its value.
    obj[key] = element; // Dynamically assign the value to the specified key.
    result.push(obj); // Add the object to the result array.
  });

  return result; // Return the array of constructed objects.
};

export const AddIdObjectInArrayPosts = (
  data: string,
  arr: any[],
  key: string
) => {
  const result: any[] = []; // Initialize an empty array to store the constructed objects.

  arr.forEach((element) => {
    const obj: any = { pId: data }; // Create an object with the fixed key `sjId` and its value.
    obj[key] = element; // Dynamically assign the value to the specified key.
    result.push(obj); // Add the object to the result array.
  });

  return result; // Return the array of constructed objects.
};

/**
 * Deduplicates an array to ensure only unique values are used.
 * @param arr - The input array with potential duplicates.
 * @returns An array with unique values.
 */
export const DeduplicateArray = <T>(arr: T[]): T[] => {
  return Array.from(new Set(arr));
};
