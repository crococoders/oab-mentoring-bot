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

export const updateByTelegramId = async (
  telegramId: string,
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
