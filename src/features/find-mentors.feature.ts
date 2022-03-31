import { SessionFlavor, Composer, session } from "grammy";
import { Router } from "@grammyjs/router";
import { isPrivate } from "grammy-guard";
import { Context, SessionData } from "@bot/types";
import { selectSpecializationKeyboard } from "@bot/keyboards";
import tryToFindMentors from "@bot/helpers/try-to-find-mentors";
import paginate from "@bot/helpers/pagination";
import { Menu } from "@grammyjs/menu";

const PAGE_SIZE = 5;

type MyContext = Context & SessionFlavor<SessionData>;
export const composer = new Composer<MyContext>();

const filteredComposer = composer.filter(isPrivate);

// filteredComposer.use(
//   session({
//     initial: (): SessionData => ({
//       step: "gotName",
//       mentorsPage: 1,
//       mentors: [],
//     }),
//   })
// );

filteredComposer.command("find_mentors", async (ctx) => {
  await ctx.replyWithChatAction("typing");
  await ctx.reply(ctx.t("FILL_NAME"));
  ctx.session.step = "gotName";
});

const router = new Router<MyContext>((ctx) => ctx.session.step);
filteredComposer.use(selectSpecializationKeyboard);

router.route("gotName", async (ctx) => {
  await ctx.replyWithChatAction("typing");
  await ctx.reply(ctx.t("CHOOSE_SPECIALIZATION"), {
    reply_markup: selectSpecializationKeyboard,
  });
  ctx.session.step = "gotSpecialization";
});

router.route("gotSpecialization", async (ctx) => {
  await ctx.reply(ctx.t("YEARS_OF_EXPERIENCE"));
  ctx.session.step = "gotYearsOfExperience";
});

const validateYearsOfExperience = (ctx: any) => {
  return (
    !Number.isNaN(parseFloat(ctx.message.text)) &&
    !Number.isNaN(ctx.message.text - 0)
  );
};

router.route("gotYearsOfExperience", async (ctx) => {
  if (!validateYearsOfExperience(ctx)) {
    await ctx.reply(ctx.t("YEARS_OF_EXPERIENCE_WRONG"));
  } else {
    ctx.session.step = "displayMentors";
  }
});

const displayMentorsMenu = new Menu<MyContext>("display-mentors")
  .text("Показать ещё", (ctx) => {
    ctx.session.step = "displayMentors";
  })
  .text("Я нашел", (ctx) => ctx.reply("До новых встреч!"))
  .row();

router.route("displayMentors", async (ctx) => {
  if (!ctx.session.mentors || ctx.session.mentors.length === 0) {
    const mentors = await tryToFindMentors();
    ctx.session.mentors = mentors;
    ctx.session.mentorsPage = 1;
  }

  if (ctx.session.mentors.length > 0) {
    await ctx.reply(ctx.t("BOT_FOUND_MENTORS"));

    const pagination = paginate(
      ctx.session.mentors.length,
      ctx.session.mentorsPage,
      PAGE_SIZE
    );

    if (ctx.session.mentorsPage > pagination.endPage) {
      await ctx.reply(ctx.t("NO_MENTORS_FOUND"));
    }

    const replies = ctx.session.mentors
      .slice(pagination.startIndex, pagination.endIndex + 1)
      .map((mentor) => {
        return ctx.reply(
          `👤 ${mentor.name}\nОпыт: ${mentor.yearsOfExperience} года`
        );
      });

    ctx.session.mentorsPage += 1;
    await Promise.all(replies);

    await ctx.reply(ctx.t("MENTORS_FOUND"), {
      reply_markup: displayMentorsMenu,
    });
  } else {
    await ctx.reply(ctx.t("NO_MENTORS_FOUND"));
  }
});
filteredComposer.use(displayMentorsMenu);
filteredComposer.use(router);
