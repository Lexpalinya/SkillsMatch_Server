import type { ErrorHandler } from "elysia";
import { AuthError } from "./errorAuth";
export const handleError: ErrorHandler = ({ error, set }) => {
  if (error instanceof AuthError) {
    set.status = 400;
    return { error: error.message };
  }
  if (error.name === "validationError") {
    set.status = 400;
    return {
      error: "Validation Error",
      details: error.message,
    };
  }
  console.log("Unhandled Error", error);
  set.status = 500;
  return {
    error: "Internal Server Error",
  };
};
