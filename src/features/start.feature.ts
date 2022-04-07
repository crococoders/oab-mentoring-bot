import { Composer } from "grammy";
import { isPrivate } from "grammy-guard";
import { BotContext } from "@bot/types";
import { logger } from "@bot/logger";

export const feature = new Composer<BotContext>().filter(isPrivate);

const logContext = {
  caller: "start.feature",
};

feature.command("start", async (ctx) => {
  logger.info({
    msg: "handling started",
    ...logContext,
  });
  await ctx.replyWithChatAction("typing");
  await ctx.reply(ctx.t("welcome"));
});
