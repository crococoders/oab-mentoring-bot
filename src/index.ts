const TelegramBot = require('node-telegram-bot-api');
const StateMachine = require('javascript-state-machine');
require('dotenv').config();

const token = process.env.TELEGRAM_BOT_ACCESS_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const users = [];

const createFsm = () => {
  return StateMachine.create({
    initial: 'waitingStart',
    final: 'final',
    events: [
      { name: 'gotStart', from: 'waitingStart', to: 'waitingName' },
      { name: 'gotName', from: 'waitingName', to: 'waitingSurname' },
      {
        name: 'gotSurname',
        from: 'waitingSurname',
        to: 'waitingSpecialization',
      },
      {
        name: 'gotSpecialization',
        from: 'waitingSpecialization',
        to: 'waitingYearsOfExperience',
      },
      {
        name: 'gotYearsOfExperience',
        from: 'waitingYearsOfExperience',
        to: 'final',
      },
      { name: 'gotFinal', from: 'gotYearsOfExperience', to: 'final' },
    ],
  });
};

const eventFromStateAndMessageText = (state: any, text: any) => {
  switch (state) {
    case 'waitingStart':
      return text === '/start' && 'gotStart';
    case 'waitingName':
      return 'gotName';
    case 'waitingSurname':
      return 'gotSurname';
    case 'waitingSpecialization':
      return 'gotSpecialization';
    case 'waitingYearsOfExperience':
      return 'gotYearsOfExperience';
    case 'final':
      return 'gotFinal';
  }
};

const start = () => {
  bot.on('message', (message: any) => {
    if (!message.reply_to_message) {
      respondTo(message);
    }
  });

  bot.on('callback_query', (message: any) => {
    console.log('onMessage', message.data);
  });
};

const respondTo = async (message: any) => {
  let fsm = createFsm();
  let lastReply = message;

  let name: any;
  let surname: any;
  let specialization: any;
  let yearsOfExperience: any;

  let lastMessage: any;

  fsm.ongotStart = () => {
    lastMessage = bot.sendMessage(
      message.chat.id,
      'Давай начнём! Как тебя зовут?',
      { reply_markup: JSON.stringify({ force_reply: true }) },
    );
  };

  fsm.ongotName = (event: any, from: any, to: any, message: any) => {
    name = message.text;
    lastMessage = bot.sendMessage(message.chat.id, `Теперь введи фамилию`, {
      reply_markup: JSON.stringify({ force_reply: true }),
    });
  };

  const specializations = {
    inline_keyboard: [
      [
        {
          text: 'Web разработка',
          callback_data: 'web',
        },
        {
          text: 'Мобильная разработка',
          callback_data: 'mobile',
        },
        {
          text: 'UX/UI дизайн',
          callback_data: 'uxui',
        },
        {
          text: 'DevOps',
          callback_data: 'devops',
        },
      ],
    ],
  };

  fsm.ongotSurname = (event: any, from: any, to: any, message: any) => {
    surname = message.text;
    lastMessage = bot.sendMessage(
      message.chat.id,
      `Теперь введи специализацию`,
      {
        reply_markup: JSON.stringify({ force_reply: true }),
      },
    );
  };

  fsm.ongotSpecialization = (event: any, from: any, to: any, message: any) => {
    specialization = message.text;
    lastMessage = bot.sendMessage(
      message.chat.id,
      `Теперь введи сколько у тебя лет опыта`,
      {
        reply_markup: JSON.stringify({ force_reply: true }),
      },
    );
  };

  fsm.ongotYearsOfExperience = (
    event: any,
    from: any,
    to: any,
    message: any,
  ) => {
    yearsOfExperience = message.text;
    fsm.ongotFinal();
  };

  fsm.ongotFinal = () => {
    const user = {
      name: name,
      surname: surname,
      specialization: specialization,
      yearsOfExperience: yearsOfExperience,
    };
    users.push(user);
    lastMessage = bot.sendMessage(
      message.chat.id,
      'Супер, ты зарегестрирован',
      { reply_markup: JSON.stringify({ force_reply: false }) },
    );
  };

  while (!fsm.isFinished()) {
    let text = lastReply.text;
    let event = eventFromStateAndMessageText(fsm.current, text);

    if (!event || fsm.cannot(event)) {
      bot.sendMessage(message.chat.id, 'Я не ожидал этого, /start');
      break;
    }

    fsm[event](lastReply);

    let sentMessage = await lastMessage;
    lastReply = await new Promise((resolve) =>
      bot.onReplyToMessage(
        sentMessage.chat.id,
        sentMessage.message_id,
        resolve,
      ),
    );
  }
};

start();
