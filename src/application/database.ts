import { PrismaClient } from "../generated/prisma";

// Create base Prisma client
export const prismaClient = new PrismaClient({
  log: [
    {
      emit: "stdout",
      level: "query",
    },
    {
      emit: "stdout",
      level: "error",
    },
    {
      emit: "stdout",
      level: "info",
    },
    {
      emit: "stdout",
      level: "warn",
    },
  ],
});

// Export extended client with Accelerate
