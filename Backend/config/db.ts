import 'dotenv/config'
import { PrismaClient } from '../generated/prisma-student/client'
import { PrismaPg } from '@prisma/adapter-pg'

console.log("i am in db.ts");

const adapter = new PrismaPg({ connectionString: process.env.PPG_STUDENT_INFO_DATABASE_URL })

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const studentInfoDB =
  globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = studentInfoDB;