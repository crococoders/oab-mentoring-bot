import { NextFunction } from "grammy";

import { Context } from "@bot/types";
import { usersService } from "@bot/services";
import { logger } from "@bot/logger";

export const middleware = () => async (ctx: Context, next: NextFunction) => {
  // logger.info({
  //   msg: "logging session state",
  //   session_step: ctx.session.step,
  // });

  // if (ctx.from?.is_bot === false) {
  // logger.info({
  //   msg: "trying to register a user",
  //   user: ctx.from,
  // });
  //   const { id: telegramId, language_code: languageCode } = ctx.from;
  //   ctx.user = await usersService.findOrCreateByTelegramId(telegramId, {
  //     languageCode,
  //   });
  // }

  return next();
};
