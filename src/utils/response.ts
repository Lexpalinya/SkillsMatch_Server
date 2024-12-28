import { TSet } from "../types/utils/elysiaCustom.typs";
import { EMessage } from "./message";

/**
 * Generates a success response.
 * @param set - The response object to set the status code.
 * @param statusCode - The HTTP status code (default is 200).
 * @param message - The success message (default is an empty object).
 * @param data - The data to include in the response (default is an empty object).
 * @param error - The error details to include in the response (default is an empty object).
 * @returns An object representing the success response.
 */
export const ResSucess = ({
  set,
  statusCode = 200,
  message = {},
  data = {},
  error = {},
}: {
  set: TSet;
  statusCode?: number;
  message?: any;
  data?: any;
  error?: any;
}) => {
  set.status = statusCode;
  return {
    status: true,
    message: message || `${EMessage.STATUS_SUCCESS}`,
    data,
    error,
  };
};

/**
 * Generates a failure response.
 * @param set - The response object to set the status code.
 * @param statusCode - The HTTP status code (default is 400).
 * @param message - The failure message (default is an empty object).
 * @param data - The data to include in the response (default is an empty object).
 * @param error - The error details to include in the response (default is an empty object).
 * @returns An object representing the failure response.
 */
export const ResFail = ({
  set,
  statusCode = 400,
  message = {},
  data = {},
  error = {},
}: {
  set: TSet;
  statusCode?: number;
  message?: any;
  data?: any;
  error?: any;
}) => {
  set.status = statusCode;
  return {
    status: false,
    message: message || `${EMessage.STATUS_FAILURE}`,
    data,
    error,
  };
};

/**
 * Generates a server error response (HTTP 500).
 * @param set - The response object to set the status code.
 * @param message - The error message (default is an empty object).
 * @param data - The data to include in the response (default is an empty object).
 * @param error - The error details to include in the response (default is an empty object).
 * @returns An object representing the server error response.
 */
export const ResFail500 = ({
  set,
  message = {},
  data = {},
  error = {},
}: {
  set: TSet;
  message?: any;
  data?: any;
  error?: any;
}) => {
  set.status = 500;
  console.log(message, error);
  return {
    status: false,
    message: message || `${EMessage.STATUS_FAILURE}`,
    data,
    error,
  };
};