import { Composer, Markup, Scenes } from 'telegraf';
import { specializationStep } from '../steps/specialization';
import {
  yearsOfExperienceStep,
  validateYearsOfExperience,
} from '../steps/years-of-experience';
import tryToFindMentors from '../logic/try-to-find-mentors';
import paginate from '../logic/paginate';
import { ExtendedContext } from '../types/extended-context';
import { nameStep } from '../steps/name';

const PAGE_SIZE = 5;

const displayMentorsStep = new Composer<ExtendedContext>();

// displayMentorsStep.action('more', async (ctx) => {
//   console.log('more!!1');
//   await ctx.wizard.selectStep(4);
//   return;
// });

displayMentorsStep.action('found', async (ctx) => {
  await ctx.reply('❤️ Замечательные новости!\n\nУдачи!');
  return ctx.scene.leave();
});

displayMentorsStep.use(async (ctx) => {
  if (
    !ctx.extendedContextData.mentors ||
    ctx.extendedContextData.mentors.length == 0
  ) {
    const mentors = await tryToFindMentors();
    ctx.extendedContextData.mentors = mentors;
    ctx.extendedContextData.mentorsPage = 1;
  }

  if (ctx.extendedContextData.mentors.length > 0) {
    await ctx.reply(`🎉 Я нашел для тебя следующие варианты:`);

    const pagination = paginate(
      ctx.extendedContextData.mentors.length,
      ctx.extendedContextData.mentorsPage++,
      PAGE_SIZE,
    );

    const replies = ctx.extendedContextData.mentors
      .slice(pagination.startIndex, pagination.endIndex + 1)
      .map((mentor) => {
        return ctx.reply(
          `👤 ${mentor.name}\nОпыт: ${mentor.yearsOfExperience} года`,
        );
      });

    await Promise.all(replies);

    await ctx.reply(
      'Если кто-то из менторов тебе подходит, нажми “Я нашел”: я подскажу тебе следующие шаги.\n\nЕсли хочешь посмотреть еще варианты, нажми “Покажи еще”.\n\nЕсли хочешь начать поиск заново, нажми /start',
      Markup.inlineKeyboard([
        Markup.button.callback('Я нашел', 'found'),
        Markup.button.callback('Покажи ещё', 'more'),
      ]),
    );
  } else {
    await ctx.reply(
      'К сожалению, у нас пока нет подходящих менторов. Если они у нас появятся, мы обязательно тебя уведомим.\n\nА пока мы предлагаем тебе попробовать найти ментора в https://t.me/Nfng_bot\n\nЕсли хочешь вернуться в основное меню, нажми /start (прогресс будет потерян)',
    );
    return ctx.scene.leave();
  }
});

const validateYearsOfExperienceStep = async (ctx: any) => {
  if (!validateYearsOfExperience(ctx)) {
    return ctx.reply(
      'Неверный формат, пожалуйста, введи число. \n\nЕсли у тебя нет опыта работы в этой профессии, напиши "0". ',
    );
  } else {
    return ctx.wizard.next();
  }
};

const findMentors = new Scenes.WizardScene(
  'find-mentors',
  nameStep,
  specializationStep,
  yearsOfExperienceStep,
  validateYearsOfExperienceStep,
  displayMentorsStep,
);

export default findMentors;
