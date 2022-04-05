import { logger } from "@bot/logger";
import { prisma } from "@bot/prisma";
import { Filters } from "@bot/types/filters";
import { Specialization } from "@prisma/client";

const logMeta = {
  caller: "users.service",
};

export const getMentors = async (filters: Filters) => {
  logger.debug({
    msg: "get mentors list",
    ...logMeta,
  });

  const mentors = await prisma.user.findMany({
    where: {
      type: "MENTOR",
      specialization: filters.specialization as Specialization,
      yearsOfExperience: {
        gt: filters.yearsOfExperience,
      },
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
