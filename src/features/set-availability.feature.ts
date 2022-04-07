import { BotContext } from "@bot/types";
import { setAvailabilityKeyboard } from "@bot/keyboards";
import { Composer } from "grammy";

export const feature = new Composer<BotContext>();

feature.use(setAvailabilityKeyboard);

feature.command("set_availability", async (ctx) => {
  await ctx.replyWithChatAction("typing");

  // checking user registered as mentor
  if (ctx.session.availability) {
    await ctx.reply(ctx.t("change_availability.action"), {
      reply_markup: setAvailabilityKeyboard,
    });
  } else {
    await ctx.reply(ctx.t("change_availability.command_fail"));
  }
});
