import { UserService } from "../services/user.service";
import { TSet } from "../types/utils/elysiaCustom.typs";
import { EMessage } from "../utils/message";
import { ResFail } from "../utils/response";
const userService = new UserService();
export const auth = async ({
  set,
  cookie: { token },
  jwt,
}: {
  set: TSet;
  jwt: any;
  cookie: any;
}) => {
  try {
    if (!token.value) {
      return ResFail({
        set,
        statusCode: 401,
        message: `${EMessage.ERROR_TOKEN_MISSING}`,
      });
    }
    const decode = await jwt.verify(token.value);
    if (decode === false) {
      return ResFail({
        set,
        statusCode: 401,
        message: `${EMessage.ERROR_TOKEN_EXPIRED}`,
      });
    }

    const user = await userService.findOne(decode.id);
    if (!user) {
      return ResFail({
        set,
        statusCode: 401,
        message: `${EMessage.ERROR_NOT_AUTHORIZED} `,
      });
    }
    if (user.block) {
      return ResFail({
        set,
        statusCode: 401,
        message: `${EMessage.YOUR_ACCOUNT_BLOCKED}`,
      });
    }

    set.user = decode;
  } catch (error) {
    return ResFail({
      set,
      statusCode: 401,
      message: `${EMessage.UNAUTHORIZED}`,
    });
  }
};

export const admin = async ({ set }: { set: any }) => {
  try {
    const user = await userService.findOne(set.user.id);
    if (user?.role !== "admin") {
      return ResFail({
        set,
        statusCode: 400,
        message: `${EMessage.YOUR_NOT_ROLE}`,
      });
    }
  } catch (error) {
    return ResFail({
      set,
      statusCode: 500,
      message: `${EMessage.SERVER_ERROR}`,
    });
  }
};
