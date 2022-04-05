import { logger } from "@bot/logger";
import { prisma } from "@bot/prisma";
import { User } from "@prisma/client";

const logMeta = {
  caller: "waitList.service",
};

export const addToWaitList = async (uid: number) => {
  logger.debug({
    msg: "addToWaitlist",
    ...logMeta,
  });
  try {
    await prisma.waitList.create({
      data: {
        userId: uid,
      },
    });
  } catch (e) {
    logger.error({
      msg: "Waitlisted User Exists",
      ...logMeta,
    });
  }
};

export const getWaitingMentees = async (user: User) => {
  const mentees = await prisma.waitList.findMany({
    where: {
      user: {
        specialization: user.specialization,
        yearsOfExperience: {
          lt: user.yearsOfExperience,
        },
      },
    },
    include: {
      user: true,
    },
  });

  return mentees;
};

export const removeFromWaitList = async (userId: number) => {
  const mentee = await prisma.waitList.findFirst({
    where: {
      user: {
        id: userId,
      },
    },
  });

  if (!mentee) {
    return;
  }

  await prisma.waitList.delete({
    where: {
      id: mentee?.id,
    },
  });
};
