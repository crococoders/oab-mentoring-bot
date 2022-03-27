import { Markup, Scenes } from 'telegraf';
import { specializations } from '../types/specialization';

const specializationsKeyboard = Markup.inlineKeyboard(
  specializations.map((s) => {
    return Markup.button.callback(s.name, s.key);
  }),
  {
    wrap: () => true,
  },
);

const specializationStep = async (ctx: Scenes.WizardContext) => {
  await ctx.reply(
    'С какой из следующих профессиональных областей ты связываешь свое дальнейшее карьерное развитие? Выбери одно направление, которое тебе наиболее релевантно. Список направлений кнопками:',
    specializationsKeyboard,
  );
  return ctx.wizard.next();
};

export { specializationStep };
