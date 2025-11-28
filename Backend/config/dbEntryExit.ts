import 'dotenv/config'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '../generated/prisma-entry-exit/client';

console.log("i am in dbEntryExit.ts");

const PORT = process.env.ENTRY_EXIT_DB_PORT;
const CONNECTION_LIMIT = process.env.ENTRY_EXIT_DB_CONNECTION_LIMIT;

const adapter = new PrismaMariaDb({
  host: process.env.ENTRY_EXIT_DB_HOST!,
  port: 21133,
  connectionLimit: 5,
  user:process.env.ENTRY_EXIT_DB_USER!,
  password:process.env.ENTRY_EXIT_DB_PASSWORD!,
  database:process.env.ENTRY_EXIT_DB_DATABASE!
})

const globalForPrisma = global as unknown as { prismab: PrismaClient };

export const entryExitDB =
  globalForPrisma.prismab || new PrismaClient({adapter});

console.log(entryExitDB,"entryExitDBB");

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismab = entryExitDB;
}
