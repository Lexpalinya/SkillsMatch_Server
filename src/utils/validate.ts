import { EMessage } from "./message";

export const ValidateLengthBody = (body: object): boolean => {
  if (Object.keys(body).length === 0) return true;
  return false;
};
export const validateElementsExists = async (
  elements: string[],
  service: any,
  set: any,
  type: string
): Promise<void> => {
  for (const el of elements) {
    const result = await service.FindOne(el);
    if (!result) {
      throw new Error(`${EMessage.ERROR_NOT_FOUND} ${type} id: ${el}`);
    }
  }
};
