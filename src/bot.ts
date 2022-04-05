import { Bot } from "grammy";
import { limit as rateLimit } from "@grammyjs/ratelimiter";
import { apiThrottler } from "@grammyjs/transformer-throttler";
import { hydrateReply, parseMode } from "parse-mode";
import { Context } from "@bot/types";
import { config } from "@bot/config";
import {
  updatesLogger,
  setupSession,
  setupMiddlewareContext,
  setupLogger,
  setupI18n,
} from "@bot/middlewares";
import { start, scenes, languageSelect } from "@bot/features";
import { isMultipleLocales } from "@bot/helpers/i18n";
import { handleError } from "@bot/helpers/error-handler";

export const bot = new Bot<Context>(config.BOT_TOKEN);

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
      description: "start",
    },
    {
      command: "find_mentors",
      description: "find_mentors",
    },
    {
      command: "register_as_mentor",
      description: "register_as_mentor",
    },
    {
      command: "language",
      description: "language",
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

bot.use(scenes);

if (config.isDev) {
  bot.catch(handleError);
}
