import { LocaleNegotiator, useFluent } from "@grammyjs/fluent";

import { fluent } from "@bot/helpers/i18n";
import { BotContext } from "@bot/types";

const localeNegotiator = (ctx: BotContext) =>
  (ctx.chat && ctx.session.languageCode) || ctx.from?.language_code;

export const middleware = () =>
  useFluent({
    fluent,
    localeNegotiator: localeNegotiator as LocaleNegotiator,
  });
