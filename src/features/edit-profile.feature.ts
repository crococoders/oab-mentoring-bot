import { Scene } from "grammy-scenes";
import { BotContext } from "@bot/types";
import { Type } from "@prisma/client";
import { saveUser } from "@bot/services/users.service";
import { logger } from "@bot/logger";

export const feature = new Scene<BotContext>("edit_profile");

const logContext = {
  caller: "edit_profile.feature",
};

feature.use((ctx) => {
  logger.info({
    msg: "entering scene",
    ...logContext,
  });

  ctx.scene.call("fill_profile", Type.MENTOR);
});

feature.do(async (ctx) => {
  logger.info({
    msg: "received argument",
    arg: ctx.scene.arg,
    ...logContext,
  });

  try {
    const user = ctx.scene.arg;
    await saveUser(user);
    await ctx.reply(`👤 ${user.name}\nОпыт: ${user.yearsOfExperience} года`);
    // @TODO: Локализация
    await ctx.reply("Профиль успешно обновлён!");
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    await ctx.reply(ctx.t("Возникла ошибка!"));
    ctx.scene.exit();
  }
});
