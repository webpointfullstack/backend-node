const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  //   const user = await prisma.user.create({
  //     data: {
  //       name: "user 2",
  //       password: "password",
  //       email: "user2@mail.com",
  //     },
  //   });

  const users = await prisma.user.findFirst({ where: { id: 3 } });

  console.log(users);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
