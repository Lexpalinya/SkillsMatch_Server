import { PrismaClient } from "@prisma/client";

interface CacheOptions {
  key: string;
  model: keyof PrismaClient;
  select?: any;
  where?: any;
  orderBy?: any;
  expirationTime?: number;
  search?: string;
  include?: any;
}

export { CacheOptions };
