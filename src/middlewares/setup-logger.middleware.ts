import { NextFunction } from "grammy";
import { BotContext } from "@bot/types";
import { middlewareContext } from "@bot/context";
import { rawLogger } from "@bot/logger";

export const middleware = () => (ctx: BotContext, next: NextFunction) => {
  middlewareContext.getStore()?.set(
    "logger",
    rawLogger.child({
      // updateId: ctx.update.update_id,
    })
  );

  return next();
};
