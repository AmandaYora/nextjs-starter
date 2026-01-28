import { prisma } from "./src/db/client";
(async () => {
  const columns = await prisma.$queryRaw<Array<Record<string, unknown>>>`DESCRIBE user`;
  console.log(columns);
  process.exit(0);
})();
