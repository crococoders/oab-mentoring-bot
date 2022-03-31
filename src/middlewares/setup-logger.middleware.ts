import { NextFunction } from "grammy";
import { Context } from "@bot/types";
import { middlewareContext } from "@bot/context";
import { rawLogger } from "@bot/logger";

export const middleware = () => (ctx: Context, next: NextFunction) => {
  middlewareContext.getStore()?.set(
    "logger",
    rawLogger.child({
      updateId: ctx.update.update_id,
    })
  );

  return next();
};
