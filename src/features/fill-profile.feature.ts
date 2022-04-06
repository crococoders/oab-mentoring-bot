import { Scene } from "grammy-scenes";
import { BotContext, User } from "@bot/types";
import { Specialization, Type } from "@prisma/client";
import { selectSpecializationKeyboard } from "@bot/keyboards";
import { isNumber } from "@bot/helpers/is-number";
import { logger } from "@bot/logger";

export const feature = new Scene<BotContext, User>("fill_profile");

const logContext = {
  caller: "fill-profile.feature",
};

feature.use((ctx, next) => {
  logger.info({
    msg: "entering scene",
    ...logContext,
  });
  ctx.scene.session = {
    name: "",
    specialization: Specialization.BACKEND,
    yearsOfExperience: 0,
    type: ctx.scene.arg as Type,
    telegramId: ctx.from!.id.toString(),
  };
  return next();
});

feature.do(async (ctx) => {
  logger.info({
    msg: "asked name",
    ...logContext,
  });
  await ctx.reply(ctx.t("enter_name"));
});

feature.wait().on("message:text", async (ctx) => {
  logger.info({
    msg: "received name",
    name: ctx.message.text,
    ...logContext,
  });
  ctx.scene.session.name = ctx.message.text;
  await ctx.reply(ctx.t("enter_specialization"), {
    reply_markup: selectSpecializationKeyboard,
  });
  ctx.scene.resume();
});

feature.wait().on(["callback_query:data", "message:text"], async (ctx) => {
  if (ctx.callbackQuery?.data !== undefined) {
    // @TODO: Надо локализовать
    await ctx.answerCallbackQuery("Принято!");
    logger.info({
      msg: "received specialization",
      data: ctx.callbackQuery.data,
      ...logContext,
    });
    ctx.scene.session.specialization = ctx.callbackQuery.data as Specialization;
    await ctx.reply(ctx.t("enter_yoe"));
    ctx.scene.resume();
  } else {
    logger.info({
      msg: "received wrong input on specialization",
      ...logContext,
    });
    await ctx.reply(ctx.t("re_enter_specialization"));
  }
});

feature.wait().on("message:text", async (ctx) => {
  if (
    ctx.msg !== undefined &&
    ctx.msg.text !== undefined &&
    !isNumber(ctx.msg.text!)
  ) {
    logger.error({
      msg: "years of experience validation failed",
      ...logContext,
    });
    await ctx.reply(ctx.t("yoe_validation_failed"));
  } else {
    logger.info({
      msg: "received years of experience",
      data: ctx.msg.text,
      ...logContext,
    });
    // @TODO: убедиться что здесь числа правильно округляются
    ctx.scene.session.yearsOfExperience = Number.parseInt(ctx.msg.text, 10);
    ctx.scene.resume();
  }
});

feature.do(async (ctx) => {
  logger.info({
    msg: "exiting scene",
    ...logContext,
  });
  ctx.scene.exit(ctx.scene.session);
});
