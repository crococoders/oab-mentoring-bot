import { specializations } from "@bot/types";
import { InlineKeyboardButton, InlineKeyboardMarkup } from "@grammyjs/types";

export const keyboard: InlineKeyboardMarkup = {
  inline_keyboard: specializations.map((s): InlineKeyboardButton[] => {
    return [
      {
        text: s.name,
        callback_data: s.key,
      },
    ];
  }),
};
