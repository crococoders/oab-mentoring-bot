import { Composer } from "grammy";
import { isPrivate } from "grammy-guard";
import { Context } from "@bot/types";
import { logger } from "@bot/logger";
import { getMetadata } from "@bot/helpers/logging";

export const feature = new Composer<Context>().filter(isPrivate);

feature.command("start", async (ctx) => {
  // logger.info({ msg: "handle start command", ...getMetadata(ctx) });
  await ctx.replyWithChatAction("typing");
  await ctx.reply(ctx.t("WELCOME"));
});
