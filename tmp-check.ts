import { prisma } from "./src/db/client";
(async () => {
  const users = await prisma.user.findMany();
  console.log(JSON.stringify(users, null, 2));
  process.exit(0);
})();
