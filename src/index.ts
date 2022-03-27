import { Composer, Markup, Scenes, session, Telegraf } from 'telegraf';
import findMentor from './commands/find-mentor';
import registerAsMentor from './commands/register-as-mentor';
require('dotenv').config();

const token = process.env.TELEGRAM_BOT_ACCESS_TOKEN;

if (token === undefined) {
  throw new Error('BOT_TOKEN must be provided!');
}

const stage = new Scenes.Stage<Scenes.WizardContext>([
  registerAsMentor,
  findMentor,
]);

const bot = new Telegraf<Scenes.WizardContext>(token);

bot.use(session());
bot.use(Telegraf.log());
bot.use(stage.middleware());

bot.telegram.setMyCommands([
  {
    command: 'find_mentor',
    description: 'Найти ментора',
  },
  {
    command: 'register_as_mentor',
    description: 'Зарегистрироваться как ментор',
  },
  {
    command: 'start',
    description: 'Начать',
  },
]);

bot.command('register_as_mentor', async (ctx) => {
  ctx.scene.enter('register-as-mentor');
});

bot.command('find_mentor', async (ctx) => {
  ctx.scene.enter('find-mentor');
});

bot.command('start', async (ctx) => {
  console.log('Начат разговор с ', ctx.message.chat.id);

  await ctx.reply(
    'Привет!\nЯ бот для менторства, моя миссия – помогать менторам и менти найти друг друга.\nЧтобы найти ментора, нажми /find_mentor\nЕсли захочешь вернуться в основное меню, нажми /start (прогресс будет потерян).',
  );
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
