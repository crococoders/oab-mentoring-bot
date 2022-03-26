const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config()

const token = process.env.TELEGRAM_BOT_ACCESS_TOKEN;
const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/echo (.+)/, (msg: { chat: { id: any; }; }, match: any[]) => {  
    const chatId = msg.chat.id;
    const resp = match[1];

    bot.sendMessage(chatId, resp);
  });
  
bot.on('message', (msg: { chat: { id: any; }; }) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, 'Received your message');
  });