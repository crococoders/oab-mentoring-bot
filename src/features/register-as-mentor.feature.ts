import { Scene } from "grammy-scenes";
import { BotContext } from "@bot/types";
import { Type } from "@prisma/client";
import { saveUser } from "@bot/services/users.service";
import { getWaitingMentees } from "@bot/services/waitList.service";
import { logger } from "@bot/logger";

export const feature = new Scene<BotContext>("register_as_mentor");

const logContext = {
  caller: "register_as_mentor.feature",
};

const isUserInSession = false;

feature.use((ctx, next) => {
  logger.info({
    msg: "entering scene",
    ...logContext,
  });

  if (!isUserInSession) {
    ctx.scene.call("profile", Type.MENTOR);
  }

  return next();
});

feature.do(async (ctx) => {
  logger.info({
    msg: "received argument",
    arg: ctx.scene.arg,
    ...logContext,
  });
  const user = ctx.scene.arg;
  try {
    const mentor = await saveUser(user);
    await ctx.reply(`👤 ${user.name}\nОпыт: ${user.yearsOfExperience} года`);
    await ctx.reply(ctx.t("mentors_finding_confirmed"));
    const mentees = await getWaitingMentees(mentor);
    mentees.forEach(async (mentee) => {
      await ctx.api.sendMessage(
        mentee.user.telegramId,
        // @TODO: Поправить локализацию
        "У нас зарегистрировался новый ментор, который вам возможно подходит!"
      );
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    await ctx.reply(ctx.t("register_as_mentor_fail"));
    ctx.scene.exit();
  }
});
