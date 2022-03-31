import { Scene, SceneFlavoredContext } from "grammy-scenes";
import { Context, SessionState, specializations } from "@bot/types";
import { InlineKeyboardButton, InlineKeyboardMarkup } from "@grammyjs/types";
import tryToFindMentors from "@bot/helpers/try-to-find-mentors";
import paginate from "@bot/helpers/pagination";

export const findMentorsScene = new Scene<Context, SessionState>(
  "find_mentors"
);

const selectSpecializationKeyboard: InlineKeyboardMarkup = {
  inline_keyboard: specializations.map((s): InlineKeyboardButton[] => {
    return [
      {
        text: s.name,
        callback_data: s.key,
      },
    ];
  }),
};

const displayMentorsMenu: any = {
  inline_keyboard: [
    [
      {
        text: "Показать ещё",
        callback_data: "more",
      },
      {
        text: "Я нашёл",
        callback_data: "found",
      },
    ],
  ],
};

const validateYearsOfExperience = (ctx: Context) => {
  if (ctx.msg !== undefined && ctx.msg.text !== undefined) {
    return (
      !Number.isNaN(parseFloat(String(ctx.msg.text!))) &&
      Number.isFinite(Number(ctx.msg.text!))
    );
  }
  return false;
};

findMentorsScene.use((ctx, next) => {
  console.log("Entering main scene...");
  ctx.scene.session = {
    mentors: [],
    mentorsPage: 1,
  };
  return next();
});

findMentorsScene.do(async (ctx) => {
  await ctx.reply(ctx.t("FILL_NAME"));
});

findMentorsScene.wait().on("message:text", async (ctx) => {
  console.log("Received name", ctx.message.text);
  await ctx.reply(ctx.t("CHOOSE_SPECIALIZATION"), {
    reply_markup: selectSpecializationKeyboard,
  });

  ctx.scene.resume();
});

findMentorsScene
  .wait()
  .on(["callback_query:data", "message:text"], async (ctx) => {
    if (ctx.callbackQuery?.data !== undefined) {
      await ctx.answerCallbackQuery("Принято!");
      console.log("Received specialization", ctx.callbackQuery.data);
      await ctx.reply(ctx.t("YEARS_OF_EXPERIENCE"));
      ctx.scene.resume();
    } else {
      await ctx.reply("Выбери одно из направлений нажав кнопку.");
    }
  });

findMentorsScene.wait().on("message:text", async (ctx) => {
  if (!validateYearsOfExperience(ctx)) {
    await ctx.reply(ctx.t("YEARS_OF_EXPERIENCE_WRONG"));
  } else {
    ctx.scene.resume();
  }
});

const handler = async (ctx: SceneFlavoredContext<Context, SessionState>) => {
  if (!ctx.scene.session.mentors || ctx.scene.session.mentors.length === 0) {
    const mentors = await tryToFindMentors();
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
      await ctx.reply(ctx.t("NO_MORE_MENTORS"));
      return;
    }

    await ctx.reply(ctx.t("BOT_FOUND_MENTORS"));

    const replies = ctx.scene.session.mentors
      .slice(pagination.startIndex, pagination.endIndex + 1)
      .map((mentor: any) => {
        return ctx.reply(
          `👤 ${mentor.name}\nОпыт: ${mentor.yearsOfExperience} года`
        );
      });

    ctx.scene.session.mentorsPage += 1;

    await Promise.all(replies);

    await ctx.reply(ctx.t("MENTORS_FOUND"), {
      reply_markup: displayMentorsMenu,
    });
  } else {
    await ctx.reply(ctx.t("NO_MENTORS_FOUND"));
  }
};

findMentorsScene.do(handler);

findMentorsScene.wait().on("callback_query:data", async (ctx) => {
  await ctx.answerCallbackQuery();
  console.log("Received action", ctx.callbackQuery.data);
  if (ctx.callbackQuery.data === "found") {
    await ctx.reply(ctx.t("MENTORS_FINDING_CONFIRMED"));
    ctx.scene.exit();
  } else {
    await handler(ctx);
  }
});
