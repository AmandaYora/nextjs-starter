import { prisma } from "./src/db/client";
(async () => {
  const tables = await prisma.$queryRaw<Array<{ table_name: string }>>`SHOW TABLES`;
  console.log(tables);
  process.exit(0);
})();
