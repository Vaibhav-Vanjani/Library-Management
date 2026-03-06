import 'dotenv/config'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '../generated/prisma-entry-exit/client';

console.log("i am in dbEntryExit.ts");

const PORT = process.env.ENTRY_EXIT_DB_PORT;
const CONNECTION_LIMIT = process.env.ENTRY_EXIT_DB_CONNECTION_LIMIT;

// const connection_obj = { host: process.env.ENTRY_EXIT_DB_HOST!,
//   port: 21133,
//   connectionLimit: 10,
//   user:process.env.ENTRY_EXIT_DB_USER!,
//   password:process.env.ENTRY_EXIT_DB_PASSWORD!,
//   database:process.env.ENTRY_EXIT_DB_DATABASE!,
//   allowPublicKeyRetrieval: true,
//   ssl:true
// }

// console.log("connection_obj______",connection_obj);

const adapter = new PrismaMariaDb({
  host: process.env.ENTRY_EXIT_DB_HOST!,
  port: 21133,
  connectionLimit: 10,
  user:process.env.ENTRY_EXIT_DB_USER!,
  password:process.env.ENTRY_EXIT_DB_PASSWORD!,
  database:process.env.ENTRY_EXIT_DB_DATABASE!,
  allowPublicKeyRetrieval: true,
  ssl: {
  rejectUnauthorized: false // <- allows self-signed certs
}
})

const globalForPrisma = global as unknown as { prismab: PrismaClient };

export const entryExitDB =
  globalForPrisma.prismab || new PrismaClient({adapter});

console.log(entryExitDB,"entryExitDBB");

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismab = entryExitDB;
}
