import { Composer, Scenes } from 'telegraf';
import { MessageChannel } from 'worker_threads';

const yearsOfExperienceStep = new Composer<Scenes.WizardContext>();

yearsOfExperienceStep.action(
  /backend|frontend|mobile|qa|ds|design|pm/,
  async (ctx) => {
    await ctx.reply(
      'Какой у тебя опыт работы в выбранной профессии? (в годах)\n\nЕсли у тебя нет опыта работы в этой профессии, напиши “0”.',
    );
    return ctx.wizard.next();
  },
);

yearsOfExperienceStep.use((ctx) =>
  ctx.replyWithMarkdown('Выбери одно из направлений нажав кнопку.'),
);

const validateYearsOfExperience = (ctx: any) => {
  return !isNaN(parseFloat(ctx.message.text)) && !isNaN(ctx.message.text - 0);
};

export { yearsOfExperienceStep, validateYearsOfExperience };
