import { JWTPayloadSpec } from "@elysiajs/jwt";
import { StatusMap } from "elysia";
import { ElysiaCookie } from "elysia/dist/cookies";
import { HTTPHeaders } from "elysia/dist/types";

// Response configuration type
export type TSetC = {
  headers: HTTPHeaders;
  status?: number | keyof StatusMap;
  redirect?: string;
  cookie?: Record<string, ElysiaCookie>;
};

// Extended response configuration type with user information
export type TSet = TSetC & {
  user?: {
    id: string;
  };
};

// Query types
export type TQuery =
  | {
      id?: string;
    }
  | undefined;

export type TQueryUserId =
  | {
      userId?: string;
    }
  | undefined;

// Route parameter type
export type TParams = {
  id: string;
};

export type TParams_ = TParams & { _id: string };
