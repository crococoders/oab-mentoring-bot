import { Composer } from "grammy";
import { isPrivate } from "grammy-guard";

import { Context } from "@bot/types";
import { logger } from "@bot/logger";
import { selectLanguageKeyboard } from "@bot/keyboards";
import { getMetadata } from "@bot/helpers/logging";

export const feature = new Composer<Context>().filter(isPrivate);

feature.use(selectLanguageKeyboard);

feature.command("language", async (ctx) => {
  logger.info({ msg: "handle language command", ...getMetadata(ctx) });

  await ctx.replyWithChatAction("typing");
  await ctx.reply(ctx.t("language.select"), {
    reply_markup: selectLanguageKeyboard,
  });
});
