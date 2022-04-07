import { Scene } from "grammy-scenes";
import { BotContext } from "@bot/types";
import { saveUser } from "@bot/services/users.service";
import { logger } from "@bot/logger";

export const feature = new Scene<BotContext>("edit_profile");

const logContext = {
  caller: "edit_profile.feature",
};

feature.use(async (ctx) => {
  logger.info({
    msg: "entering scene",
    ...logContext,
  });

  if (ctx.session.user !== null && ctx.session.user !== undefined) {
    console.log("hello", ctx.session.user);
    ctx.scene.call("fill_profile", ctx.session.user!.type);
  } else {
    await ctx.reply(
      ctx.t(
        "У вас еще нет профиля. Для начала зарегистрируйтесь как ментор или менти с помощью команд /register_as_mentor или /find_mentors"
      )
    );
    ctx.scene.exit();
  }
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
    // Не забываем обновить юзера в кэше
    ctx.session.user = user;
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
