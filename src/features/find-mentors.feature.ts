import { SessionFlavor, Composer, session } from "grammy";
import { Router } from "@grammyjs/router";
import { isPrivate } from "grammy-guard";
import { Context } from "@bot/types";
import { selectSpecializationKeyboard } from "@bot/keyboards";
import tryToFindMentors from "@bot/helpers/try-to-find-mentors";
import paginate from "@bot/helpers/pagination";
import { Menu } from "@grammyjs/menu";

interface SessionData {
  step:
    | "gotName"
    | "gotSpecialization"
    | "gotYearsOfExperience"
    | "displayMentors";
  mentors: [];
  mentorsPage: 1;
}

const PAGE_SIZE = 5;

type MyContext = Context & SessionFlavor<SessionData>;
export const composer = new Composer<MyContext>();

const filteredComposer = composer.filter(isPrivate);

function initial(): SessionData {
  return { step: "gotName", mentors: [], mentorsPage: 1 };
}
filteredComposer.use(session({ initial }));

filteredComposer.command("find_mentors", async (ctx) => {
  await ctx.replyWithChatAction("typing");
  await ctx.reply(ctx.t("fillName"));
  ctx.session.step = "gotName";
});

const router = new Router<MyContext>((ctx) => ctx.session.step);
filteredComposer.use(selectSpecializationKeyboard);

router.route("gotName", async (ctx) => {
  await ctx.replyWithChatAction("typing");
  await ctx.reply(ctx.t("chooseSpecialization"), {
    reply_markup: selectSpecializationKeyboard,
  });
  ctx.session.step = "gotSpecialization";
});

router.route("gotSpecialization", async (ctx) => {
  await ctx.reply(
    "Какой у тебя опыт работы в выбранной профессии? (в годах)\n\nЕсли у тебя нет опыта работы в этой профессии, напиши “0”."
  );
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
    await ctx.reply(
      'Неверный формат, пожалуйста, введи число. \n\nЕсли у тебя нет опыта работы в этой профессии, напиши "0". '
    );
  } else {
    ctx.session.step = "displayMentors";
  }
});

const displayMentorsMenu = new Menu("display-mentors")
  .text("Показать ещё", (mrctx) => mrctx.reply("You pressed A!"))
  .text("Я нашел", (fndctx) => fndctx.reply("До новых встреч!"))
  .row();

router.route("displayMentors", async (ctx) => {
  if (!ctx.session.mentors || ctx.session.mentors.length === 0) {
    const mentors = await tryToFindMentors();
    ctx.session.mentors = mentors;
    ctx.session.mentorsPage = 1;
    console.log(mentors);
  }

  if (ctx.session.mentors.length > 0) {
    await ctx.reply(`🎉 Я нашел для тебя следующие варианты:`);

    const pagination = paginate(
      ctx.session.mentors.length,
      ctx.session.mentorsPage,
      PAGE_SIZE
    );

    if (ctx.session.mentorsPage > pagination.endPage) {
      await ctx.reply(
        "К сожалению, у нас пока нет подходящих менторов. Если они у нас появятся, мы обязательно тебя уведомим.\n\nА пока мы предлагаем тебе попробовать найти ментора в https://t.me/Nfng_bot\n\nЕсли хочешь вернуться в основное меню, нажми /start (прогресс будет потерян)"
      );
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

    await ctx.reply(
      "Если кто-то из менторов тебе подходит, нажми “Я нашел”: я подскажу тебе следующие шаги.\n\nЕсли хочешь посмотреть еще варианты, нажми “Покажи еще”.\n\nЕсли хочешь начать поиск заново, нажми /start",
      {
        reply_markup: displayMentorsMenu,
      }
    );
  } else {
    await ctx.reply(
      "К сожалению, у нас пока нет подходящих менторов. Если они у нас появятся, мы обязательно тебя уведомим.\n\nА пока мы предлагаем тебе попробовать найти ментора в https://t.me/Nfng_bot\n\nЕсли хочешь вернуться в основное меню, нажми /start (прогресс будет потерян)"
    );
  }
});
filteredComposer.use(displayMentorsMenu);
filteredComposer.use(router);
