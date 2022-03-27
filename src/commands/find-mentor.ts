import { Scenes } from 'telegraf';
import { specializationStep } from '../steps/specialization';
import {
  yearsOfExperienceStep,
  validateYearsOfExperience,
} from '../steps/years-of-experience';

const findMentor = new Scenes.WizardScene(
  'find-mentor',
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
      await ctx.reply('К сожалению, у нас пока нет подходящих менторов.');
      return ctx.scene.leave();
    }
  },
);

export default findMentor;
