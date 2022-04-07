import { BotError } from "grammy";
import { BotContext } from "@bot/types";
import { logger } from "@bot/logger";

export const handleError = async (error: BotError<BotContext>) => {
  const { ctx } = error;
  const err = error.error;

  logger.error({
    update_id: ctx.update.update_id,
    err,
  });
};
