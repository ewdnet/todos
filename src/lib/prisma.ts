import 'dotenv/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../../generated/prisma/client';

const dbConnection = process.env.DATABASE_URL as string;

const adapter = new PrismaBetterSqlite3({ url: dbConnection });
const prisma = new PrismaClient({ adapter });

export { prisma };
