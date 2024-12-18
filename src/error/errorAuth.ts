export class AuthError extends Error {
  constructor(message: string, public statecode: number = 401) {
    super(message);
    this.name = "AuthError";
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AuthError);
    }
  }
}
