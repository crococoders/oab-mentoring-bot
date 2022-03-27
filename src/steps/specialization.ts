import { Composer, Markup, Scenes } from 'telegraf';

const specializations = Markup.keyboard([
  Markup.button.callback('Backend разработка', 'backend'),
  Markup.button.callback('Frontend разработка', 'frontend'),
  Markup.button.callback('Мобильная разработка', 'mobile'),
]).oneTime();

const specializationStep = async (ctx: Scenes.WizardContext) => {
  await ctx.reply(
    'С какой из следующих профессиональных областей ты связываешь свое дальнейшее карьерное развитие?  Выбери одно направление, которое тебе наиболее релевантно. Список направлений кнопками:',
    specializations,
  );
  return ctx.wizard.next();
};

const stepAfterSpecialization = (question: string) => {
  const step = new Composer<Scenes.WizardContext>();

  step.hears(
    /(Backend разработка|Frontend разработка|Мобильная разработка)/,
    async (ctx) => {
      await ctx.reply(question);
      return ctx.wizard.next();
    },
  );

  step.use((ctx) =>
    ctx.replyWithMarkdown('Выбери одно из направлений нажав кнопку.'),
  );

  return step;
};

export { specializationStep, stepAfterSpecialization };
