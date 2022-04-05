import { Scene, SceneFlavoredContext } from "grammy-scenes";
import { Context, SessionState } from "@bot/types";
import paginate from "@bot/helpers/pagination";
import {
  mentorsListActionsKeyboard,
  selectSpecializationKeyboard,
} from "@bot/keyboards";
import { isNumber } from "@bot/helpers/is-number";
import { Specialization, Type } from "@prisma/client";
import { getMentors, saveUser } from "@bot/services/users.service";
import { addToWaitList } from "@bot/services/waitList.service";

export const feature = new Scene<Context, SessionState>("find_mentors");

feature.use((ctx, next) => {
  console.log("Entering main scene...");
  ctx.scene.session = {
    mentors: [],
    mentorsPage: 1,
    user: {
      name: "",
      specialization: Specialization.BACKEND,
      yearsOfExperience: 0,
      type: Type.MENTEE,
      telegramId: ctx.from!.id.toString(),
    },
    userId: -1,
  };
  return next();
});

feature.do(async (ctx) => {
  await ctx.reply(ctx.t("enter_name"));
});

feature.wait().on("message:text", async (ctx) => {
  console.log("Received name", ctx.message.text);
  ctx.scene.session.user.name = ctx.message.text;
  await ctx.reply(ctx.t("enter_specialization"), {
    reply_markup: selectSpecializationKeyboard,
  });

  ctx.scene.resume();
});

feature.wait().on(["callback_query:data", "message:text"], async (ctx) => {
  if (ctx.callbackQuery?.data !== undefined) {
    await ctx.answerCallbackQuery("Принято!");
    ctx.scene.session.user.specialization = ctx.callbackQuery
      .data as Specialization;
    console.log("Received specialization", ctx.callbackQuery.data);
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
    console.log("Received years of experience", ctx.msg.text);
    ctx.scene.session.user.yearsOfExperience = +ctx.msg.text;

    try {
      console.log("Saving user", ctx.scene.session.user);
      const user = await saveUser(ctx.scene.session.user);
      ctx.scene.session.userId = user.id;
    } catch (e) {
      console.error(e);
      // @TODO: Нужно поменять текст
      await ctx.reply(ctx.t("register_as_mentor_fail"));
      ctx.scene.exit();
    }

    ctx.scene.resume();
  }
});

const handler = async (ctx: SceneFlavoredContext<Context, SessionState>) => {
  if (!ctx.scene.session.mentors || ctx.scene.session.mentors.length === 0) {
    const mentors = await getMentors(ctx.scene.session.user);
    ctx.scene.session.mentors = mentors;
    ctx.scene.session.mentorsPage = 1;
  }

  if (ctx.scene.session.mentors.length > 0) {
    const pagination = paginate(
      ctx.scene.session.mentors.length,
      ctx.scene.session.mentorsPage,
      5
    );

    if (ctx.scene.session.mentorsPage > pagination.endPage) {
      await ctx.reply(ctx.t("no_more_matching_mentors"));
      return;
    }

    await ctx.reply(ctx.t("found_mentors"));

    const replies = ctx.scene.session.mentors
      .slice(pagination.startIndex, pagination.endIndex + 1)
      .map((mentor: any) => {
        return ctx.reply(
          `👤 ${mentor.name}\nОпыт: ${mentor.yearsOfExperience} года`
        );
      });

    ctx.scene.session.mentorsPage += 1;

    await Promise.all(replies);

    await ctx.reply(ctx.t("mentors_list_actions"), {
      reply_markup: mentorsListActionsKeyboard,
    });
  } else {
    try {
      console.log("inside try ");

      await addToWaitList(ctx.scene.session.userId);
      await ctx.reply(ctx.t("no_matching_mentors"));
    } catch (e) {
      console.error(e);
      // @TODO: Нужно поменять текст
      await ctx.reply(ctx.t("register_as_mentor_fail"));
      ctx.scene.exit();
    }
  }
};

feature.do(handler);

feature.wait().on("callback_query:data", async (ctx) => {
  await ctx.answerCallbackQuery();
  console.log("Received action", ctx.callbackQuery.data);
  if (ctx.callbackQuery.data === "found") {
    await ctx.reply(ctx.t("mentors_finding_confirmed"));
    ctx.scene.exit();
  } else {
    // waiting list
    await addToWaitList(ctx.scene.session.userId);
    await handler(ctx);
  }
});
