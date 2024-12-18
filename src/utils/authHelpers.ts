import { EMessage } from "./message";
interface TokenService {
  sign: (payload: object) => Promise<string>;
}

export const generateToken = async (
  jwt: TokenService,
  jwt_refresh: TokenService,
  data: Record<string, any>
): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const payload = { ...data, type: "access" };
    const refreshPayload = { ...data, type: "refresh" };

    const accessToken = await jwt.sign(payload);
    const refreshToken = await jwt_refresh.sign(refreshPayload);

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.error(EMessage.ERROR_TOKEN_GENERATION, error);
    throw new Error(EMessage.ERROR_TOKEN_GENERATION);
  }
};

export function setAuthCookies(
  token: {
    set: (cookie: {
      value: string;
      httpOnly: boolean;
      maxAge: number;
      path: string;
    }) => void;
  },
  tokenRef: {
    set: (cookie: {
      value: string;
      httpOnly: boolean;
      maxAge: number;
      path: string;
    }) => void;
  },
  accessToken: string,
  newRefreshToken: string
): void {
  try {
    token.set({
      value: accessToken,
      httpOnly: true,
      maxAge: 7 * 86400, // 7 days
      path: "/",
    });

    tokenRef.set({
      value: newRefreshToken,
      httpOnly: true,
      maxAge: 30 * 86400, // 30 days
      path: "/",
    });
  } catch (error) {
    console.error("Error setting cookies:", error);
    throw new Error("Failed to set cookies");
  }
}
