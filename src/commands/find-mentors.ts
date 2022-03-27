import { Scenes } from 'telegraf';
import { specializationStep } from '../steps/specialization';
import {
  yearsOfExperienceStep,
  validateYearsOfExperience,
} from '../steps/years-of-experience';

const findMentors = new Scenes.WizardScene(
  'find-mentors',
  async (ctx: Scenes.WizardContext) => {
    await ctx.reply('Введи своё имя');
    return ctx.wizard.next();
  },
  specializationStep,
  yearsOfExperienceStep,
  async (ctx) => {
    if (!validateYearsOfExperience(ctx)) {
      await ctx.reply(
        'Неверный формат, пожалуйста, введи число. \n\nЕсли у тебя нет опыта работы в этой профессии, напиши "0". ',
      );
    } else {
      await ctx.reply(
        'К сожалению, у нас пока нет подходящих менторов. Если они у нас появятся, мы обязательно тебя уведомим.\n\nА пока мы предлагаем тебе попробовать найти ментора в https://t.me/Nfng_bot\n\nЕсли хочешь вернуться в основное меню, нажми /start (прогресс будет потерян)',
      );
      return ctx.scene.leave();
    }
  },
);

export default findMentors;
