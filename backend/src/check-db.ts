import "./types.js";
import { prisma } from "./config/prisma.js";
import { env } from "./config/env.js";

function getDatabaseHost() {
  try {
    return new URL(env.databaseUrl).host;
  } catch {
    return "";
  }
}

async function main() {
  const host = getDatabaseHost();

  if (!env.databaseUrl || !env.databaseUrl.startsWith("postgres")) {
    throw new Error("DATABASE_URL must be a Neon PostgreSQL connection string, not a console.neon.tech page URL.");
  }

  const userCount = await prisma.user.count();
  const users = await prisma.user.findMany({
    orderBy: { userId: "asc" },
    select: { userId: true, role: true, isActive: true },
    take: 20,
  });

  console.log(`Connected to database host: ${host}`);
  console.log(`Users in database: ${userCount}`);
  console.table(users);
}

main()
  .catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    const databaseHost = message.match(/Can't reach database server at `([^`]+)`/)?.[1];

    if (databaseHost) {
      console.error(`Database check failed: cannot reach ${databaseHost}.`);
      console.error("Replace DATABASE_URL in backend/.env with the Neon postgresql:// connection string for your current project.");
    } else {
      console.error(`Database check failed: ${message}`);
    }
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
