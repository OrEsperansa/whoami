import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const databaseUrl = process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/sigit_faces?schema=public";
const prisma = new PrismaClient({ adapter: new PrismaPg(databaseUrl) });

async function main() {
  await prisma.competitionResult.deleteMany();
  await prisma.competitionSession.deleteMany();
  await prisma.trainingAttempt.deleteMany();
  await prisma.userPersonProgress.deleteMany();
  await prisma.trainingSet.deleteMany();
  await prisma.person.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log("Database cleared. No default commanders, trainees, categories, sets, or results were seeded.");
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
