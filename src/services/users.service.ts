import { logger } from "@bot/logger";
import { prisma } from "@bot/prisma";

const logMeta = {
  caller: "users.service",
};

export const getMentors = async () => {
  logger.debug({
    msg: "get mentors list",
    ...logMeta,
  });

  const mentors = await prisma.user.findMany({
    where: {
      type: "MENTOR",
    },
  });

  return mentors;
};

// NEED TO FIX!!
export const findOrCreateByTelegramId = async (
  telegramId: number,
  data: {
    languageCode?: string | null;
  }
) => {
  logger.debug({
    msg: "find or create user by telegram id",
    telegramId,
    data,
    ...logMeta,
  });

  const { languageCode } = data;

  return prisma.user.upsert({
    where: {
      telegramId,
    },
    update: {},
    create: {
      telegramId,
      languageCode,
      name: "",
      specialization: "MOBILE",
      yearsOfExperience: 0,
      type: "MENTEE",
    },
  });
};

export const updateByTelegramId = async (
  telegramId: number,
  data: {
    languageCode?: string | null;
  }
) => {
  logger.debug({
    msg: "update user by telegram id",
    telegramId,
    data,
    ...logMeta,
  });

  const { languageCode } = data;

  return prisma.user.update({
    where: {
      telegramId,
    },
    data: {
      languageCode,
    },
  });
};

export const getTotalCount = async () => {
  logger.debug({
    msg: "get total users count",
    ...logMeta,
  });

  return prisma.user.count();
};
