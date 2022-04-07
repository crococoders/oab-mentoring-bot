import { NextFunction } from "grammy";
import { BotContext } from "@bot/types";
import { logger } from "@bot/logger";
import { getUserIfAny } from "@bot/services/users.service";

const logContext = {
  caller: "set-user-session.middleware",
};

export const middleware = () => async (ctx: BotContext, next: NextFunction) => {
  logger.info({
    msg: "user in session",
    user: ctx.session.user,
    ...logContext,
  });
  if (ctx.session.user === undefined) {
    const user = await getUserIfAny(ctx.from!.id.toString());
    if (user !== null) {
      ctx.session.user = user;
      logger.info({
        msg: "set user in session",
        user: ctx.session.user,
        ...logContext,
      });
    }
  }

  return next();
};
