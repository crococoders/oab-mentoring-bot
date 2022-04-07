import { Bot } from "grammy";
import { limit as rateLimit } from "@grammyjs/ratelimiter";
import { apiThrottler } from "@grammyjs/transformer-throttler";
import { hydrateReply, parseMode } from "parse-mode";
import { BotContext } from "@bot/types";
import { config } from "@bot/config";
import {
  updatesLogger,
  setupSession,
  setupMiddlewareContext,
  setupLogger,
  setupI18n,
  setDefaultLanguage,
} from "@bot/middlewares";
import { start, scenes, languageSelect } from "@bot/features";
import { isMultipleLocales } from "@bot/helpers/i18n";
import { handleError } from "@bot/helpers/error-handler";

export const bot = new Bot<BotContext>(config.BOT_TOKEN);

// Middleware

bot.api.config.use(apiThrottler());
bot.api.config.use(parseMode("HTML"));

if (config.isDev) {
  bot.use(updatesLogger());
}

bot.api
  .setMyCommands([
    {
      command: "start",
      description: "Начать / Жалғастыру",
    },
    {
      command: "find_mentors",
      description: "Найти ментора / Менторды табу",
    },
    {
      command: "edit_profile",
      description: "Изменить профиль / Профильді өзгерту",
    },
    {
      command: "register_as_mentor",
      description: "Зарегестрироваться как ментор / Ментор ретінде тіркелу",
    },
    {
      command: "language",
      description: "Выбрать язык / Тілді өзгерту",
    },
  ])
  .then(() => {
    console.log("commands are set");
  });

bot.use(rateLimit());
bot.use(hydrateReply);
bot.use(setupSession());
bot.use(setupMiddlewareContext());
bot.use(setupLogger());
bot.use(setupI18n());
bot.use(setDefaultLanguage());

// Features

if (isMultipleLocales) {
  bot.use(languageSelect);
}

bot.use(start);
bot.use(scenes.manager());

bot.command("find_mentors", async (ctx) => {
  await ctx.scenes.enter("find_mentors");
});

bot.command("register_as_mentor", async (ctx) => {
  await ctx.scenes.enter("register_as_mentor");
});

bot.command("edit_profile", async (ctx) => {
  await ctx.scenes.enter("edit_profile");
});

bot.use(scenes);

if (config.isDev) {
  bot.catch(handleError);
}
