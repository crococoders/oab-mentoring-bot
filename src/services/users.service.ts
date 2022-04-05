import { logger } from "@bot/logger";
import { prisma } from "@bot/prisma";
import { User } from "@bot/types/user";
import { Type } from "@prisma/client";

const logMeta = {
  caller: "users.service",
};

export const saveUser = async (userDTO: User) => {
  logger.debug({
    msg: "save user",
    ...logMeta,
  });

  const user = await prisma.user.findFirst({
    where: {
      telegramId: userDTO.telegramId,
    },
  });

  if (user && user.type !== userDTO.type) {
    // eslint-disable-next-line no-param-reassign
    userDTO.type = Type.BOTH;
  }

  return prisma.user.upsert({
    where: {
      telegramId: userDTO.telegramId,
    },
    update: {
      name: userDTO.name,
      specialization: userDTO.specialization,
      yearsOfExperience: userDTO.yearsOfExperience,
      type: userDTO.type,
    },
    create: {
      name: userDTO.name,
      specialization: userDTO.specialization,
      yearsOfExperience: userDTO.yearsOfExperience,
      type: userDTO.type,
      telegramId: userDTO.telegramId,
    },
  });
};

export const getMentors = async (user: User) => {
  logger.debug({
    msg: "db query: get mentors list",
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
