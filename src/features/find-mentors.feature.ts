import { Scene, SceneFlavoredContext } from "grammy-scenes";
import { BotContext, User } from "@bot/types";
import paginate from "@bot/helpers/pagination";
import { mentorsListActionsKeyboard } from "@bot/keyboards";
import { getMentors, saveUser } from "@bot/services/users.service";
import {
  addToWaitList,
  removeFromWaitList,
} from "@bot/services/waitList.service";
import { logger } from "@bot/logger";
import { Type } from "@prisma/client";
import { compose } from "@bot/helpers/type-operations";

const logContext = {
  caller: "findMentors.feature",
};

interface FindMentorsSession {
  user?: User;
  userId: number;
  mentors: User[];
  mentorsPage: number;
}

export const feature = new Scene<BotContext, FindMentorsSession>(
  "find_mentors"
);

feature.use((ctx, next) => {
  logger.info({
    msg: "entering scene",
    ...logContext,
  });

  if (!ctx.session.user) {
    ctx.scene.call("fill_profile", Type.MENTEE);
  } else {
    ctx.session.user.type = compose(ctx.session.user.type, Type.MENTEE);
  }

  ctx.scene.session = {
    mentors: [],
    mentorsPage: 1,
    userId: -1,
  };
  return next();
});

feature.do(async (ctx, next) => {
  try {
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

    const savedUser = await saveUser(user);
    ctx.scene.session.user = user;
    ctx.scene.session.userId = savedUser.id;
    ctx.session.user = savedUser;
    return next();
  } catch (e) {
    console.error(e);
    // @TODO: Нужно поменять текст
    await ctx.reply(ctx.t("register_as_mentor_fail"));
    return ctx.scene.exit();
  }
});
feature.use(mentorsListActionsKeyboard);

const displayMentorsList = async (
  ctx: SceneFlavoredContext<BotContext, FindMentorsSession>
) => {
  if (
    ctx.scene.session.user &&
    (!ctx.scene.session.mentors || ctx.scene.session.mentors.length === 0)
  ) {
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
      .map((mentor: User) => {
        return ctx.reply(
          // @TODO: Надо перевести
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
      await addToWaitList(ctx.scene.session.userId);
      await ctx.reply(ctx.t("no_matching_mentors"));
    } catch (e) {
      console.error(e);
      // @TODO: Нужно поменять текст
      await ctx.reply(ctx.t("register_as_mentor_fail"));
    } finally {
      ctx.scene.exit();
    }
  }
};

feature.do(displayMentorsList);

feature.wait().on("callback_query:data", async (ctx) => {
  await ctx.answerCallbackQuery();
  console.log("Received action", ctx.callbackQuery.data);
  if (ctx.callbackQuery.data.includes("found")) {
    await ctx.reply(ctx.t("mentors_finding_confirmed"));
    await removeFromWaitList(ctx.scene.session.userId);
    ctx.scene.exit();
  } else {
    // waiting list
    await addToWaitList(ctx.scene.session.userId);
    await displayMentorsList(ctx);
  }
});
