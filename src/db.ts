// // Load dotenv at module load time
// require('dotenv').config();

// import { PrismaClient } from '@prisma/client'
// import { PrismaNeon } from '@prisma/adapter-neon'
// import { Pool } from '@neondatabase/serverless'

// console.log('🔍 Initializing Prisma Client...');
// console.log('🔍 DATABASE_URL is set:', !!process.env.DATABASE_URL);

// if (!process.env.DATABASE_URL) {
//   throw new Error('DATABASE_URL environment variable is not set');
// }

// // Prisma 7 requires an adapter for Neon
// const pool = new Pool({ connectionString: process.env.DATABASE_URL })
// const adapter = new PrismaNeon(pool as any)

// const prisma = new PrismaClient({ adapter: adapter as any })

// console.log('✅ Prisma Client initialized');

// export default prisma

import dotenv from 'dotenv'
dotenv.config()
import { PrismaNeonHttp } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'

// Use HTTP adapter - pass connection string directly
const adapter = new PrismaNeonHttp(process.env.DATABASE_URL!, { fullResults: false })
const prisma = new PrismaClient({ adapter })

export default prisma
