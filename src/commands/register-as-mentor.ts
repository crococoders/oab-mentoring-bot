import { Scenes } from 'telegraf';
import { specializationStep } from '../steps/specialization';
import {
  yearsOfExperienceStep,
  validateYearsOfExperience,
} from '../steps/years-of-experience';
import { nameStep } from '../steps/name';

const registerAsMentor = new Scenes.WizardScene(
  'register-as-mentor',
  nameStep,
  specializationStep,
  yearsOfExperienceStep,
  async (ctx) => {
    if (!validateYearsOfExperience(ctx)) {
      await ctx.reply(
        'Неверный формат, пожалуйста, введи число. \n\nЕсли у тебя нет опыта работы в этой профессии, напиши "0". ',
      );
    } else {
      await ctx.reply('Спасибо за регистрацию!');
      return ctx.scene.leave();
    }
  },
);

export default registerAsMentor;
