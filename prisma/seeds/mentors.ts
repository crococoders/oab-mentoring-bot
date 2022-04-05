import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const mara = await prisma.user.create({
    data: {
      name: "Марат Абылкаиров",
      specialization: "MOBILE",
      yearsOfExperience: 2,
      type: "MENTOR",
      telegramId: "1",
    },
  });

  const aidar = await prisma.user.create({
    data: {
      name: "Айдар Нугманов",
      specialization: "MOBILE",
      yearsOfExperience: 5,
      type: "MENTOR",
      telegramId: "2",
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
