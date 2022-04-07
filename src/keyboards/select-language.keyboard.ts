import ISO6391 from "iso-639-1";
import { Menu } from "@grammyjs/menu";

import { BotContext } from "@bot/types";
import { logger } from "@bot/logger";
import { locales } from "@bot/helpers/i18n";
import { getMetadata } from "@bot/helpers/logging";
import { capitalizeFirstLetter } from "@bot/helpers/capitalize-first-letter";

export const keyboard = new Menu<BotContext>("language");

for (let index = 1; index <= locales.length; index += 1) {
  const code = locales[index - 1];

  keyboard.text(
    {
      text: (ctx) => {
        const isActivated =
          (ctx.session?.languageCode || ctx.from?.language_code) === code;

        return `${isActivated ? "✅ " : ""}${capitalizeFirstLetter(
          code === "kk.latin" ? "Qazaq tili" : ISO6391.getNativeName(code)
        )}`;
      },
      payload: code,
    },
    async (ctx) => {
      const newLanguageCode = ctx.match;

      logger.info({
        msg: "handle language selection",
        code: newLanguageCode,
        ...getMetadata(ctx),
      });

      if (locales.includes(newLanguageCode)) {
        ctx.session.languageCode = newLanguageCode;

        await ctx.fluent.renegotiateLocale();

        await ctx.editMessageText(ctx.t("language.changed"), {
          reply_markup: keyboard,
        });
      }
    }
  );

  if (index % 2 === 0) {
    keyboard.row();
  }
}
