export const converStringToBoolean = (
  data: string | boolean | undefined
): boolean | undefined =>
  typeof data === "string" ? data.toLocaleLowerCase() === "true" : data;

export const converStringToFloat = (data: string | number): number =>
  typeof data === "string" ? parseFloat(data) : data;

export const converStringToArray = <T>(data: string | T[]) =>
  typeof data === "string" ? JSON.parse(data) : data;
