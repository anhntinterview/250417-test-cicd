import { PrismaClient } from "../../apps/server/src/prisma/generated";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  const users = Array.from({ length: 100 }).map(() => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone_number: Number("09" + faker.string.numeric(8)),
    address: faker.location.streetAddress(),
    password: faker.internet.password(),
    role: "User" as const,
  }));

  await prisma.user.createMany({ data: users, skipDuplicates: true });

  console.log("✅ Seeded 100 users");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
