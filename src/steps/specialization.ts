import { Markup, Scenes } from 'telegraf';

const specializations = Markup.inlineKeyboard(
  [
    Markup.button.callback('Backend разработка', 'backend'),
    Markup.button.callback('Frontend разработка', 'frontend'),
    Markup.button.callback('Мобильная разработка', 'mobile'),
    Markup.button.callback('QA / Тестирование', 'qa'),
    Markup.button.callback('Data Science', 'ds'),
    Markup.button.callback('UX / UI Дизайн', 'design'),
    Markup.button.callback('Product / Project Менеджмент', 'pm'),
  ],
  {
    wrap: () => true,
  },
);

const specializationStep = async (ctx: Scenes.WizardContext) => {
  await ctx.reply(
    'С какой из следующих профессиональных областей ты связываешь свое дальнейшее карьерное развитие?  Выбери одно направление, которое тебе наиболее релевантно. Список направлений кнопками:',
    specializations,
  );
  return ctx.wizard.next();
};

export { specializationStep };
