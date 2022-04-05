import { Scene, SceneFlavoredContext } from "grammy-scenes";
import { Context, Mentor } from "@bot/types";
import { PrismaClient, Specialization, Type } from "@prisma/client";
import { selectSpecializationKeyboard } from "@bot/keyboards";
import { isNumber } from "@bot/helpers/is-number";

const prisma = new PrismaClient();
export const feature = new Scene<Context, Mentor>("register_as_mentor");

feature.use((ctx, next) => {
  console.log("Entering mentor registration scene...");
  ctx.scene.session = {
    name: "",
    specialization: "",
    yearsOfExperience: 0,
  };
  return next();
});

feature.do(async (ctx) => {
  await ctx.reply(ctx.t("enter_name"));
});

feature.wait().on("message:text", async (ctx) => {
  console.log("Received name", ctx.message.text);
  ctx.session.name = ctx.message.text;
  await ctx.reply(ctx.t("enter_specialization"), {
    reply_markup: selectSpecializationKeyboard,
  });

  ctx.scene.resume();
});

feature.wait().on(["callback_query:data", "message:text"], async (ctx) => {
  if (ctx.callbackQuery?.data !== undefined) {
    await ctx.answerCallbackQuery("Принято!");
    console.log("Received specialization", ctx.callbackQuery.data);
    ctx.session.specialization = ctx.callbackQuery.data;

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
    ctx.session.yearsOfExperience = Number.parseInt(ctx.msg.text, 10);
    ctx.scene.resume();
  }
});

const handler = async (ctx: SceneFlavoredContext<Context, Mentor>) => {
  const { name, yearsOfExperience, specialization } = ctx.session;
  const telegramId = ctx.from!.id.toString();
  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        specialization: specialization.toUpperCase() as Specialization,
        yearsOfExperience,
        type: Type.MENTOR,
        telegramId,
      },
    });
    console.log(newUser);
    await ctx.reply(
      `👤 ${newUser.name}\nОпыт: ${newUser.yearsOfExperience} года`
    );
    await ctx.reply(ctx.t("mentors_finding_confirmed"));
  } catch (e) {
    console.error(e);
    await ctx.reply(ctx.t("register_as_mentor_fail"));
  } finally {
    await prisma.$disconnect();
    ctx.scene.exit();
  }
};

feature.do(handler);
