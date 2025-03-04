export const EMessage = {
  // Input Validation
  INPUT_REQUIRED: "Please provide the required input",

  // Server Errors
  SERVER_ERROR: "Internal server error",
  ERROR_FETCH_ALL: "Failed to fetch all records",
  ERROR_FETCH_ONE: "Failed to fetch the record",
  ERROR_INSERT: "Failed to insert record",
  ERROR_UPDATE: "Failed to update record",
  ERROR_UPDATE_ADD: "Failed to update add record",
  ERROR_UPDATE_UPDATE: "Failed to update update record",
  ERROR_UPDATE_DELETE: "Failed to update delete record",
  ERROR_DELETE: "Failed to delete record",

  // Operation Success Messages
  SUCCESS_INSERT: "Record inserted successfully",
  SUCCESS_UPDATE: "Record updated successfully",
  SUCCESS_DELETE: "Record deleted successfully",
  SUCCESS_UPDATE_ADD: "Record updated add successfully",
  SUCCESS_UPDATE_UPDATE: "Record updated update successfully",
  SUCCESS_UPDATE_DELETE: "Record updated delete successfully",
  SUCCESS_FETCH_ALL: "Successfully retrieved all records",
  SUCCESS_FETCH_ONE: "Successfully retrieved the record",
  THIS_NAME_ALREADY: "This name already exists",
  ALREADY: "already",
  // Authentication Messages
  SUCCESS_REGISTRATION: "Registration successful",
  ERROR_REGISTRATION: "Registration failed",
  SUCCESS_LOGIN: "Login successful",
  ERROR_LOGIN: "Login failed",
  PLEASE_LOGIN: "Please login Account",
  TOKENEXPIRED: "TokenExpiredError",
  YOUR_ACCOUNT_BLOCKED:
    "Your account has been blocked. Please contact support.",
  // Resource and Token Messages
  ERROR_NOT_FOUND: "Resource not found",
  ERROR_TOKEN_MISSING: "Authentication token is missing",
  ERROR_TOKEN_EXPIRED: "Authentication token has expired",
  ERROR_TOKEN_INVALID: "Invalid authentication token",
  SUCCESS_TOKEN_REFRESH: "Token refreshed successfully",
  ERROR_TOKEN_REFRESH: "Failed to refresh token",
  ERROR_LOGOUT: "Failed to logout",
  SUCCESS_LOGOUT: "Logout successful",
  ERROR_TOKEN_GENERATION: "Error generating authentication token",
  UNAUTHORIZED: "Unauthorized",
  // User-related Messages
  ERROR_NOT_AUTHORIZED: "You are not authorized",
  ERROR_USER_EXISTS: "User already exists",

  ERROR_PASSWORD_CHANGE: "Failed to change password",
  SUCCESS_PASSWORD_CHANGE: "Password changed successfully",
  ERROR_FORGOT_PASSWORD: "Failed to reset password",
  SUCCESS_FORGOT_PASSWORD: "Password reset successful",
  YOUR_NOT_ROLE: "You are not rollowed",
  THIS_YOU_NOT_OWNER: "You are not the owner of this resource.",

  // Password and Search Messages
  ERROR_PASSWORD_MISMATCH: "Passwords do not match",
  SUCCESS_SEARCH: "Search completed successfully",
  ERROR_SEARCH: "Search failed",

  // Generic Status
  STATUS_SUCCESS: "success",
  STATUS_FAILURE: "failure",
};
