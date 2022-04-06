import { NextFunction } from "grammy";

import { logger } from "@bot/logger";
import { BotContext } from "@bot/types";

export const middleware = () => (ctx: BotContext, next: NextFunction) => {
  logger.debug({
    msg: "update received",
    ...ctx.update,
  });
  return next();
};
