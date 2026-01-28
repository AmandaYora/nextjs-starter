import bcrypt from "bcryptjs";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Admin123!", 10);

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "System Admin",
      email: "admin@example.com",
      passwordHash,
      role: Role.ADMIN,
    },
  });

  console.info("Seed completed: admin@example.com / Admin123!");
}

main()
  .catch((error) => {
    console.error("SeedError", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
