import { NextFunction } from "grammy";
import { BotContext } from "@bot/types";
import { locales } from "@bot/helpers/i18n";
import { logger } from "@bot/logger";

export const middleware = () => async (ctx: BotContext, next: NextFunction) => {
  if (ctx.from?.is_bot === false) {
    logger.info({
      msg: "trying to register a user",
      user: ctx.from,
    });
    const { language_code: languageCode } = ctx.from;

    if (!ctx.session.languageCode) {
      ctx.session.languageCode =
        languageCode && locales.includes(languageCode) ? languageCode : "ru";
    }
  }

  return next();
};
