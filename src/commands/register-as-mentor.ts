import { Scenes } from 'telegraf';
import {
  stepAfterSpecialization,
  specializationStep,
} from '../steps/specialization';

const registerAsMentor = new Scenes.WizardScene(
  'register-as-mentor',
  async (ctx: Scenes.WizardContext) => {
    await ctx.reply('Введи своё имя');
    return ctx.wizard.next();
  },
  async (ctx) => {
    await ctx.reply('Введи свою фамилию');
    return ctx.wizard.next();
  },
  specializationStep,

  stepAfterSpecialization(
    'Какой у тебя опыт работы в выбранной професси? (в годах)\n\nЕсли у тебя нет опыта работы в этой профессии, напиши “0”. Пожалуйста, укажи целое число (округляй до ближайшего целого).',
  ),
  async (ctx) => {
    await ctx.reply('Спасибо за регистрацию!');
    return ctx.scene.leave();
  },
);

export default registerAsMentor;
