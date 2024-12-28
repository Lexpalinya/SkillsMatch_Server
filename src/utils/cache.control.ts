import prisma from "../DB/prismaClient";
import redis from "../DB/redis";
import { CacheOptions } from "../types/utils/cache.type";

// Fetch data from cache or database
export const CacheData = async ({
  key,
  model,
  where = {},
  select,
  orderBy = { createdAt: "desc" },
  expirationTime = 3600, // Default: 1 hour
  include,
}: CacheOptions): Promise<any[]> => {
  try {
    // Check cache first
    const cachedData = await redis.get(key);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    // Ensure the `model` is a valid Prisma model
    const data = await (prisma[model] as any).findMany({
      where,
      select,
      orderBy,
      include,
    });

    // Cache the fresh data
    await redis.set(key, JSON.stringify(data), "EX", expirationTime);

    return data;
  } catch (error) {
    console.error("Cache Data Error:", error);
    return [];
  }
};

// Fetch data by ID from cache or database
export const CacheDataFindById = async <T>({
  key,
  model,
  where,
  select,
  expirationTime = 3600, // Default 1 hour
  include,
}: CacheOptions): Promise<T | null> => {
  try {
    let data;
    const cachedData = await redis.get(key);
    if (cachedData) {
      data = JSON.parse(cachedData) as T[];
    } else {
      data = await CacheData({
        key,
        model,
        where: { isActive: true },
        select,
        include,
      });
    }

    const result = data.find((item) => {
      return item.id == where.id;
    });

    return result;
  } catch (error) {
    console.error("CacheDataFindById Error:", error);
    return null; // Graceful fallback
  }
};

// Fetch data by ID from cache or database without checking isActive
export const CacheDataFindByIdNotIsActive = async <T>({
  key,
  model,
  where,
  select,
  expirationTime = 3600, // Default 1 hour
  include,
}: CacheOptions): Promise<T | null> => {
  try {
    let data;
    const cachedData = await redis.get(key);
    if (cachedData) {
      data = JSON.parse(cachedData) as T[];
    } else {
      data = await CacheData({ key, model, where: {}, select, include });
    }

    const result = data.find((item) => {
      return item.id == where.id;
    });

    return result;
  } catch (error) {
    console.error("CacheDataFindById Error:", error);
    return null; // Graceful fallback
  }
};

// Search data in cache or database
export const CacheDataSearch = async <T>({
  key,
  model,
  where,
  search,
  select,
  expirationTime = 3600, // Default 1 hour
  include,
}: CacheOptions): Promise<T | null> => {
  try {
    let data;
    const cachedData = await redis.get(key);
    if (cachedData) {
      data = JSON.parse(cachedData) as T[];
    } else {
      data = await CacheData({
        key,
        model,
        where: { isActive: true },
        select,
        include,
      });
    }

    const result = data.find((item) => {
      return item[search!] !== undefined && item[search!] === where[search!];
    });

    return result;
  } catch (error) {
    console.error("CacheDataSearch Error:", error);
    return null; // Graceful fallback
  }
};

// Search data in cache or database without checking isActive
export const CacheDataSearchNotIsActive = async <T>({
  key,
  model,
  where,
  search,
  select,
  expirationTime = 3600, // Default 1 hour
  include,
}: CacheOptions): Promise<T | null> => {
  try {
    let data;
    console.log('include', include)
    const cachedData = await redis.get(key);
    if (cachedData) {
      data = JSON.parse(cachedData) as T[];
    } else {
      data = await CacheData({ key, model, where: {}, select, include });
    }

    const result = data.find((item) => {
      return item[search!] !== undefined && item[search!] === where[search!];
    });

    return result;
  } catch (error) {
    console.error("CacheDataSearch Error:", error);
    return null; // Graceful fallback
  }
};

// Filter data in cache or database
export const CacheDataFilter = async <T>({
  key,
  model,
  where,
  search,
  select,
  expirationTime = 3600, // Default 1 hour
  include,
}: CacheOptions): Promise<T[] | null> => {
  try {
    let data;
    const cachedData = await redis.get(key);
    if (cachedData) {
      data = JSON.parse(cachedData) as T[];
    } else {
      data = await CacheData({
        key,
        model,
        where: { isActive: true },
        select,
        include,
      });
    }
    const result = data.filter((item) => {
      return item[search!] !== undefined && item[search!] === where[search!];
    });

    return result;
  } catch (error) {
    console.error("CacheDataSearch Error:", error);
    return null; // Graceful fallback
  }
};

// Remove cache by key
export const RemoveCache = async (key: string) => {
  const keys: string[] = await redis.keys(key + "*");
  if (keys.length > 0) {
    await redis.del(keys);
    console.log(`keys deleted successfully`);
  } else {
    console.log(`No keys starting with key ${key}`);
  }
};

// Add data to cache
export const CacheDataAdd = async <T>(
  key: string,
  newData: T,
  data: T[]
): Promise<void> => {
  try {
    // Add the new data to the beginning of the array
    data.unshift(newData);

    // Cache the updated data in Redis with a 1-hour expiration
    await redis.set(key, JSON.stringify(data), "EX", 3600);

    console.log(`Data successfully added to cache with key: ${key}`);
  } catch (error) {
    console.error(`Failed to add data to cache for key: ${key}`, error);
    throw new Error("Failed to update cache");
  }
};

// Update data in cache
export const CacheDataUpdate = async <T extends { id: string }>(
  key: string,
  updateData: T,
  existingData: T[] = []
): Promise<void> => {
  try {
    const index = existingData.findIndex((item) => item.id === updateData.id);
    existingData[index] = updateData;

    await redis.set(key, JSON.stringify(existingData), "EX", 3600);
  } catch (error) {
    console.error(`Failed to update cache for key: ${key}`, error);
    throw new Error("Failed to update cache");
  }
};

// Delete data from cache
export const CacheDataDelete = async <T extends { id: string }>(
  key: string,
  idToDelete: string,
  existingData: T[] = []
): Promise<void> => {
  try {
    const updatedData = existingData.filter((item) => item.id !== idToDelete);

    await redis.set(key, JSON.stringify(updatedData), "EX", 3600);

    console.log(`Data successfully deleted from cache with key: ${key}`);
  } catch (error) {
    console.error(`Failed to delete data from cache for key: ${key}`, error);
    throw new Error("Failed to delete from cache");
  }
};