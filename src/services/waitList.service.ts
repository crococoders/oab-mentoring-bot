import { logger } from "@bot/logger";
import { prisma } from "@bot/prisma";

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
