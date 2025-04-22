import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function test() {
  try {
    const users = await prisma.user.findMany();
    console.log("Users in DB:", users);
  } catch (error) {
    console.error("Prisma error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

test();

// npx ts-node prisma-test.ts
