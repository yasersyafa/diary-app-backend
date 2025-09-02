import { PrismaClient } from "../generated/prisma";
import { logger } from "./logging";
import { withAccelerate } from "@prisma/extension-accelerate";

// Create base Prisma client
const basePrismaClient = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "event",
      level: "error",
    },
    {
      emit: "event",
      level: "info",
    },
    {
      emit: "event",
      level: "warn",
    },
  ],
});

// Add event listeners to base client
basePrismaClient.$on("query", (e: any) => {
  logger.info(e);
});

basePrismaClient.$on("error", (e: any) => {
  logger.error(e);
});

basePrismaClient.$on("info", (e: any) => {
  logger.info(e);
});

basePrismaClient.$on("warn", (e: any) => {
  logger.warn(e);
});

// Export extended client with Accelerate
export const prismaClient = basePrismaClient.$extends(withAccelerate());
