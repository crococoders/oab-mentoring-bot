import { BotContext } from "@bot/types";
import { setAvailabilityKeyboard } from "@bot/keyboards";
import { Composer } from "grammy";
import { Type } from "@prisma/client";

export const feature = new Composer<BotContext>();

feature.use(setAvailabilityKeyboard);

feature.command("set_availability", async (ctx) => {
  await ctx.replyWithChatAction("typing");
  if (ctx.session.user !== null && ctx.session.user !== undefined) {
    if (
      ctx.session.user!.type === Type.MENTOR ||
      ctx.session.user!.type === Type.BOTH
    ) {
      await ctx.reply(ctx.t("change_availability.action"), {
        reply_markup: setAvailabilityKeyboard,
      });
    } else {
      await ctx.reply(ctx.t("change_availability.command_fail"));
    }
  } else {
    await ctx.reply(ctx.t("change_availability.command_fail"));
  }
});
