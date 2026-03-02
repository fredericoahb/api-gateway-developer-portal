import { PrismaClient, Role, ApiEnvironment, ApiStatus } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@local.dev";
  const password = process.env.ADMIN_PASSWORD ?? "admin12345";
  const name = process.env.ADMIN_NAME ?? "Admin";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: { email, name, passwordHash, role: Role.ADMIN }
    });
    // Optional sample API for quick testing
    await prisma.api.create({
      data: {
        name: "Sample API",
        version: "1.0.0",
        baseUrl: "https://httpbin.org",
        environment: ApiEnvironment.DEV,
        status: ApiStatus.ACTIVE,
        ownerTeam: "Platform"
      }
    });
    // eslint-disable-next-line no-console
    console.log(`Seeded admin user: ${email}`);
  } else {
    // eslint-disable-next-line no-console
    console.log(`Admin user already exists: ${email}`);
  }
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
