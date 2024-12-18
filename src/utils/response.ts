import { TSet } from "../types/utils/elysiaCustom.typs";

import { EMessage } from "./message";

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
