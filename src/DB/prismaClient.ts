import { PrismaClient } from "@prisma/client";

const prisma: PrismaClient = new PrismaClient();

export const checkConnectionDATABASE = async () => {
  try {
    await prisma.$connect();
    console.log("Connection Database Successfully");
  } catch (error) {
    console.log("error", error);
    setInterval(async () => {
      await checkConnectionDATABASE();
      console.log("Reconnect Database ......");
    }, 10000);
  }
};

export default prisma;
