import { Scene } from "grammy-scenes";
import { BotContext } from "@bot/types";
import { Type } from "@prisma/client";
import { saveUser } from "@bot/services/users.service";
import { getWaitingMentees } from "@bot/services/waitList.service";
import { logger } from "@bot/logger";
import { compose } from "@bot/helpers/type-operations";

export const feature = new Scene<BotContext>("register_as_mentor");

const logContext = {
  caller: "register_as_mentor.feature",
};

feature.use((ctx, next) => {
  logger.info({
    msg: "entering scene",
    ...logContext,
  });

  if (!ctx.session.user) {
    ctx.scene.call("fill_profile", Type.MENTOR);
  } else {
    ctx.session.user.type = compose(ctx.session.user.type, Type.MENTOR);
  }

  return next();
});

feature.do(async (ctx) => {
  let user;
  if (ctx.scene.arg) {
    logger.info({
      msg: "user comes from arg",
      user: ctx.scene.arg,
      ...logContext,
    });
    user = ctx.scene.arg;
  } else {
    logger.info({
      msg: "user comes from session",
      user: ctx.session.user,
      ...logContext,
    });
    user = ctx.session.user;
  }
  try {
    const mentor = await saveUser(user);
    ctx.session.user = mentor;
    await ctx.reply(
      `👤 ${mentor.name}\nОпыт: ${mentor.yearsOfExperience} года`
    );
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
