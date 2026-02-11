import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const adapterPkg: any = require("@prisma/adapter-better-sqlite3");
const PrismaBetterSQLite3 =
  adapterPkg.PrismaBetterSQLite3 || adapterPkg.PrismaBetterSqlite3;

const url = process.env.DATABASE_URL || "file:./dev.db";

// Чтобы в dev не создавалось много подключений при hot-reload
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaBetterSQLite3({ url }),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
