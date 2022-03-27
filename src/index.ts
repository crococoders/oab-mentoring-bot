import { Composer, Markup, Scenes, session, Telegraf } from 'telegraf';
require('dotenv').config();

const token = process.env.TELEGRAM_BOT_ACCESS_TOKEN;

if (token === undefined) {
  throw new Error('BOT_TOKEN must be provided!');
}

const bot = new Telegraf<Scenes.WizardContext>(token);

const registerMentor = new Scenes.WizardScene(
  'register-mentor',
  async (ctx: Scenes.WizardContext) => {
    await ctx.reply('Введите своё имя');
    return ctx.wizard.next();
  },
  async (ctx) => {
    await ctx.reply('Введите свою фамилию');
    return ctx.wizard.next();
  },
  async (ctx) => {
    await ctx.reply('Введите свою специализацию');
    return ctx.wizard.next();
  },
  async (ctx) => {
    await ctx.reply('Введите ваше количество лет опыта');
    return ctx.wizard.next();
  },
  async (ctx) => {
    return ctx.scene.leave();
  },
);

const findMentor = new Scenes.WizardScene(
  'find-mentor',
  async (ctx: Scenes.WizardContext) => {
    await ctx.reply('Введи своё имя');
    return ctx.wizard.next();
  },
  async (ctx) => {
    await ctx.reply('Введи свою фамилию');
    return ctx.wizard.next();
  },
  async (ctx) => {
    await ctx.reply(
      'С какой из следующих профессиональных областей ты связываешь свое дальнейшее карьерное развитие?  Выбери одно направление, которое тебе наиболее релевантно. Список направлений кнопками:',
    );
    return ctx.wizard.next();
  },
  async (ctx) => {
    await ctx.reply(
      'Какой у тебя опыт работы в профессии, которую ты выбрал выше (в годах)?\nЕсли у тебя нет опыта работы в этой профессии, напиши “0”. Пожалуйста,укажите целое число (округляй до ближайшего целого).',
    );
    return ctx.wizard.next();
  },
  async (ctx) => {
    await ctx.reply('К сожалению, у нас пока нет подходящих менторов.');
    return ctx.scene.leave();
  },
);

const stage = new Scenes.Stage<Scenes.WizardContext>([
  registerMentor,
  findMentor,
]);
bot.use(session());
bot.use(stage.middleware());

bot.telegram.setMyCommands([
  {
    command: 'find_mentor',
    description: 'Найти ментора',
  },
  {
    command: 'register_mentor',
    description: 'Зарегистрироваться как ментор',
  },
  {
    command: 'start',
    description: 'Начать',
  },
]);

bot.command('register_mentor', async (ctx) => {
  ctx.scene.enter('register-mentor');
});

bot.command('find_mentor', async (ctx) => {
  ctx.scene.enter('find-mentor');
});

bot.command('start', async (ctx) => {
  await ctx.reply(
    'Привет!\nЯ бот для менторства, моя миссия – помогать менторам и менти найти друг друга.\nЧтобы найти ментора, нажми /find_mentor\nЕсли захочешь вернуться в основное меню, нажми /start (прогресс будет потерян).',
  );
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
