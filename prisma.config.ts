// import { defineConfig } from "prisma/config"
// import * as dotenv from 'dotenv'

// // Load .env file
// dotenv.config()

// export default defineConfig({
//   schema: "./prisma/schema.prisma",
//   datasource: {
//     url: process.env.DATABASE_URL,
//   },
// })

import "./src/env"
import { defineConfig } from "prisma/config"

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
  },
})
