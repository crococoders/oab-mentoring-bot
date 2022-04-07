import { logger } from "@bot/logger";
import { prisma } from "@bot/prisma";
import { User } from "@bot/types/user";
import { Availability, Type, VerificationStatus } from "@prisma/client";

const logMeta = {
  caller: "users.service",
};

export const updateAvailability = async (
  telegramId: string,
  availability?: Availability
) => {
  logger.debug({
    msg: "set availability",
    ...logMeta,
  });

  return prisma.user.update({
    where: {
      telegramId,
    },
    data: {
      availability,
    },
  });
};

export const findUser = async (telegramId: string) => {
  logger.debug({
    msg: "findUser",
    ...logMeta,
  });

  return prisma.user.findFirst({
    where: {
      telegramId,
    },
  });
};

export const saveUser = async (userDTO: User) => {
  logger.debug({
    msg: "saveUser",
    user: userDTO,
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
      AND: [
        {
          verificationStatus: VerificationStatus.APPROVED,
        },
        {
          availability: Availability.AVAILABLE,
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
