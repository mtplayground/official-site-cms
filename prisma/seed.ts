import bcrypt from "bcryptjs";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

function requireEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function assertValidEmail(value: string) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(value)) {
    throw new Error("ADMIN_EMAIL must be a valid email address.");
  }
}

function assertValidPassword(value: string) {
  if (value.length < 12) {
    throw new Error("ADMIN_PASSWORD must be at least 12 characters.");
  }
}

async function main() {
  const email = requireEnv("ADMIN_EMAIL").toLowerCase();
  const password = requireEnv("ADMIN_PASSWORD");
  assertValidEmail(email);
  assertValidPassword(password);

  const passwordHash = await bcrypt.hash(password, 12);

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: UserRole.ADMIN,
    },
    create: {
      email,
      passwordHash,
      role: UserRole.ADMIN,
    },
  });

  process.stdout.write(`${existing ? "Updated" : "Created"} admin user: ${email}\n`);
}

main()
  .catch((error) => {
    process.stderr.write(`Seed failed: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
