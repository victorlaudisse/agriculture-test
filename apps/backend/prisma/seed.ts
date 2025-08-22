import argon2 from "argon2";

import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  const password = await argon2.hash("12345678");

  const user = await prisma.user.upsert({
    where: { email: "demo@user.com" },
    update: {},
    create: {
      name: "Usuário Demo",
      email: "demo@user.com",
      password_hash: password,
    },
  });

  const field1 = await prisma.field.create({
    data: {
      name: "Talhão Norte",
      crop: "Soja",
      area_ha: 12.5,
      latitude: -22.112233,
      longitude: -47.123456,
      user_id: user.id,
    },
  });

  await prisma.activity.createMany({
    data: [
      {
        type: "PLANTIO",
        date: new Date("2025-05-01"),
        notes: "Plantio direto",
        field_id: field1.id,
      },
      {
        type: "ADUBACAO",
        date: new Date("2025-05-15"),
        notes: "Nitrogênio aplicado",
        field_id: field1.id,
      },
    ],
  });
}

main()
  .then(() => {
    console.log("🌱 Seed rodado com sucesso");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
