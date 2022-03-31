import { Bot } from "grammy";
import { limit as rateLimit } from "@grammyjs/ratelimiter";
import { apiThrottler } from "@grammyjs/transformer-throttler";
import { hydrateReply, parseMode } from "parse-mode";

import { Context } from "@bot/types";
import { config } from "@bot/config";
import {
  updatesLogger,
  setupSession,
  setupContext,
  setupLogger,
  registerUser,
  setupI18n,
} from "@bot/middlewares";
import {
  botAdminFeature,
  languageSelectFeature,
  welcomeFeature,
  // findMentorsFeature,
} from "@bot/features";
import { isMultipleLocales } from "@bot/helpers/i18n";
import { handleError } from "@bot/helpers/error-handler";
import { scenes } from "./scenes";

export const bot = new Bot<Context>(config.BOT_TOKEN);

// Middlewares

bot.api.config.use(apiThrottler());
bot.api.config.use(parseMode("HTML"));

if (config.isDev) {
  bot.use(updatesLogger());
}

bot.use(rateLimit());
bot.use(hydrateReply);
bot.use(setupSession());
bot.use(setupContext());
bot.use(setupLogger());
bot.use(setupI18n());
bot.use(registerUser());

// Handlers

bot.use(botAdminFeature);
bot.use(welcomeFeature);
// bot.use(findMentorsFeature);

bot.use(scenes.manager());

bot.command("find_mentors", async (ctx) => {
  await ctx.scenes.enter("find_mentors");
});

bot.use(scenes);

// if (isMultipleLocales) {
// bot.use(languageSelectFeature);
// }

if (config.isDev) {
  bot.catch(handleError);
}
