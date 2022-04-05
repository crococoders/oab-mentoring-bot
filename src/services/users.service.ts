import { logger } from "@bot/logger";
import { prisma } from "@bot/prisma";
import { Filters } from "@bot/types/filters";
import { User } from "@bot/types/user";
import { Specialization, Type } from "@prisma/client";

const logMeta = {
  caller: "users.service",
};

export const getMentors = async (user: User) => {
  logger.debug({
    msg: "get mentors list",
    ...logMeta,
  });

  const mentors = await prisma.user.findMany({
    where: {
      OR: [
        {
          type: Type.MENTOR,
        },
        {
          type: Type.BOTH,
        },
      ],
      specialization: user.specialization,
      yearsOfExperience: {
        gt: user.yearsOfExperience,
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
