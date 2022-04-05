import { Scene, SceneFlavoredContext } from "grammy-scenes";
import { Context, User } from "@bot/types";
import { Specialization, Type } from "@prisma/client";
import { selectSpecializationKeyboard } from "@bot/keyboards";
import { isNumber } from "@bot/helpers/is-number";
import { saveUser } from "@bot/services/users.service";

export const feature = new Scene<Context, User>("register_as_mentor");

feature.use((ctx, next) => {
  console.log("Entering mentor registration scene...");
  ctx.scene.session = {
    name: "",
    specialization: Specialization.BACKEND,
    yearsOfExperience: 0,
    type: Type.MENTOR,
    telegramId: ctx.from!.id.toString(),
  };
  return next();
});

feature.do(async (ctx) => {
  await ctx.reply(ctx.t("enter_name"));
});

feature.wait().on("message:text", async (ctx) => {
  console.log("Received name", ctx.message.text);
  ctx.scene.session.name = ctx.message.text;
  await ctx.reply(ctx.t("enter_specialization"), {
    reply_markup: selectSpecializationKeyboard,
  });

  ctx.scene.resume();
});

feature.wait().on(["callback_query:data", "message:text"], async (ctx) => {
  if (ctx.callbackQuery?.data !== undefined) {
    await ctx.answerCallbackQuery("Принято!");
    console.log("Received specialization", ctx.callbackQuery.data);
    ctx.scene.session.specialization = ctx.callbackQuery.data as Specialization;

    await ctx.reply(ctx.t("enter_yoe"));
    ctx.scene.resume();
  } else {
    await ctx.reply(ctx.t("re_enter_specialization"));
  }
});

feature.wait().on("message:text", async (ctx) => {
  if (
    ctx.msg !== undefined &&
    ctx.msg.text !== undefined &&
    !isNumber(ctx.msg.text!)
  ) {
    await ctx.reply(ctx.t("yoe_validation_failed"));
  } else {
    ctx.scene.session.yearsOfExperience = Number.parseInt(ctx.msg.text, 10);
    ctx.scene.resume();
  }
});

const handler = async (ctx: SceneFlavoredContext<Context, User>) => {
  try {
    await saveUser(ctx.scene.session);
    await ctx.reply(
      `👤 ${ctx.scene.session.name}\nОпыт: ${ctx.scene.session.yearsOfExperience} года`
    );
    await ctx.reply(ctx.t("mentors_finding_confirmed"));
  } catch (e) {
    console.error(e);
    await ctx.reply(ctx.t("register_as_mentor_fail"));
    ctx.scene.exit();
  }
};

feature.do(handler);
